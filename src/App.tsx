import { lazy, createSignal, createComputed } from 'solid-js'

import { useRouter } from './routeContext'
import { useStore } from './store/storeContext'

import NavBar from './components/NavBar'
import Home from './pages/Home'
import Article from './pages/Article'
import Profile from './pages/Profile'
import Editor from './pages/Editor'

import { logger } from './utils/logger'

const Settings = lazy(() => import('./pages/Settings'))
const Auth = lazy(() => import('./pages/Auth'))

// logger.info = function() {}

export const App = () => {
  const [store, { pullUser }] = useStore()
  const [appLoaded, setAppLoaded] = createSignal(false)
  const { match, getParams } = useRouter()

  logger.info('Starting %s', 99)

  if (!store.token) setAppLoaded(true)
  else {
    pullUser()
    createComputed(() => store.currentUser && setAppLoaded(true))
  }

  return (
    <div data-testid="container">
      <NavBar />
      <Show when={appLoaded()} fallback={<div class="container loader"></div>}>
        <Suspense>
          <Switch>
            <Match when={match('editor', /^editor\/?(.*)/)}>
              <Editor {...getParams()} />
            </Match>
            <Match when={match('settings', /^settings/)}>
              <Settings />
            </Match>
            <Match when={match('login', /^login/)}>
              <Auth />
            </Match>
            <Match when={match('register', /^register/)}>
              <Auth />
            </Match>
            <Match when={match('article', /^article\/(.*)/)}>
              <Article {...getParams()} />
            </Match>
            <Match when={match('profile', /^@([^/]*)\/?(favorites)?/)}>
              <Profile {...getParams()} />
            </Match>
            <Match when={match('', /^#?$/)}>
              <Home />
            </Match>
          </Switch>
        </Suspense>
      </Show>
    </div>
  )
}
