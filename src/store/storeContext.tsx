import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

import { createAgent } from './createAgent'

import { createArticles, IArticleActions } from './createArticles'
import { createAuth, IAuthorActions } from './createAuth'
import { createCommon, ICommonActions } from './createCommon'
import { createComments } from './createComments'
import { createProfile } from './createProfile'

export interface IStoreContext {
  state: {
    readonly articles: any
    readonly comments: any
    readonly tags: any
    readonly profile: any
    readonly currentUser: any

    page: number
    totalPagesCount: number
    token: string
    appName: string
  }

  actions: IAuthorActions & IArticleActions & ICommonActions
}

export function createApplicationStore() {
  let articles, comments, tags, profile, currentUser

  const [state, setState] = createStore<IStoreContext>({
    get articles() {
      return articles()
    },

    get comments() {
      return comments()
    },

    get tags() {
      return tags()
    },

    get profile() {
      return profile()
    },

    get currentUser() {
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
