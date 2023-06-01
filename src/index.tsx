import { render } from 'solid-js/web';
import { App } from './App';
import { RouterContext, createRouteHandler} from './store/routeContext'
import {  StoreContext, createApplicationStore } from "./store/storeContext"

function ContextProvider(props) {
  const router = createRouteHandler("")
  const store = createApplicationStore()

  return (
    <RouterContext.Provider value={router}>
      <StoreContext.Provider value={store}>{props.children}</StoreContext.Provider>
    </RouterContext.Provider>
  );
}

render(() => (
  <ContextProvider>
    <App />
  </ContextProvider>
), document.body);
