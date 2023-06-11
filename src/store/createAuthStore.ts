import { createSignal, createResource, batch, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, INewUser, IUser, IUserResponse } from '../api/RealWorldApi'
import { IStoreState, ICommonActions } from './storeState'

export interface IAuthorActions extends ICommonActions {
  pullUser: () => true
  login(email: string, password: string): Promise<void>
  register(username: string, email: string, password: string): Promise<void>
  logout(): void
  updateUser(newUser: IUser): Promise<void>
}

/**
 * Create interface to the author API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server API
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createAuthStore(agent: WorldApi, actions: IAuthorActions, setState: SetStoreFunction<IStoreState>): Resource<IUser> {
  const getCurrentUser = async (): IComment[] => {
    const { data, error } = await agent.user.getCurrentUser()
    return data.user
  }

  const [loggedIn, setLoggedIn] = createSignal(false)
  const [currentUser, { mutate }] = createResource(loggedIn, getCurrentUser)

  // Add our actions the provided actions container

  Object.assign(actions, {
    pullUser: () => setLoggedIn(true),

    async login(email: string, password: string) {
      const { data, error } = await agent.users.login({ user: { email, password } })
      if (error) throw error
      actions.setToken(data.user.token)
      setLoggedIn(true)
    },

    async register(username: string, email: string, password: string) {
      const { data, error } = await agent.users.createUser({ user: { username, email, password } })
      if (error) throw error
      actions.setToken(data.user.token)
      setLoggedIn(true)
    },

    logout() {
      batch(() => {
        actions.setToken(undefined)
        mutate(undefined)
      })
    },

    async updateUser(newUser: INewUser) {
      const { data, error } = await agent.user.updateCurrentUser({ user: newUser })
      if (error) throw errors
      mutate(data.user)
    }
  })

  return currentUser
}
