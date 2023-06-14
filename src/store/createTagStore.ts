import { createResource, InitializedResourceReturn } from 'solid-js'
import { WorldApi } from '../api/RealWorldApi'

import { logger } from '../utils/logger'

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
    logger.info('getTags')
    const { data, error } = await agent.tags.tagsList()
    return data.tags.map(t => t.toLowerCase())
  }

  const [tags] = createResource<string[]>({ initialValue: [] }, fetchTags)

  return tags
}
