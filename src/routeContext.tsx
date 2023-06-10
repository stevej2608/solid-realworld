import { useParams, useLocation, Params } from '@solidjs/router'

/**
 * @field location accessor
 */
export interface IRouteContext {
  location: string
  route: string
  params: Params
}

export function useRouter(): IRouteContext {

  // https://github.com/solidjs/solid-router#router-primitives

  const params = useParams()
  const location = useLocation()

  return {

    get location(): string {
      return location.search
    },

    get route(): string {
      return location.pathname
    },

    get params(): Params {
      return params
    },

    getParams: (): string[] => {
      console.log('getParams %o', params)
      return Object.values(params)
    }


  }
}
