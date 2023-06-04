import { IArticle, IComment, IProfile, IUser } from '../api/Api'

export interface IStoreState {
  readonly articles: IArticle[]
  readonly comments: IComment[]
  readonly tags: string[]
  readonly profile: IProfile
  readonly currentUser: IUser

  page: number
  totalPagesCount: number
  token: string
  appName: string
}
