import { setupServer } from 'msw/node'
import { beforeAll, afterAll, afterEach } from 'vitest';
import { rest } from 'msw'
import { articleHandler } from './articleHandler'
import { tagHandler } from './tagHandler'

// https://mswjs.io/docs/api/setup-server

export const nullHandler = rest.get('d:', (_, res, ctx) => {
  return res(ctx.status(200), ctx.text = "")
})


const server = setupServer(tagHandler, articleHandler)

// server.printHandlers()

beforeAll(() => {
  server.listen()
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())

export { server }
