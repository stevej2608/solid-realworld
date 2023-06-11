import { Api as RealWorldApi } from './Api'
import { IStoreState } from '../store/storeState'
import { IAuthorActions } from '../store/createAuthStore'

import type {
  HttpResponse,
  IArticle,
  IArticleResponse,
  IComment,
  IGenericErrorModel,
  IMultipleArticlesResponse,
  INewArticle,
  INewUser,
  IProfile,
  ITagsResponse,
  IUser,
  IUserResponse
} from './Api'

const API_ROOT = 'https://api.realworld.io/api'

const getHeaders = (state: IStoreState) => {
  if (state.token) {
    return {
      Authorization: `Token ${state.token}`
    }
  }
  return {}
}

/**
 * Extend the swagger-typescript-api generated API to
 * provide a common access point for the API and the
 * associated API data types
 */

export class WorldApi extends RealWorldApi<unknown> {
  constructor(state: IStoreState) {
    super({
      baseUrl: API_ROOT,
      baseApiParams: {
        headers: getHeaders(state)
      }
    })
  }
}

export { HttpResponse, IGenericErrorModel }
export { IArticle, IComment, INewArticle, INewUser, IProfile, ITagsResponse, IUser, IUserResponse }
