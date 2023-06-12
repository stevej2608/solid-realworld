import { createContext, useContext, Resource, InitializedResource } from 'solid-js'
import { createStore } from 'solid-js/store'

import { IArticle, IComment, IProfile, IUser } from '../api/RealWorldApi'
import { WorldApi } from '../api/RealWorldApi'

import { createArticlesStore, IArticleActions } from './createArticlesStore'
import { createUserStore, IUserActions } from './createUserStore'
import { createCommonStore, ICommonActions } from './createCommonStore'
import { createTagStore } from './createTagStore'
import { createCommentsStore, ICommentsActions } from './createCommentsStore'
import { createProfileStore, IProfileActions } from './createProfileStore'

import { IStoreState, IArticleMap } from './storeState'

export interface IActions extends IUserActions, IArticleActions, ICommentsActions, IProfileActions, ICommonActions {}

export type IStoreContext = [state: IStoreState, actions: IActions]

/**
 * Create the application store. This is made available to
 * the application
 *
 * @returns {IStoreContext} The application store
 */

export function createApplicationStore(): IStoreContext {

  let articlesStore: InitializedResource<IArticleMap> = undefined
  let commentsStore: InitializedResource<IComment[]> = undefined
  let tagsStore: InitializedResource<string[]> = undefined
  let profileStore: InitializedResource<IProfile> = undefined
  let currentUserStore: InitializedResource<IUser> = undefined

  const [state, setState] = createStore<IStoreState>({

    // The following getters map each of
    // the resource stores onto the global store

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

    // Additional bits & bobs

    page: 0,
    articleSlug: undefined,
    totalPagesCount: 0,
    token: localStorage.getItem('jwt'),
    appName: 'conduit'
  })

  // Container for ALL the store's actions

  const actions = {}

  // Agent used for communication with the server

  const agent = new WorldApi(state)

  // Instantiate all the resource stores. Each of these functions
  // returns an instance of a solidJS resource state that is updated
  // by machinery embedded in the function that accesses the associated server API
  //
  // The functions also populate the actions container with utility
  // methods that manage the resource

  articlesStore = createArticlesStore(agent, actions, state, setState)
  commentsStore = createCommentsStore(agent, actions, state, setState)
  tagsStore = createTagStore(agent)
  profileStore = createProfileStore(agent, actions, state, setState)
  currentUserStore = createUserStore(agent, actions, setState)

  createCommonStore(actions, state, setState)

  // Return the fully initialised store

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
