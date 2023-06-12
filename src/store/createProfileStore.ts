import { createSignal, createResource, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, IProfile } from '../api/RealWorldApi'
import { IStoreState } from './storeState'

export interface IProfileActions {
  loadProfile(name: string): void
  follow(): Promise<void>
  unfollow(): Promise<void>
}

/**
 * Create interface to the profile API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server API
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createProfileStore(agent: WorldApi, actions: IProfileActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): InitializedResource<IProfile> {

  const getProfile = async (username: string) => {
    const { data, error } = await agent.profiles.getProfileByUsername(username)
    return data.profile
  }

  const [username, setUsername] = createSignal<string>()
  const [profile] = createResource<IProfile>(username, getProfile)

  // Add our actions the provided actions container

  Object.assign(actions, {
    loadProfile(name: string) {
      setUsername(name)
    },

    async follow() {
      if (state.profile && !state.profile.following) {
        setState('profile', 'following', true)
        try {
          await agent.profiles.followUserByUsername(state.profile.username)
        } catch (err) {
          setState('profile', 'following', false)
        }
      }
    },

    async unfollow() {
      if (state.profile && state.profile.following) {
        setState('profile', 'following', false)
        try {
          await agent.profiles.unfollowUserByUsername(state.profile.username)
        } catch (err) {
          setState('profile', 'following', true)
        }
      }
    }
  })

  return profile
}
