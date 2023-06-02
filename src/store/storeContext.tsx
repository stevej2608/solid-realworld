import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

import { IArticle, IComment, IProfile, IUser } from '../api/Api'

import { createAgent } from './createAgent'

import { createArticles, IArticleActions } from './createArticles'
import { createAuth, IAuthorActions } from './createAuth'
import { createCommon, ICommonActions } from './createCommon'
import { createComments } from './createComments'
import { createProfile } from './createProfile'

export interface IStoreContext {

  state: {
    readonly articles: IArticle[]
    readonly comments: IComment[]
    readonly tags: string[]
    readonly profile: IProfile
    readonly currentUser: IUser

    page: number
    totalPagesCount: number
    token: string
    appName: string
  }

  actions: IAuthorActions & IArticleActions & ICommonActions
}

export function createApplicationStore(): IStoreContext {

  // Resource accessors - see solidjs createResource()
  // https://www.solidjs.com/docs/latest/api#createresource

  let articles: Resource<IArticle[]>
  let comments: Resource<IComment[]>
  let tags: Resource<string[]>
  let profile: Resource<IProfile>
  let currentUser: Resource<IUser>

  const [state, setState] = createStore<IStoreContext>({

    get articles(): IArticle[] {
      return articles()
    },

    get comments(): Comment[] {
      return comments()
    },

    get tags(): string[] {
      return tags()
    },

    get profile(): IProfile {
      return profile()
    },

    get currentUser(): IUser {
      return currentUser()
    },

    page: 0,
    totalPagesCount: 0,
    token: localStorage.getItem('jwt'),
    appName: 'conduit'
  })

  // Holder for ALL the store's actions

  const actions = {}

  const store = [state, actions]
  const agent = createAgent(store)

  // Instantiate all the resource accessors

  articles = createArticles(agent, actions, state, setState)
  comments = createComments(agent, actions, state, setState)
  tags = createCommon(agent, actions, state, setState)
  profile = createProfile(agent, actions, state, setState)
  currentUser = createAuth(agent, actions, setState)

  return store
}

export const StoreContext = createContext<IStoreContext>()

export function useStore() {
  return useContext<IStoreContext>(StoreContext)
}
