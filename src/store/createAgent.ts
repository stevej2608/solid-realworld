import { ApiKeyAuthorization } from 'swagger-client'
import { IApi, Api } from '../api/Api'
import { IStoreState } from './storeState'
import { IStoreContext } from './storeContext'
import { IAuthorActions } from './createAuth'

const API_ROOT = 'https://api.realworld.io/api'

const encode = encodeURIComponent

export function createAgent([state, actions]: IStoreContext): IApi {
  const getHeaders = () => {
    if (state.token) {
      return {
        authorization: `Bearer ${state.token}`
      }
    }
    return {}
  }

  // https://github.com/catenax-ng/product-item-relationship-service-frontend/blob/40fdbfed896e62cbeb188cdd450613e2060371e7/src/utils/HttpClient.ts#L27

  const api = new Api({
    baseUrl: API_ROOT,
    baseApiParams: {
      headers: getHeaders()
    }
  })

  return api
}
