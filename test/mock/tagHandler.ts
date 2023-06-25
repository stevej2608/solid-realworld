import { rest } from 'msw'
import { tagStore } from './data/tags'
import { API_ROOT } from '../../src/config'

export const tagHandler = rest.get(`${API_ROOT}/tags`, (_, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json(tagStore)
  )
})
