import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { articleHandler } from './articleHandler'
import { tagHandler } from './tagHandler'

// The browser-logger if enables causes weird errors. This
// hack is tested prior to enabling the logger

window.name = "JSDOM"

// https://mswjs.io/docs/api/setup-server


export const nullHandler = rest.get('d:', (_, res, ctx) => {
  return res(ctx.status(200), ctx.text = "")
})


const server = setupServer(tagHandler, articleHandler)

// server.printHandlers()

export { server }
