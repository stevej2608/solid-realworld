import { createContext, useContext, Resource } from 'solid-js'
import { createStore } from 'solid-js/store'

import { IArticle, IComment, IProfile, IUser } from '../api/RealWorldApi'
import { WorldApi } from '../api/RealWorldApi'

import { createArticlesStore, IArticleActions } from './createArticlesStore'
import { createAuthStore, IAuthorActions } from './createAuthStore'
import { createCommonStore, ICommonActions } from './createCommonStore'
import { createCommentsStore, ICommentsActions } from './createCommentsStore'
import { createProfileStore, IProfileActions } from './createProfileStore'

import { IStoreState, IArticleMap, ICommonActions } from './storeState'

// export interface IStoreContext {
//   state: IStoreState
//   actions: IAuthorActions & IArticleActions & ICommonActions & ICommentsActions & IProfileActions
// }

export interface IActions extends IAuthorActions, IArticleActions, ICommentsActions, IProfileActions, ICommonActions {}

export type IStoreContext = [state: IStoreState, actions: IActions]

/**
 * Create the application store. This is made available to
 * the application
 *
 * @returns {IStoreContext} The application store
 */

export function createApplicationStore(): IStoreContext {

  // Resource accessors - see solidjs createResource()
  // https://www.solidjs.com/docs/latest/api#createresource

  let articlesStore: () => Resource<IArticleMap> = undefined
  let commentsStore: () => Resource<IComment[]> = undefined
  let tagsStore: () => Resource<string[]> = undefined
  let profileStore: () => Resource<IProfile> = undefined
  let currentUserStore: () => Resource<IUser> = undefined

  const [state, setState] = createStore<IStoreState>({

    // The following getters map each of
    // the sub-stores onto the global store

    get articles(): IArticleMap {
      return articlesStore()
    },

    get comments(): Comment[] {
      return commentsStore()
    },

    get tags(): string[] {
      return tagsStore()
    },

    get profile(): IProfile {
      return profileStore()
    },

    get currentUser(): IUser {
      return currentUserStore()
    },

    // The initial store state

    page: 0,
    totalPagesCount: 0,
    token: localStorage.getItem('jwt'),
    appName: 'conduit'
  })

  // Container for ALL the store's actions

  const actions = {}

  // Agent used for communication with the server

  const agent = new WorldApi(state)

  // Instantiate all the resource stores. The actions container
  // is populated by each of the create methods

  articlesStore = createArticlesStore(agent, actions, state, setState)
  commentsStore = createCommentsStore(agent, actions, state, setState)
  tagsStore = createCommonStore(agent, actions, state, setState)
  profileStore = createProfileStore(agent, actions, state, setState)
  currentUserStore = createAuthStore(agent, actions, setState)

  return [state, actions]
}

export const StoreContext = createContext<IStoreContext>()

/**
 * Globally accessible application store and associated utility
 * functions
 * ```
 *
 * Example:
 *
 *    const [store, { setPage, loadArticles, unfollow, follow }] = useStore()
 *
 *    const article = store.articles[slug]
 *    const comment = store.comments[45]
 *
 *    setPage(page.page + 1)
 *
 *
 * ```
 * @returns IStoreContext - The global application context
 */

export function useStore(): IStoreContext {
  return useContext<IStoreContext>(StoreContext)
}
