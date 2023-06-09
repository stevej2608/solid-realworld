import { IProfile, IArticle, INewArticle, IUserResponse, IUser, IComment } from '../api/Api'
import { IStoreState } from './storeState'
import { IAuthorActions } from './createAuth'

const API_ROOT = 'https://api.realworld.io/api'

const encode = encodeURIComponent

interface IAgentError {
  errors: string[]
}

interface IAuthAgent {
  current: () => Promise<IUserResponse & IAgentError>
  login: (email: string, password: string) => Promise<IUserResponse & IAgentError>
  register: (username: string, email: string, password: string) => Promise<IUserResponse & IAgentError>
  save: (user: IUser) => Promise<IUserResponse & IAgentError>
}

interface ITagsAgent {
  getAll: () => Promise<string[]>
}

interface IArticlesAgent {
  all: (page: number, lim?: number) => Promise<IArticle[] & IAgentError>
  byAuthor: (author: string, page: number) => Promise<IArticle[] & IAgentError>
  byTag: (tag: string, page: number, lim?: number) => Promise<IArticle[] & IAgentError>

  favorite: (slug: string) => Promise<IArticle & IAgentError>
  unfavorite: (slug: string) => Promise<IArticle & IAgentError>

  favoritedBy: (author: string, page: number) => Promise<IArticle[] & IAgentError>
  feed: () => Promise<IArticle[] & IAgentError>
  get: (slug: string) => Promise<IArticle & IAgentError>

  create: (article: INewArticle) => Promise<IArticle>
  update: (article: IArticle) => Promise<IArticle>
  del: (slug: string) => Promise<IAgentError>
}

interface ICommentsAgent {
  create: (slug: string, comment: string) => Promise<IComment & IAgentError>
  delete: (slug: string, commentId: string) => Promise<IAgentError>
  forArticle: (slug: string) => Promise<IComment & IAgentError>
}

interface IProfileAgent {
  follow: (username: string) => Promise<IProfile & IAgentError>
  get: (username: string) => Promise<IProfile>
  unfollow: (username: string) => Promise<IProfile & IAgentError>
}

export interface IApiAgent {
  Auth: IAuthAgent
  Tags: ITagsAgent
  Articles: IArticlesAgent
  Comments: ICommentsAgent
  Profile: IProfileAgent

  limit: (count: number, p: number) => string
  omitSlug: (article: IArticle) => void
}

type IStoreContext = [state: IStoreState, actions: IAuthorActions]

export function createAgent([state, actions]: IStoreContext): IApiAgent {
  async function send(method: 'send' | 'put' | 'post' | 'delete', url: string, data: object, resKey: string): object {
    const headers = {}
    const opts = { method, headers }

    console.log('send url=%s...', url.slice(1, 20))

    if (data !== undefined) {
      headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(data)
    }

    if (state.token) headers['Authorization'] = `Token ${state.token}`

    let response: Response

    try {
      response = await fetch(API_ROOT + url, opts)
      const json = (await response.json()) as object
      return resKey ? (json[resKey] as object) : json
    } catch (err) {
      if (err && response && response.status === 401) {
        console.log('Network error %s - logging out', err)
        actions.logout()
      }
      return err as string
    }
  }

  const Auth: IAuthAgent = {
    current: () => send('get', '/user', undefined, 'user'),
    login: (email, password) => send('post', '/users/login', { user: { email, password } }),
    register: (username, email, password) => send('post', '/users', { user: { username, email, password } }),
    save: (user: IUser) => send('put', '/user', { user })
  }

  const Tags: ITagsAgent = {
    getAll: (): Promise<string[]> => send('get', '/tags', undefined, 'tags')
  }

  const limit = (count: number, p: number) => `limit=${count}&offset=${p ? p * count : 0}`
  const omitSlug = (article: IArticle) => Object.assign({}, article, { slug: undefined })

  const Articles: IArticlesAgent = {
    all: (page, lim = 10) => send('get', `/articles?${limit(lim, page)}`),
    byAuthor: (author, page) => send('get', `/articles?author=${encode(author)}&${limit(5, page)}`),
    byTag: (tag, page, lim = 10) => send('get', `/articles?tag=${encode(tag)}&${limit(lim, page)}`),
    del: slug => send('delete', `/articles/${slug}`),
    favorite: slug => send('post', `/articles/${slug}/favorite`),
    favoritedBy: (author, page) => send('get', `/articles?favorited=${encode(author)}&${limit(5, page)}`),
    feed: () => send('get', '/articles/feed?limit=10&offset=0'),
    get: slug => send('get', `/articles/${slug}`, undefined, 'article'),
    unfavorite: slug => send('delete', `/articles/${slug}/favorite`),
    update: article => send('put', `/articles/${article.slug}`, { article: omitSlug(article) }),
    create: article => send('post', '/articles', { article })
  }

  const Comments: ICommentsAgent = {
    create: (slug, comment) => send('post', `/articles/${slug}/comments`, { comment }),
    delete: (slug, commentId) => send('delete', `/articles/${slug}/comments/${commentId}`),
    forArticle: slug => send('get', `/articles/${slug}/comments`, undefined, 'comments')
  }

  const Profile: IProfileAgent = {
    follow: username => send('post', `/profiles/${username}/follow`),
    get: username => send('get', `/profiles/${username}`, undefined, 'profile'),
    unfollow: username => send('delete', `/profiles/${username}/follow`)
  }

  const api = { Articles, Auth, Comments, Profile, Tags }

  return api
}
