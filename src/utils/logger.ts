import { BrowserLog } from './BrowserLog'

export const logger = new BrowserLog({
  format: '{{timestamp}} {{message}}{{rhs}}{{file}}:{{line}}',
  dateformat: 'HH:MM:ss',
})

