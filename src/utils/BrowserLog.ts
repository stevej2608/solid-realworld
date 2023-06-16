/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import StackTracey from 'stacktracey'
import dateFormat  from 'dateformat'
import * as tinytim from 'tinytim'

import { sprintf } from 'sprintf-js'

export interface ITransport {
  title: 'warn' | 'error' | 'info'
  level: number
  output: any[]
}

export interface Config {
  rootDir: string
  format: string | string[]
  dateformat: string
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

const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/i;
const stackReg2 = /at\s+()(.*):(\d*):(\d*)/i;

/**
 *
 */

export class BrowserLog {

  config: Config
  needStack: boolean

  constructor(userConfig: Config = {}) {
    this.config = { ...defaultConfig, ...userConfig }
    this.needStack = /{{(method|path|line|pos|file|folder|stack)}}/i.test(this.config.format)
  }

  private logMain(level: number, title: string, msg: string) {

    const config = this.config
    const data = {
      timestamp: dateFormat(new Date(), config.dateformat),
      message: '',
      title: title,
      level: level
    }

    data.method = data.path = data.line = data.pos = data.file = data.folder = ''

    if (this.needStack) {
      // get call stack, and analyze it
      // get all file,method and line number
      const stackList = new Error().stack.split('\n').slice(3)
      const s = stackList[config.stackIndex] || stackList[0]
      const sp = stackReg.exec(s) || stackReg2.exec(s)

      if (sp && sp.length === 5) {

        // https://www.npmjs.com/package/stacktracey?activeTab=readme

        const stackTracey = new StackTracey().withSources().items[2]
        // const st = stackTracey.withSources()[2]

        data.method = stackTracey.callee
        data.path = sp[2]
        data.line = stackTracey.line
        data.pos = stackTracey.column
        data.folder = stackTracey.fileShort
        data.file = './' + stackTracey.fileShort
        data.stack = stackList.join('\n')
      }
    }

    config.preprocess(data)

    data.message = msg
    data.output = tinytim.tim(config.format, data)
    config.transport(data)

    return data
  }

  public info(format: string, ...args: any[]) {
    const _msg = sprintf(format, ...args )
    this.logMain(1, 'info', _msg)
  }

  public warn(format: string, ...args: any[]) {
    const _msg = sprintf(2, 'warn',format, ...args )
    this.logMain(_msg)
  }

  public fatal(format: string, ...args: any[]) {
    const _msg = sprintf(3, 'fatal',format, ...args )
    this.logMain(_msg)
  }

}
