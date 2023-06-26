import { rest } from 'msw'
import { API_ROOT } from '../../src/config'
import { articleStore } from './data/articles'

export const articleHandler = rest.get(`${API_ROOT}/articles`, (req, res, ctx) => {
  let store = articleStore.articles
  const params = req.url.searchParams

  const offset = params.get('offset')
  const limit = params.get('limit')
  const tag = params.get('tag')

  if (tag) {
    store = store.filter((element) => element.tagList.includes(tag) )
  }

  const articles = store.slice(offset, limit)
  return res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json({ articles, articlesCount: articleStore.articlesCount
    }))
})
