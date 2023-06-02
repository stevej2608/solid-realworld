import { createSignal, createResource, batch, Resource } from 'solid-js'
import { IUser } from '../api/Api'
import { IApiAgent } from './createAgent'

export interface IAuthorActions {
  pullUser: () => true
  login(email: any, password: any): Promise<void>
  register(username: any, email: any, password: any): Promise<void>
  logout(): void
  updateUser(newUser: any): Promise<void>
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

export function createAuth(agent:IApiAgent, actions: IAuthorActions, setState): Resource<IUser> {

  const [loggedIn, setLoggedIn] = createSignal(false)
  const [currentUser, { mutate }] = createResource(loggedIn, agent.Auth.current)

  // Populate the provided actions container our actions

  Object.assign(actions, {

    pullUser: () => setLoggedIn(true),

    async login(email, password) {
      const { user, errors } = await agent.Auth.login(email, password)
      if (errors) throw errors
      actions.setToken(user.token)
      setLoggedIn(true)
    },

    async register(username, email, password) {
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

    async updateUser(newUser) {
      const { user, errors } = await agent.Auth.save(newUser)
      if (errors) throw errors
      mutate(user)
    }

  })

  return currentUser
}
