import { BrowserLog, ITransport } from './BrowserLog'

export const logger = new BrowserLog({
  format: '{{timestamp}} {{message}}     [{{file}}:{{line}}]',
  dateformat: 'HH:MM:ss',

  transport: function (data: ITransport) {
    if (data.title === 'warn') {
      queueMicrotask(console.warn.bind(console, data.output))
    } else if (data.level > 4) {
      queueMicrotask(console.error.bind(console, data.output))
    } else {
      queueMicrotask(console.log.bind(console, data.output))
    }
  }
})

logger.info('setLogLevel(%s) %d', 'test', 2)
logger.info('setLogLevel(%s) %d', 'test', 3)
logger.info('setLogLevel(%s) %d', 'test', 4)
logger.info('setLogLevel(%s) %d', 'test', 5)
logger.info('setLogLevel(%s) %d', 'test', 6)
