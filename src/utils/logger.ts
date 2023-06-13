import { console } from './tracer'

// https://github.com/baryon/tracer#customize-output-format

export const logger = console({
  format: '{{timestamp}} {{file}}:{{line}} {{message}}',
  dateformat: 'HH:MM:ss'
})
