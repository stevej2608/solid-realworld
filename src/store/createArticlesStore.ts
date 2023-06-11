import { createResource, createSignal, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, IArticle, INewArticle, IArticleResponse } from '../api/RealWorldApi'
import { IStoreState, IArticleMap } from './storeState'

const LIMIT = 10

export type ITag = 'feed' | 'all'
export interface IPredicate {
  feed?: boolean
  tag?: ITag
  favoritedBy?: string
  author?: string
}

export interface IArticleActions {
  makeFavorite(slug: string): void
  unmakeFavorite(slug: string): void

  createArticle(newArticle: INewArticle): Promise<IArticle>
  updateArticle(data: IArticle): Promise<IArticle>
  deleteArticle(slug: string): Promise<void>

  loadArticle(slug: string): void
  loadArticles(predicate: IPredicate): void

  setPage: (page: number) => void
}

/**
 * Create interface to the articles API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server API
 */

export function createArticlesStore(agent: WorldApi, actions: IArticleActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<IArticle[]> {

  const $req = async (predicate: IPredicate) => {
    const args = { offset: state.page * LIMIT, limit: LIMIT }

    if (predicate.myFeed) {
      console.log('getArticlesFeed args=%s', JSON.stringify(args))

      // https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints/#feed-articles

      return await agent.articles.getArticlesFeed(args)
    }

    if (predicate.favoritedBy) args.favorited = predicate.favoritedBy
    if (predicate.tag) args.tag = predicate.tag
    if (predicate.author) args.author = predicate.author

    // https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints/#list-articles

    console.log('getArticles args=%s', JSON.stringify(args))
    return await agent.articles.getArticles(args)
  }

  const fetchArticles = async (args: [string, IPredicate | string], { value }: IArticleMap): IArticleMap => {

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

    const slug: string = args[1]
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
    setPage: (page: number) => {
      console.log('setPage(%d)', page)
      setState({ page })
    },

    loadArticles(predicate: IPredicate) {
      setArticleSource(['articles', predicate])
    },

    loadArticle(slug: string) {
      setArticleSource(['article', slug])
    },

    async makeFavorite(slug: string) {
      const article = state.articles[slug]
      if (article && !article.favorited) {
        addFavorite(slug)
        const { data, error } = await agent.articles.createArticleFavorite(slug)
        if (error) {
          removeFavorite(slug)
          throw error
        }
      }
    },

    async unmakeFavorite(slug: string) {
      const article = state.articles[slug]
      if (article && article.favorited) {
        removeFavorite(slug)
        const { data, error } = await agent.articles.deleteArticleFavorite(slug)
        if (error) {
          addFavorite(slug)
          throw err
        }
      }
    },

    async createArticle(article: INewArticle): Promise<IArticle> {
      const { data, error } = await agent.articles.createArticle({ article })
      if (error) throw error
      setState('articles', { [data.article.slug]: data.article })
      return data.article
    },

    async updateArticle(article: IArticle): Promise<IArticle> {
      const { data, error } = await agent.articles.updateArticle(article.slug, { article })
      if (error) throw error
      setState('articles', { [data.article.slug]: data.article })
      return data.article
    },

    async deleteArticle(slug: string) {
      const article = state.articles[slug]
      setState('articles', { [slug]: undefined })
      const [data, error] = await agent.articles.deleteArticle(slug)
      if (error) {
        setState('articles', { [slug]: article })
        throw err
      }
    }

  })

  return articles
}
