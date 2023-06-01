import { createRouteHandler } from "./createRouteHandler";
import { RouterContext} from './routeContext'
import {  StoreContext, createApplicationStore } from "./storeContext"

/**
 * Aggregate of StoreContext and RouterContext
 */

export function Provider(props) {

  const router = createRouteHandler("")
  const store = createApplicationStore()

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </RouterContext.Provider>
  );
}

