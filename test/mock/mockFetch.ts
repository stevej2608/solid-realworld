
import { articleStore } from './data/articles'
import { tagStore } from './data/tags'
import { API_ROOT } from '../../src/config'

// https://kentcdodds.com/blog/stop-mocking-fetch

async function mockFetch(url, config) {

  if (url === undefined) {
    return
  }

  console.log('mockFetch url=%s', url)
  const pathname = new URL(url).pathname
  switch (pathname) {
    case '/api/articles': {
      const articles = articleStore.articles.slice(0, 10)
      return {
        ok: true,
        status: 200,
        json: async () => ({ articles, articlesCount: articleStore.articlesCount })
      }
    }
    case '/api/tags': {
      return {
        ok: true,
        status: 200,
        json: async () => tagStore
      }
    }
    default: {
      throw new Error(`Unhandled request: ${pathname}`)
    }
  }
}

beforeAll(() => vi.spyOn(window, 'fetch'))
beforeEach(() => window.fetch.mockImplementation(mockFetch))

const server = { fetch: mockFetch}
export { server }
