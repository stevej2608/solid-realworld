import { createEffect, createResource, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { IApiAgent } from './createAgent'
import { IStoreState, ICommonActions } from './storeState'

/**
 *
 * @param agent
 * @param actions
 * @param state
 * @param setState
 * @returns
 */

export function createCommon(agent: IApiAgent, actions: ICommonActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<string[]> {
  const getTags = async () => {
    console.log('getTags')
    const tags = await agent.Tags.getAll()
    return tags.map(t => t.toLowerCase())
  }

  const [tags] = createResource('tags', getTags, { initialValue: [] })

  // Triggered by change in the store.token state. Save the new
  // token state to the local store.

  createEffect(() => {
    if (state.token) {
      console.log('Add token %s', state.token)
      localStorage.setItem('jwt', state.token)
    } else {
      console.log('Remove token')
      localStorage.removeItem('jwt')
    }
  })

  // login/logout actions call setToken() which updates the
  // token state in the store. This, in turn, triggers
  // the above createEffect()

  actions.setToken = (token: string | undefined) => {
    console.log('setToken tok=%s', token)
    setState({ token })
  }

  return tags
}
