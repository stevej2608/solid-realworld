import { createContext, useContext, Accessor } from 'solid-js'
import { createSignal, onCleanup, useTransition } from 'solid-js'

export interface IRouteParams {
  routeName: string
  params: string[]
}

/**
 * @field location accessor
 */
export interface IRouteContext {
  /**
   * location accessor. A solidJS reactive element, driven by
   * a window.hashchange event
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event
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


  // const locationHandler = () => start(() => setLocation(window.location.hash.slice(2)))


  const locationHandler = () => {
    return start(() => {
      const location = window.location.hash.slice(2)
      console.log('>>>>>>>>>>>>>>>>>> setLocation(%s)', location)
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
