import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

import { IArticle, IComment, IProfile, IUser } from '../api/Api'

import { createAgent } from './createAgent';

import { createArticles, IArticleActions } from './createArticles'
import { createAuth, IAuthorActions } from './createAuth'
import { createCommon, ICommonActions } from './createCommon'
import { createComments, ICommentsActions } from './createComments'
import { createProfile, IProfileActions } from './createProfile'


export interface IStoreState {

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
export interface IStoreContext {
  state: IStoreState
  actions: IAuthorActions & IArticleActions & ICommonActions & ICommentsActions & IProfileActions
}

export function createApplicationStore(): IStoreContext {

  // Resource accessors - see solidjs createResource()
  // https://www.solidjs.com/docs/latest/api#createresource

  let articlesAccessor: Resource<IArticle[]>
  let commentsAccessor: Resource<IComment[]>
  let tagsAccessor: Resource<string[]>
  let profileAccessor: Resource<IProfile>
  let currentUserAccessor: Resource<IUser>

  const [state, setState] = createStore<IStoreContext>({

    get articles(): IArticle[] {
      return articlesAccessor()
    },

    get comments(): Comment[] {
      return commentsAccessor()
    },

    get tags(): string[] {
      return tagsAccessor()
    },

    get profile(): IProfile {
      return profileAccessor()
    },

    get currentUser(): IUser {
      return currentUserAccessor()
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

  articlesAccessor = createArticles(agent, actions, state, setState)
  commentsAccessor = createComments(agent, actions, state, setState)
  tagsAccessor = createCommon(agent, actions, state, setState)
  profileAccessor = createProfile(agent, actions, state, setState)
  currentUserAccessor = createAuth(agent, actions, setState)

  return store
}

export const StoreContext = createContext<IStoreContext>()

/**
 * Globally accessible application store
 *
 * @returns IStoreContext
 */

export function useStore(): IStoreContext {
  return useContext<IStoreContext>(StoreContext)
}
