import { render } from 'solid-js/web'
import { App } from './App'
import { RouterContext, createRouteHandler } from './routeContext'
import { StoreContext, createApplicationStore } from './store/storeContext'

interface IProps {
  children?: Element
}

function ContextProvider(props: IProps) {
  const router = createRouteHandler('')
  const store = createApplicationStore()

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </RouterContext.Provider>
  )
}

export const AppMain = () => (
  <ContextProvider>
    <App />
  </ContextProvider>
)

