import { createSignal, createResource, batch, Resource } from 'solid-js'
import { INewUser, IUser } from '../api/Api'
import { IApiAgent } from './createAgent'
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
 * server agent
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createAuth(agent: IApiAgent, actions: IAuthorActions, setState: SetStoreFunction<IStoreState>): Resource<IUser> {
  const [loggedIn, setLoggedIn] = createSignal(false)
  const [currentUser, { mutate }] = createResource(loggedIn, agent.Auth.current)

  // Add our actions the provided actions container

  Object.assign(actions, {
    pullUser: () => setLoggedIn(true),

    async login(email: string, password: string) {
      const { user, errors } = await agent.Auth.login(email, password)
      if (errors) throw errors
      actions.setToken(user.token)
      setLoggedIn(true)
    },

    async register(username: string, email: string, password: string) {
      const { user, errors } = await agent.Auth.register(username, email, password)
      if (errors) throw errors
      actions.setToken(user.token)
      setLoggedIn(true)
    },

    logout() {
      batch(() => {
        actions.setToken(undefined)
        mutate(undefined)
      })
    },

    async updateUser(newUser: INewUser) {
      const { user, errors } = await agent.Auth.save(newUser)
      if (errors) throw errors
      mutate(user)
    }
  })

  return currentUser
}
