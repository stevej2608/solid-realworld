import { JSX } from 'solid-js'
import { render } from 'solid-js/web'
import { Router, hashIntegration } from '@solidjs/router'
import { App } from './App'
import { StoreContext, createApplicationStore } from './store/storeContext'

interface IProps {
  children?: Element
}

function ContextProvider(props: IProps) {
  const store = createApplicationStore()
  return (
    <StoreContext.Provider value={store}>
      <Router>{props.children}</Router>
    </StoreContext.Provider>
  )
}

render(
  () => (
    <ContextProvider>
      <App />
    </ContextProvider>
  ),
  document.body
)
