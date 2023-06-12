import { Api as RealWorldApi } from './Api'
import { IStoreState } from '../store/storeState'

import type {
  HttpResponse,
  IArticle,
  IComment,
  IGenericErrorModel,
  INewArticle,
  INewUser,
  IProfile,
  ITagsResponse,
  IUser,
  IUserResponse,
} from './Api';

const API_ROOT = 'https://api.realworld.io/api'

const getHeaders = (state: IStoreState) => {
  if (state.token) {
    return {
      Authorization: `Token ${state.token}`
    }
  }
  return {}
}

export class WorldApi extends RealWorldApi<unknown> {

  /**
   * Extend the swagger-typescript-api generated API to
   * provide a common access point for the API and the
   * associated API data types
   */

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
