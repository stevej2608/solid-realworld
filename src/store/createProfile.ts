import { createSignal, createResource, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { Api, IProfile } from '../api/Api'
import { IStoreState } from './storeState'

export interface IProfileActions {
  loadProfile(name: string): void
  follow(): Promise<void>
  unfollow(): Promise<void>
}

/**
 * Create interface to the profile API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server agent
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createProfile(agent: Api<unknown>, actions: IProfileActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<IProfile> {

  const getProfile = async (username: string) => {
    const { data, error } = await agent.profiles.getProfileByUsername(username)
    return data.profile
  }

  const [username, setUsername] = createSignal()
  const [profile] = createResource(username, getProfile)

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
