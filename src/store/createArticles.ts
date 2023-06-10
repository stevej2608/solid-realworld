import { createResource, createSignal, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { IApi, IArticle, INewArticle, IArticleResponse } from '../api/Api'
import { IStoreState, IArticleMap } from './storeState'

const LIMIT = 10

export interface IArticleActions {
  makeFavorite(slug: string): void
  unmakeFavorite(slug: string): void

  createArticle(newArticle: INewArticle): Promise<IArticle>
  updateArticle(data: IArticle): Promise<IArticle>
  deleteArticle(slug: string): Promise<void>

  loadArticle(slug: string): void
  loadArticles(predicate: string): void

  setPage: (page: number) => void
}

/**
 * Create interface to the articles API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server agent
 */

export function createArticles(agent: IApi, actions: IArticleActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<IArticle[]> {
  interface IPredicate {
    myFeed?: string
    favoritedBy?: string
    tag?: string
    author?: string
  }

  const $req = async (predicate: IPredicate): IArticleResponse => {
    const args = { offset: state.page, limit: LIMIT }

    if (predicate.myFeed) {
      return await agent.articles.getArticlesFeed(args)
    }

    if (predicate.favoritedBy) args.favorited = predicate.favoritedBy
    if (predicate.tag) args.tag = predicate.tag
    if (predicate.author) args.author = predicate.author

    return await agent.articles.getArticles(args)
  }

  const fetchArticles = async (args: [string, string], { value }: IArticleMap): IArticleMap => {
    console.log('fetchArticles args=%o', args)

    if (args[0] === 'articles') {
      const { data, error } = await $req(args[1])

      if (error) throw error

      const { articles, articlesCount } = data

      queueMicrotask(() => {
        setState({ totalPagesCount: Math.ceil(articlesCount / LIMIT) })
      })

      // Convert received array of articles to a map keyed on the slug

      const articlesMap: { [slug: string]: IArticle } = {}
      for (const article of articles) {
        articlesMap[article.slug] = article
      }
      return articlesMap
    }

    // Retrieve a single article, test if we already have it

    const slug = args[1]
    if (slug in state.articles) {
      return state.articles[slug]
    }

    // Get the article from the server

    const { data, error } = await agent.articles.getArticle(slug)
    if (error) throw error

    return { ...value, [slug]: data.article }
  }

  const [articleSource, setArticleSource] = createSignal()
  const [articles] = createResource<IArticle[]>(articleSource, fetchArticles, { initialValue: {} })

  const addFavorite = (slug: string) => {
    setState('articles', slug, s => ({ favorited: true, favoritesCount: s.favoritesCount + 1 }))
  }

  const removeFavorite = (slug: string) => {
    setState('articles', slug, s => ({ favorited: false, favoritesCount: s.favoritesCount - 1 }))
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
          await agent.articles.createArticleFavorite(slug)
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
          await agent.articles.deleteArticleFavorite(slug)
        } catch (err) {
          addFavorite(slug)
          throw err
        }
      }
    },

    async createArticle(newArticle: INewArticle): Promise<IArticle> {
      const article = await agent.articles.createArticle(newArticle)
      setState('articles', { [article.slug]: article })
      return article
    },

    async updateArticle(data: IArticle): Promise<IArticle> {
      const article = await agent.articles.updateArticle(data)
      setState('articles', { [article.slug]: article })
      return article
    },

    async deleteArticle(slug: string) {
      const article = state.articles[slug]
      setState('articles', { [slug]: undefined })
      try {
        await agent.articles.deleteArticle(slug)
      } catch (err) {
        setState('articles', { [slug]: article })
        throw err
      }
    }
  })

  return articles
}
