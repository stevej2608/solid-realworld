import { rest } from 'msw'
import { API_ROOT } from '../../src/config'
import { articleStore } from './data/articles'

export const articleHandler = rest.get(`${API_ROOT}/articles`, (_, res, ctx) => {
  const articles = articleStore.articles.slice(0, 10)
  return res(ctx.status(200), ctx.json({ articles, articlesCount: articleStore.articlesCount }))
})
