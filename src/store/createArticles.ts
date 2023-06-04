import { createResource, createSignal, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { IArticle, IMultipleArticlesResponse } from '../api/Api'
import { IApiAgent } from './createAgent'

import { IStoreState } from './storeState'

const LIMIT = 10

export interface IArticleActions {
  deleteArticle(slug: string): Promise<void>
  makeFavorite(slug: string): Promise<void>
  unmakeFavorite(slug: string): Promise<void>
  updateArticle(data: IArticle): Promise<void>

  createArticle(newArticle: INewArticle): IArticlesResponse
  loadArticle(slug: string): void
  loadArticles(predicate: string): void
  setPage: (page: number) => void
}

/**
 * Create interface to the articles API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server agent
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createArticles(agent: IApiAgent, actions: IArticleActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<IArticle[]> {
  interface IPredicate {
    myFeed?: string
    favoritedBy?: string
    tag?: string
    author?: string
  }

  function $req(predicate: IPredicate): Promise<IMultipleArticlesResponse> {
    if (predicate.myFeed) return agent.Articles.feed(state.page, LIMIT)
    if (predicate.favoritedBy) return agent.Articles.favoritedBy(predicate.favoritedBy, state.page, LIMIT)
    if (predicate.tag) return agent.Articles.byTag(predicate.tag, state.page, LIMIT)
    if (predicate.author) return agent.Articles.byAuthor(predicate.author, state.page, LIMIT)
    return agent.Articles.all(state.page, LIMIT, predicate)
  }

  const fetchArticles: IArticle | IArticle[] = (args: [string, number], { value }) => {
    console.log('fetchArticles args=[%s]', args[0])

    if (args[0] === 'articles') {
      return $req(args[1]).then(response => {
        const { articles, articlesCount } = response

        queueMicrotask(() => {
          setState({ totalPagesCount: Math.ceil(articlesCount / LIMIT) })
        })

        const articlesMap: { [slug: string]: IArticle } = {}
        for (const article of articles) {
          articlesMap[article.slug] = article
        }
        return articlesMap
      })
    }

    const article = state.articles[args[1]]
    if (article) return value as IArticle

    return agent.Articles.get(args[1]).then(article => {
      return { ...value, [args[1]]: article }
    })
  }

  const [articleSource, setArticleSource] = createSignal()
  const [articles] = createResource<IArticle[]>(articleSource, fetchArticles, { initialValue: {} })

  const addFavorite = (slug: string) => {
    setState('articles', slug, s => ({ favorited: true, favoritesCount: s.favoritesCount + 1 }))
  }

  const removeFavorite = (slug: string) => {
    setState('articles', slug, s => ({ favorited: false, favoritesCount: s.favoritesCount as number - 1 }))
  }

  // Add our actions the provided actions container

  Object.assign(actions, {
    setPage: (page: number) => setState({ page }),

    loadArticles(predicate: string) {
      setArticleSource(['articles', predicate])
    },

    loadArticle(slug: string) {
      setArticleSource(['article', slug])
    },

    async makeFavorite(slug: string) {
      const article = state.articles[slug]
      if (article && !article.favorited) {
        addFavorite(slug)
        try {
          await agent.Articles.favorite(slug)
        } catch (err) {
          removeFavorite(slug)
          throw err
        }
      }
    },

    async unmakeFavorite(slug: string) {
      const article = state.articles[slug]
      if (article && article.favorited) {
        removeFavorite(slug)
        try {
          await agent.Articles.unfavorite(slug)
        } catch (err) {
          addFavorite(slug)
          throw err
        }
      }
    },

    async createArticle(newArticle: INewArticle): IArticlesResponse {
      const { article, errors } = await agent.Articles.create(newArticle)
      if (errors) throw errors
      setState('articles', { [article.slug]: article })
      return article
    },

    async updateArticle(data: IArticle) {
      const { article, errors } = await agent.Articles.update(data)
      if (errors) throw errors
      setState('articles', { [article.slug]: article })
      return article
    },

    async deleteArticle(slug) {
      const article = state.articles[slug]
      setState('articles', { [slug]: undefined })
      try {
        await agent.Articles.del(slug)
      } catch (err) {
        setState('articles', { [slug]: article })
        throw err
      }
    }
  })

  return articles
}
