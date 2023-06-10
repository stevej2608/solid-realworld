import { lazy, createSignal, createComputed } from 'solid-js'
import { Router, Routes, Route } from '@solidjs/router'
import { useRouter, IRouteContext } from './routeContext'
import { useStore } from './store/storeContext'

import NavBar from './components/NavBar'
import Home from './pages/Home'
import Article from './pages/Article'
import Profile from './pages/Profile'
import Editor from './pages/Editor'

const Settings = lazy(() => import('./pages/Settings'))
const Auth = lazy(() => import('./pages/Auth'))

export const App = () => {
  const [store, { pullUser }] = useStore()
  const [appLoaded, setAppLoaded] = createSignal(false)
  const { route } = useRouter()

  if (!store.token) setAppLoaded(true)
  else {
    pullUser()
    createComputed(() => store.currentUser && setAppLoaded(true))
  }

  console.log('*************** route = [%s] **************', route)

  // https://github.com/solidjs/solid-router
  // https://github.com/solidjs/solid-router/issues/273

  return (
    <>
      <NavBar />
      <Show when={appLoaded()} fallback={<div class="container loader"></div>}>
        <Suspense>
          <Routes>
            <Route element={Article} path="/article/:slug" />
            <Route element={Profile} path="/profile" />
            <Route element={Home} path="/" />
          </Routes>

          {/* <Switch>
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
          </Switch> */}
        </Suspense>
      </Show>
    </>
  )
}
