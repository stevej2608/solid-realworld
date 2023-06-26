import { setupServer } from 'msw/node'
import { beforeAll, afterAll, afterEach } from 'vitest';
import { rest } from 'msw'
import { articleHandler, articleFeedHandler } from './articleHandler'
import { tagHandler } from './tagHandler'
import { newUserHandler, currentUserHandler } from './users'

// https://mswjs.io/docs/api/setup-server

export const nullHandler = rest.get('d:', (_, res, ctx) => {
  return res(ctx.status(200), ctx.text = "")
})


const server = setupServer(
  tagHandler,
  articleHandler, articleFeedHandler,
  newUserHandler, currentUserHandler
)

const onUnhandledRequest = (req) => {
  console.error(
    'Found an unhandled %s request to %s',
    req.method,
    req.url.href
  )
}

// server.printHandlers()

beforeAll(() => {
  server.listen({ onUnhandledRequest })
})

afterAll(() => server.close())
afterEach(() => server.resetHandlers())

export { server }
