import { LogLevel, BrowserLog } from '@holonix/browser-logger'

export const logger = new BrowserLog({
  format: '{{index}} {{timestamp}} {{title}} {{message}}{{rhs}}{{file}}:{{line}}',
  dateformat: 'HH:MM:ss',
  level: LogLevel.INFO
})
