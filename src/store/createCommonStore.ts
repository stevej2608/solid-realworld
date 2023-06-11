import { createEffect, createResource, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, ITagsResponse } from '../api/RealWorldApi'
import { IStoreState, ICommonActions } from './storeState'

/**
 *
 * @param agent
 * @param actions
 * @param state
 * @param setState
 * @returns
 */

export function createCommonStore(agent: WorldApi, actions: ICommonActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<string[]> {
  const getTags = async () => {
    console.log('getTags')
    const tags = await agent.tags.tagsList()
    return tags.data.tags.map(t => t.toLowerCase())
  }

  const [tags] = createResource('tags', getTags, { initialValue: [] })

  // Triggered by change in the store.token state. Save the new
  // token state to the local store.

  createEffect(() => {
    if (state.token) {
      console.log('Add token %s...', state.token.slice(0, 15))
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
