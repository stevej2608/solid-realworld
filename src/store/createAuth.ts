import { createSignal, createResource, batch } from 'solid-js'

export interface IAuthorActions {
  pullUser: () => true
  login(email: any, password: any): Promise<void>
  register(username: any, email: any, password: any): Promise<void>
  logout(): void
  updateUser(newUser: any): Promise<void>
}

export function createAuth(agent, actions, setState): InitializedResource<boolean> {
  const [loggedIn, setLoggedIn] = createSignal(false)
  const [currentUser, { mutate }] = createResource(loggedIn, agent.Auth.current)

  // Populate the provided actions container our actions

  Object.assign(actions, {
    pullUser: () => setLoggedIn(true),

    // TODO: Used

    async login(email, password) {
      const { user, errors } = await agent.Auth.login(email, password)
      if (errors) throw errors
      actions.setToken(user.token)
      setLoggedIn(true)
    },

    // TODO: Used

    async register(username, email, password) {
      const { user, errors } = await agent.Auth.register(username, email, password)
      if (errors) throw errors
      actions.setToken(user.token)
      setLoggedIn(true)
    },

    // TODO: used

    logout() {
      batch(() => {
        actions.setToken(undefined)
        mutate(undefined)
      })
    },

    // TODO: used

    async updateUser(newUser) {
      const { user, errors } = await agent.Auth.save(newUser)
      if (errors) throw errors
      mutate(user)
    }
  })

  return currentUser
}
