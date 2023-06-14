import { tracerSetup, ITransport } from './tracer'

// https://github.com/baryon/tracer#customize-output-format
// https://stackoverflow.com/a/47061161

export const logger = tracerSetup({
  format: '{{timestamp}} {{message}}  [{{file}}:{{line}}]',
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
