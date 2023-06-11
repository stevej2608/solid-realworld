import { createContext, useContext, Accessor } from 'solid-js'
import { createSignal, onCleanup, useTransition } from 'solid-js'

interface IRouteParams {
  params: string[]
  routeName: string
}

/**
 * @field location accessor
 */
export interface IRouteContext {
  /**
   * location accessor
   */

  location: Accessor<string>

  /**
   * Return true if regex test is a match in current location
   *
   * @param name name to associated with the match
   * @param test the regex test
   * @returns true if match
   */

  match: (name: string, test: RegExp) => boolean

  /**
   * Returns any params associated with the match
   */

  getParams: () => IRouteParams | undefined
}

/**
 * Return IRouteContext that updates when window.location.hash changes
 *
 * @param {string} init
 * @returns
 */

export function createRouteHandler(init: string): IRouteContext {
  const [location, setLocation] = createSignal<string>(window.location.hash.slice(2) || init)
  const [read, triggerParams] = createSignal()
  const [, start] = useTransition()

  // Remove '#/' from location.hash
  //
  // #/?tab=all => ?tab=all

  const locationHandler = () => {
    const promise = start(() => {
      const location = window.location.hash.slice(2)
      setLocation(location)
    })
  }

  let params: IRouteParams | undefined = undefined

  window.addEventListener('hashchange', locationHandler)

  onCleanup(() => window.removeEventListener('hashchange', locationHandler))

  return {
    location,

    match: (name: string, test: RegExp) => {
      const loc = decodeURIComponent(location().split('?')[0])
      const match = test.exec(loc)
      if (match) {
        params = { params: match.slice(1), routeName: name }
        triggerParams()
      }
      return !!match
    },

    getParams: (): IRouteParams | undefined => {
      read() // TODO: figure out what this does
      return params
    }
  }
}

export const RouterContext = createContext<IRouteContext>()

export function useRouter() {
  return useContext<IRouteContext>(RouterContext)
}
