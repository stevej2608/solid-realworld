import { IProfile, IArticle, INewArticle, IUserResponse } from '../api/Api'

const API_ROOT = 'https://api.realworld.io/api'

const encode = encodeURIComponent

interface IAgentError {
  errors: string[]
}

interface IAuthAgent {
  current: () => Promise<any>
  login: (email: string, password: string) => Promise<IUserResponse & IAgentError>
  register: (username: string, email: string, password: string) => Promise<IUserResponse & IAgentError>
  save: (user: IUser) => Promise<IUserResponse & IAgentError>
}

interface ITagsAgent {
  getAll: () => Promise<string[]>
}

interface IArticlesAgent {
  all: (page: number, lim?: number) => Promise<IArticle[]>
  byAuthor: (author: string, page: number) => Promise<IArticle[]>
  byTag: (tag: string, page: number, lim?: number) => Promise<IArticle[]>

  favorite: (slug: string) => Promise<any>
  unfavorite: (slug: string) => Promise<any>

  favoritedBy: (author: string, page: number) => Promise<IArticle[]>
  feed: () => Promise<IArticle[]>
  get: (slug: string) => Promise<IArticle>

  create: (article: INewArticle) => Promise<IArticle>
  update: (article: IArticle) => Promise<IArticle>
  del: (slug: string) => Promise<any>
}

interface ICommentsAgent {
  create: (slug: string, comment: string) => Promise<any>
  delete: (slug: string, commentId: string) => Promise<any>
  forArticle: (slug: string) => Promise<any>
}

interface IProfileAgent {
  follow: (username: any) => Promise<any>
  get: (username: string) => Promise<IProfile>
  unfollow: (username: any) => Promise<any>
}

export interface IApiAgent {
  Auth: IAuthAgent
  Tags: ITagsAgent
  Articles: IArticlesAgent
  Comments: ICommentsAgent
  Profile: IProfileAgent

  limit: (count: any, p: any) => string
  omitSlug: (article: any) => any
}

export function createAgent([state, actions]): IApiAgent {
  async function send(method, url, data, resKey) {
    const headers = {}
    const opts = { method, headers }

    console.log('send url=%s', url)

    if (data !== undefined) {
      headers['Content-Type'] = 'application/json'
      opts.body = JSON.stringify(data)
    }

    if (state.token) headers['Authorization'] = `Token ${state.token}`

    try {
      const response = await fetch(API_ROOT + url, opts)
      const json = await response.json()
      return resKey ? json[resKey] : json
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        actions.logout()
      }
      return err
    }
  }

  const Auth: IAuthAgent = {
    current: () => send('get', '/user', undefined, 'user'),
    login: (email, password) => send('post', '/users/login', { user: { email, password } }),
    register: (username, email, password) => send('post', '/users', { user: { username, email, password } }),
    save: user => send('put', '/user', { user })
  }

  const Tags: ITagsAgent = {
    getAll: (): Promise<string[]> => send('get', '/tags', undefined, 'tags')
  }

  const limit = (count: number, p: number) => `limit=${count}&offset=${p ? p * count : 0}`
  const omitSlug = article => Object.assign({}, article, { slug: undefined })

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
