import { IArticle, IComment, IProfile, IUser } from '../api/RealWorldApi'

export type IArticleMap = { [slug: string]: IArticle }

export interface IStoreState {

  /**
   * Map of IArticles keyed on slug
   */

  readonly articles: IArticleMap

  /**
   * Slug of the currently active article
   */

  articleSlug: string

  /**
   * List of comments for the currently active article
   */

  readonly comments: IComment[]

  /**
   * List of all tags
   */

  readonly tags: string[]

  /**
   * The current user
   */

  readonly currentUser: IUser

  /**
   * The current users profile
   */

  readonly profile: IProfile

  /**
   * The page currently on display
   */

  page: number

  /**
   * The total number of pages
   */

  totalPagesCount: number

  /**
   * Security token for current user
   */

  token: string

  /**
   * The application name
   */

  appName: string
}

export interface ICommonActions {
  setToken: (token: string | undefined) => void
}
