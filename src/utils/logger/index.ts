import { BrowserLog } from './BrowserLog'

export const logger = new BrowserLog({
  format: '{{index}} {{timestamp}} {{message}}{{rhs}}{{file}}:{{line}}',
  dateformat: 'HH:MM:ss'
})

