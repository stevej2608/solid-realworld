import { createResource, Resource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { IComment } from '../api/Api'
import { IApiAgent } from './createAgent'

import { IStoreState } from './storeState'

export interface ICommentsActions {
  loadComments(articleSlug: string, reload: boolean): void
  createComment(comment: string): Promise<IComment>
  deleteComment(id: string)
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

export function createComments(agent: IApiAgent, actions: ICommentsActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): Resource<IComment[]> {
  function getArticleComments(): IComment[] {
    const articleSlug = state.articleSlug
    const comments = agent.Comments.forArticle(articleSlug)
    return comments
  }

  const [comments, { mutate, refetch }] = createResource(getArticleComments, { initialValue: [] })

  // Add our actions the provided actions container

  Object.assign(actions, {
    loadComments(articleSlug: string, reload: boolean) {
      if (reload) return refetch()
      setState({ articleSlug })
    },

    async createComment(comment: string) {
      await agent.Comments.create(state.articleSlug, comment)
    },

    async deleteComment(id: string) {
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
