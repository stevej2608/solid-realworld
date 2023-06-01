import { createEffect, createResource } from "solid-js";

export function createCommon(agent, actions, state, setState) {

  const getTags = () => {
    console.log('getTags')
    return agent.Tags.getAll().then((tags) => tags.map((t) => t.toLowerCase()))
  }

  const [tags] = createResource("tags", getTags, { initialValue: [] } );

  createEffect(() => {

    if (state.token) {
      console.log('Add token %s', state.token)
      localStorage.setItem("jwt", state.token)
    }
    else {
      console.log('Remove token')
      localStorage.removeItem("jwt");
    }

  });

  actions.setToken = (token) => setState({ token });

  return tags;
}
