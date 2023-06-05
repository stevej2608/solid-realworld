import { IArticle, IComment, IProfile, IUser } from '../api/Api'

export type IArticleMap = { [slug: string]: IArticle }

export interface IStoreState {
  readonly articles: IArticleMap
  readonly comments: IComment[]
  readonly tags: string[]
  readonly profile: IProfile
  readonly currentUser: IUser

  page: number
  totalPagesCount: number
  token: string
  appName: string
  articleSlug: string
}

export interface ICommonActions {
  setToken(token: string | undefined): void
}

