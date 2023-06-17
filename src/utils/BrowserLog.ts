/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Minimal reworked version of tracer with source mapped line numbers
 *
 * https://www.npmjs.com/package/tracer
 * https://www.npmjs.com/package/stacktracey
 */

import StackTracey from 'stacktracey'
import dateFormat from 'dateformat'
import * as tinytim from 'tinytim'

import { sprintf } from 'sprintf-js'

import { TextFit } from './TextFit'

export interface ITransport {
  title: 'warn' | 'error' | 'info'
  level: number
  output: any[]
}

export interface Config {
  rootDir: string
  format: string | string[]
  dateformat: string

  charactersPerLine: () => number
  preprocess?: (...args: any[]) => any
  transport: (data: ITransport) => any

  filters: ((...args: any[]) => any)[]
  level: string | number
  // methods: string[]
  stackIndex: number
  inspectOpt: {
    showHidden: boolean
    depth: number
  }
  supportConsoleMethods?: boolean
}

const defaultConfig: Config = {
  rootDir: '',
  format: '{{timestamp}} <{{title}}>{{rhs}}{{file}}:{{line}}',
  dateformat: 'isoDateTime',

  charactersPerLine: () => {
    return Math.floor(window.innerWidth / 7)
  },

  preprocess: function () {
    // NO ACTION
  },

  transport: function (data: ITransport) {
    if (data.title === 'warn') {
      queueMicrotask(console.warn.bind(console, data.output))
    } else if (data.level > 4) {
      queueMicrotask(console.error.bind(console, data.output))
    } else {
      queueMicrotask(console.log.bind(console, data.output))
    }
  },

  filters: [],
  level: 'log',
  //methods: ['log', 'trace', 'debug', 'info', 'warn', 'error', 'fatal'],
  stackIndex: 0,
  inspectOpt: {
    showHidden: false,
    depth: 2
  },
  supportConsoleMethods: true
}

// Stack trace format :
// https://github.com/v8/v8/wiki/Stack%20Trace%20API

const stackRegex1 = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i
const stackRegex2 = /at\s+()(.*):(\d*):(\d*)/i

/**
 *
 */

export class BrowserLog {
  config: Config
  needStack: boolean
  textFit: TextFit

  constructor(userConfig: Config = {}) {
    this.config = { ...defaultConfig, ...userConfig }
    this.needStack = /{{(method|path|line|pos|file|folder|stack)}}/i.test(this.config.format)
  }

  private async logMain(level: number, title: string, msg: string) {
    const config = this.config
    const data = {
      timestamp: dateFormat(new Date(), config.dateformat),
      message: '',
      title: title,
      level: level
    }

    data.method = data.path = data.line = data.pos = data.file = data.folder = ''

    if (this.needStack) {

      // Pop the recent frames, so stackList[0] will be the
      // log message call

      const stackList = new Error().stack.split('\n').slice(4)

      // Allow user the reference higher up the stack, otherwise
      // just reference the log message call location

      const logLoc = (stackList[config.stackIndex] || stackList[0]) + '\n'

      // Use regex to split the stack location message
      //
      // "at BrowserLog.info (http://localhost:3000/src/utils/BrowserLog.ts?t=1686990478223:90:10)",
      // "BrowserLog.info",
      // "http://localhost:3000/src/utils/BrowserLog.ts?t=1686990478223",
      // "90",
      // "10",

      const locationRecord = stackRegex1.exec(logLoc) || stackRegex2.exec(logLoc)

      if (locationRecord && locationRecord.length === 5) {
        // https://www.npmjs.com/package/stacktracey?activeTab=readme

        const stack = new StackTracey(logLoc)
        const top = (await stack.withSourcesAsync()).items[0]

        data.method = top.callee
        data.path = locationRecord[2]
        data.line = top.line
        data.pos = top.column
        data.folder = top.fileShort
        data.file = './' + top.fileShort
        data.stack = stackList.join('\n')
      }
    }

    config.preprocess(data)

    data.message = msg

    const fmt = config.format.split('{{rhs}}')

    if (fmt.length > 1) {
      const lhs: string = tinytim.tim(fmt[0], data)
      const rhs: string = tinytim.tim(fmt[1], data)
      const pad: number = config.charactersPerLine() - (lhs.length + rhs.length)

      data.output = `${lhs} ${rhs.padStart(pad + rhs.length, ' ')}`
    } else {
      data.output = tinytim.tim(config.format, data)
    }

    config.transport(data)
    return data
  }

  private logMainPromise(level: number, title: string, msg: string) {
    this.logMain(1, 'info', msg)
      .then(data => {
        // NO ACTION
      })
      .catch(error => {
        console.log(error)
      })
  }

  public info(format: string, ...args: any[]) {
    const msg = sprintf(format, ...args)
    this.logMainPromise(1, 'info', msg)
  }

  public warn(format: string, ...args: any[]) {
    const msg = sprintf(format, ...args)
    this.logMainPromise(2, 'warn', msg)
  }

  public fatal(format: string, ...args: any[]) {
    const msg = sprintf(format, ...args)
    this.logMainPromise(3, 'error', msg)
  }
}
