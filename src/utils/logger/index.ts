import { LogLevel, BrowserLog } from '@holonix/browser-logger'

const browserLogger = () => {
  return new BrowserLog({
    format: '{{index}} {{timestamp}} {{title}} {{message}}{{rhs}}{{file}}:{{line}}',
    dateformat: 'HH:MM:ss',
    level: LogLevel.INFO
  })
}

const nullLogger = () => {
  return {
    info: () => {},
    warn: () => {},
    setLevel: () => {},
  }
}

const isBrowser = () => {
  return window.name !== "JSDOM"
}

const logger = isBrowser() ? browserLogger() : nullLogger()

export { logger, LogLevel }