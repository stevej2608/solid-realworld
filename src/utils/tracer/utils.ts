/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

import inspect from 'browser-util-inspect'

export function union(obj: any, args: any[]) {
  for (let i = 0, len = args.length; i < len; i += 1) {
    const source = args[i]
    for (const prop in source) {
      obj[prop] = source[prop]
    }
  }
  return obj
}

const formatRegExp = /%[sdjt]/g

import * as util from 'util'

export function format(f: string, args) {
  // const inspectOpt = this.inspectOpt
  let i = 0
  // if (typeof f !== 'string') {
  //   const objects = []
  //   for (; i < args.length; i++) {
  //     objects.push(inspect(args[i], inspectOpt))
  //   }
  //   return objects.join(' ')
  // }
  i = 1
  let str = String(f).replace(formatRegExp, function (x) {
    switch (x) {
      case '%s':
        return String(args[i++])
      case '%d':
        return Number(args[i++])
      case '%j':
        try {
          if (args[i] instanceof Error) {
            return JSON.stringify(args[i++], ['message', 'stack', 'type', 'name'])
          } else {
            return JSON.stringify(args[i++])
          }
        } catch (e) {
          return '[Circular]'
        }
      case '%t':
        return inspect(args[i++], inspectOpt)
      default:
        return x
    }
  })
  for (let len = args.length, x = args[i]; i < len; x = args[++i]) {
    if (x === null || typeof x !== 'object') {
      str += ' ' + x
    } else {
      str += ' ' + inspect(x, inspectOpt)
    }
  }
  return str
}
