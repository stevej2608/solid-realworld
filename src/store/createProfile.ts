import { createSignal, createResource } from 'solid-js'
import { IApiAgent } from './createAgent'

export interface IProfileActions {
  loadProfile: Setter<unknown>;
  follow(): Promise<void>;
  unfollow(): Promise<void>;
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

export function createProfile(agent: IApiAgent, actions:IProfileActions, state, setState) {
  const [username, setUsername] = createSignal()
  const [profile] = createResource(username, agent.Profile.get)

  Object.assign(actions, {

    loadProfile: setUsername,

    async follow() {
      if (state.profile && !state.profile.following) {
        setState('profile', 'following', true)
        try {
          await agent.Profile.follow(state.profile.username)
        } catch (err) {
          setState('profile', 'following', false)
        }
      }
    },

    async unfollow() {
      if (state.profile && state.profile.following) {
        setState('profile', 'following', false)
        try {
          await agent.Profile.unfollow(state.profile.username)
        } catch (err) {
          setState('profile', 'following', true)
        }
      }
    }
  })

  return profile
}
