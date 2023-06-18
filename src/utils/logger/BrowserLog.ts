/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { sprintf } from 'sprintf-js'

import { tim } from './tinytim'
import { PromiseQueue } from './PromiseQueue'

// export enum ILevel {
//   LOG = "log",
//   TRACE = "trace",
//   DEBUG = "debug",
//   INFO = "info",
//   WARN = "warn",
//   ERROR = "error",
//   FATAL = "fatal"
// }

export enum ILevel {
  LOG = 1,
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL
}


export interface ITransport {
  title: 'warn' | 'error' | 'info'
  level: number
  output: any[]
}

interface ILogProps {
  level: ILevel
  msg: string
  index: number
  errorStack : Error
}

export interface Config {
  rootDir: string
  format: string | string[]
  dateformat: string
  indexFormat: string

  charactersPerLine: () => number
  preprocess?: (...args: any[]) => any
  transport: (data: ITransport) => any

  filters: ((...args: any[]) => any)[]
  level: ILevel
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
  indexFormat: "%03s",

  charactersPerLine: () => {
    return 180
  },

  preprocess: function () {
    // NO ACTION
  },

  transport: function (data: ITransport) {
    if (data.title === ILevel[ILevel.WARN]) {
      queueMicrotask(console.log.bind(console, `%c${data.output}`, "color:yellow"))
    } else if (data.level > 4) {
      queueMicrotask(console.log.bind(console, `%c${data.output}`, "color:red"))
    } else {
      queueMicrotask(console.log.bind(console, data.output))
    }
  },

  filters: [],
  level: ILevel.INFO,
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
const stackRegex3 = /.*?@()(.*):(\d*):(\d*)/i

/**
 *
 */

export class BrowserLog {

  config: Config
  needStack: boolean
  textFit: TextFit
  logIndex: number
  queue: PromiseQueue

  constructor(userConfig: Config = {}) {
    this.config = { ...defaultConfig, ...userConfig }
    this.needStack = /{{(method|path|line|pos|file|folder|stack)}}/i.test(this.config.format)
    this.logIndex = 0
    this.queue = new PromiseQueue()
  }

  private async logMain(args: ILogProps) {
    const { level, msg, errorStack } = args
    const config = this.config
    const data = {
      timestamp: dateFormat(new Date(), config.dateformat),
      index: sprintf(this.config.indexFormat, ++this.logIndex),
      message: '',
      title: ILevel[level],
      level: level
    }

    data.method = data.path = data.line = data.pos = data.file = data.folder = ''

    if (this.needStack) {

      // Pop the recent frames, so stackList[0] will be the
      // log message call
      //
      // Some stack dumps start with an error line, others don't

      // console.log('%s', errorStack.stack)

      const drop = errorStack.stack.startsWith('Error') ? 3 : 2

      const stackList = errorStack.stack.split('\n').slice(drop)

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

      const locationRecord = stackRegex1.exec(logLoc) || stackRegex2.exec(logLoc) || stackRegex3.exec(logLoc)

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
      else {
        console.log('Unable to decode stack:\n%s', errorStack.stack)
      }
    }

    config.preprocess(data)

    data.message = msg

    const fmt: string[] = config.format.split('{{rhs}}')

    if (fmt.length > 1) {
      const lhs: string = tim(fmt[0], data)
      const rhs: string = tim(fmt[1], data)
      const pad: number = config.charactersPerLine() - (lhs.length + rhs.length)

      data.output = `${lhs} ${rhs.padStart(pad + rhs.length, ' ')}`
    } else {
      data.output = tim(config.format, data)
    }

    config.transport(data)
    return data
  }

  /**
   * We need queue the log messages in order of submission since
   * the resolution of the source file & line number via a source map
   * request relies on network activity. Having several simultaneous
   * request in progress could result the log messages being
   * reported in the wrong order.
   */

  private queueLogMessage(args: ILogProps) {

    if (this.needStack) {
      args.errorStack = new Error()
    }

    this.queue.enqueue(() => this.logMain(args))
      .then(data => {
        // NO ACTION
      })
      .catch(error => {
        console.log(error)
      })
  }

  public log(format: string, ...args: any[]) {
    if (ILevel.LOG < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.LOG, msg })
  }

  public trace(format: string, ...args: any[]) {
    if (ILevel.TRACE < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.TRACE, msg })
  }

  public debug(format: string, ...args: any[]) {
    if (ILevel.DEBUG < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.DEBUG, msg })
  }

  public info(format: string, ...args: any[]) {
    if (ILevel.INFO < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.INFO, msg })
  }

  public warn(format: string, ...args: any[]) {
    if (ILevel.WARN < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.WARN, msg })
  }

  public error(format: string, ...args: any[]) {
    if (ILevel.ERROR < this.config.level) return
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level:ILevel.ERROR, msg })
  }

  public fatal(format: string, ...args: any[]) {
    const msg = sprintf(format, ...args)
    this.queueLogMessage({ level: ILevel.FATAL, msg })
  }

  public setLevel(level: ILevel) {
    this.config.level = level
  }
}
