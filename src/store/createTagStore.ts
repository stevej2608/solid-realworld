import { createEffect, createResource, InitializedResourceReturn } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, ITagsResponse } from '../api/RealWorldApi'
import { IStoreState, ICommonActions } from './storeState'

/**
 * Create interface to the tags API endpoint.
 *
 * @param agent
 * @param actions
 * @param state
 * @param setState
 * @returns
 */

export function createTagStore(agent: WorldApi): InitializedResourceReturn<string[]> {

  const fetchTags = async (): string[] => {
    console.log('getTags')
    const { data, error } = await agent.tags.tagsList()
    return data.tags.map(t => t.toLowerCase())
  }

  const [tags] = createResource<string[]>({ initialValue: [] }, fetchTags)

  return tags
}
