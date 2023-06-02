import { createSignal, createResource } from 'solid-js'

export function createProfile(agent, actions, state, setState) {
  const [username, setUsername] = createSignal()
  const [profile] = createResource(username, agent.Profile.get)
  Object.assign(actions, {
    // TODO: used

    loadProfile: setUsername,

    // TODO: used

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

    // TODO: used

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
