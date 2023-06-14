import { createResource, createSignal, InitializedResource } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { WorldApi, IComment } from '../api/RealWorldApi'
import { IStoreState } from './storeState'

import { logger } from '../utils/logger'

export interface ICommentsActions {
  loadComments(articleSlug: string, reload: boolean): void
  createComment(comment: string): Promise<IComment>
  deleteComment(id: string)
}

/**
 * Create interface to the comments API endpoint. We populate the supplied
 * actions object with methods that wrap the low-level
 * server API
 *
 * @param agent Used for communication with the sever API
 * @param actions The actions object to be populated
 * @param state
 * @param setState
 * @returns InitializedResource<IComment[]>
 */

export function createCommentsStore(agent: WorldApi, actions: ICommentsActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): InitializedResource<IComment[]> {
  const [articleSlug, setArticleSlug] = createSignal<string>()

  const fetchComments = async (): IComment[] => {
    const slug = articleSlug()
    logger.info('getArticleComments articleSlug = %s ...', slug ? slug.slice(0, 15) : 'undefined')
    const { data, error } = await agent.articles.getArticleComments(slug)
    return data.comments
  }

  const [comments, { mutate, refetch }] = createResource<IComment[]>(articleSlug, fetchComments, { initialValue: [] })

  // Add our actions the provided actions container

  Object.assign(actions, {

    loadComments(articleSlug: string, reload: boolean) {
      if (reload) return refetch()
      logger.info('loadComments articleSlug=%s ...', articleSlug.slice(0, 15))
      setArticleSlug(articleSlug)
      setState({ articleSlug })
    },

    async createComment(comment: string) {
      await agent.articles.createArticleComment(state.articleSlug, { comment })
    },

    async deleteComment(id: string) {
      mutate(comments().filter(c => c.id !== id))
      try {
        await agent.articles.deleteArticleComment(state.articleSlug, id)
      } catch (err) {
        actions.loadComments(state.articleSlug)
        throw err
      }
    }
  })

  return comments
}
