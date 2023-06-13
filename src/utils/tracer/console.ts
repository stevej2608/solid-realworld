/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import dateFormat  from 'dateformat'
import * as tim from './tim'
import * as utils from './utils'
import { settings } from './settings'
import * as path from './path'

interface Config {
  rootDir: string
  format: string | string[]
  dateformat: string
  preprocess?: (...args: any[]) => any
  transport: (...args: any[]) => any
  filters: ((...args: any[]) => any)[]
  level: string | number
  methods: string[]
  stackIndex: number
  inspectOpt: {
    showHidden: boolean
    depth: number
  }
  supportConsoleMethods?: boolean
}

function noop() {
  NOACTION
}

function logMainX(config: Config, level: number, title: string, format: string, filters: any[], needstack: boolean, args: any[]) {
  let output = config.preprocess.apply(this, args)

  if (output == null) {
    if (needstack && config.stackIndex > 0) args = getArgsAndStack(config.stackIndex, args)

    output = utils.format(format, {
      level: config.methods[level],
      title,
      timestamp: config.dateformat ? dateFormat(new Date(), config.dateformat) : new Date(),
      ...args[0]
    })
  }

  if (filters && filters.length > 0) {
    let i = 0
    const next = function (output) {
      if (i === filters.length) {
        transport(output)
        return
      }
      filters[i++](output, next)
    }
    next(output)
  } else {
    config.transport(output)
  }
}

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API
const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

// main log method
function logMain(config: Config, level: number, title: string, format: string, filters: any[], needstack: boolean, args: any[]) {
  //check level of global settings
  let gLevel = settings.level
  if (typeof gLevel == 'string') gLevel = config.methods.indexOf(gLevel)
  if (level < gLevel) {
    return
  }

  const data = {
    timestamp: dateFormat(new Date(), config.dateformat),
    message: '',
    title: title,
    level: level,
    args: args
  }
  data.method = data.path = data.line = data.pos = data.file = data.folder = ''

  if (needstack) {
    // get call stack, and analyze it
    // get all file,method and line number
    const stacklist = new Error().stack.split('\n').slice(3)
    const s = stacklist[config.stackIndex] || stacklist[0],
      sp = stackReg.exec(s) || stackReg2.exec(s)
    if (sp && sp.length === 5) {
      data.method = sp[1]
      data.path = sp[2]
      data.line = sp[3]
      data.pos = sp[4]
      data.folder = ''
      // data.folder = path.dirname(
      //   config.rootDir && path.isAbsolute(config.rootDir) ? data.path.replace(new RegExp('^' + config.rootDir + path.sep + '?'), '') : path.resolve(data.path)
      // )
      data.file = path.basename(data.path)

      data.stack = stacklist.join('\n')
    }
  }

  config.preprocess(data)
  const msg = utils.format.apply(config, data.args)
  data.message = msg

  // call micro-template to ouput
  data.output = tim.tim(format, data)

  // save unprocessed output
  data.rawoutput = data.output

  // process every filter method
  const len = filters.length
  for (let i = 0; i < len; i += 1) {
    data.output = fwrap(filters[i])(data.output)
    if (!data.output) return data
    // cancel next process if return a false(include null, undefined)
  }
  // trans the final result
  config.transport.forEach(function (tras) {
    tras(data)
  })
  return data
}

function getArgsAndStack(stackIndex: number, args: any[]) {
  const stacklist = new Error().stack.split(/\n/)
  const callstack = stacklist.slice(3, 3 + stackIndex).join('\n')
  args.unshift(callstack)
  return args
}

function transport(output: string) {
  if (title == 'warn') {
    console.warn(output)
  } else if (level > 4) {
    console.error(output)
  } else {
    console.log(output)
  }
}

export default function (userConfig?: Config[], ...args) {
  // default config
  const defaultConfig: Config = {
    rootDir: '',
    format: '{{timestamp}} <{{title}}> {{file}}:{{line}} ({{method}}) {{message}}',
    dateformat: 'isoDateTime',

    preprocess: function () {
      // NO ACTION
    },

    transport: function (data) {
      if (data.title == 'warn') {
        console.warn(data.output)
      } else if (data.level > 4) {
        console.error(data.output)
      } else {
        console.log(data.output)
      }
    },
    filters: [],
    level: 'log',
    methods: ['log', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'],
    stackIndex: 0,
    inspectOpt: {
      showHidden: false,
      depth: 2
    },
    supportConsoleMethods: true
  }

  const config: Config[] = args

  if (typeof userConfig[0] === 'string') {
    userConfig = [require(userConfig[0])]
  }

  // union user's config and default
  const _config = { ...defaultConfig, ...userConfig }

  const _self: any = {}
  _config.format = Array.isArray(_config.format) ? _config.format : [_config.format]
  _config.filters = Array.isArray(_config.filters) ? _config.filters : [_config.filters]
  _config.transport = Array.isArray(_config.transport) ? _config.transport : [_config.transport]

  let fLen = _config.filters.length
  let lastFilter: any
  if (fLen > 0)
    if (Object.prototype.toString.call(_config.filters[--fLen]) != '[object Function]') {
      lastFilter = _config.filters[fLen]
      _config.filters = _config.filters.slice(0, fLen)
    }

  if (typeof _config.level == 'string') _config.level = _config.methods.indexOf(_config.level)

  _config.methods.forEach((title, i) => {
    if (i < _config.level) _self[title] = noop
    else {
      let format = _config.format[0]
      if (_config.format.length === 2 && _config.format[1][title]) format = _config.format[1][title]
      const needstack = /{{(method|path|line|pos|file|folder|stack)}}/i.test(format)
      let filters: any[]
      if (lastFilter && lastFilter[title]) filters = Array.isArray(lastFilter[title]) ? lastFilter[title] : [lastFilter[title]]
      else filters = _config.filters

      // interface
      _self[title] = function (...args: any[]) {
        return logMain(_config, i, title, format, filters, needstack, args)
      }
    }
  })

  if (_config.supportConsoleMethods) {
    Object.getOwnPropertyNames(console).forEach(title => {
      if (!_self[title]) {
        _self[title] = console[title]
      }
    })
  }

  return _self
}
