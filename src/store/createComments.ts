import { createResource, Resource } from 'solid-js'
import { IComment } from '../api/Api'
import { IApiAgent } from './createAgent'
export interface ICommentsActions {
  loadComments(articleSlug:string, reload: boolean)
  async createComment(comment:string)
  async deleteComment(id:string)
}

/**
 * Create interface to the comments API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server agent
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns
 */

export function createComments(agent:IApiAgent, actions:ICommentsActions, state, setState): Resource<IComment[]> {

  function getArticleComments() {
    const articleSlug = state.articleSlug
    const comments = agent.Comments.forArticle(articleSlug)
    return comments
  }

  const [comments, { mutate, refetch }] = createResource(getArticleComments, { initialValue: [] })

  // Populate the provided actions container our actions

  Object.assign(actions, {

    loadComments(articleSlug:string, reload: boolean) {
      if (reload) return refetch()
      setState({ articleSlug })
    },

    async createComment(comment:string) {
      const { errors } = await agent.Comments.create(state.articleSlug, comment)
      if (errors) throw errors
    },

    async deleteComment(id:string) {
      mutate(comments().filter(c => c.id !== id))
      try {
        await agent.Comments.delete(state.articleSlug, id)
      } catch (err) {
        actions.loadComments(state.articleSlug)
        throw err
      }
    }

  })

  return comments
}
