import { lazy, createSignal, createComputed } from "solid-js";

import { useRouter } from "./store/routeContext";
import { useStore } from "./store/storeContext";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Article from "./pages/Article";
import Profile from "./pages/Profile";
import Editor from "./pages/Editor";

const Settings = lazy(() => import("./pages/Settings"))
const Auth = lazy(() => import("./pages/Auth"))

export const App = () => {
  const [store, { pullUser }] = useStore()
  const [appLoaded, setAppLoaded] = createSignal(false)
  const { match, getParams } = useRouter();

  if (!store.token) setAppLoaded(true);
  else {
    pullUser();
    createComputed(() => store.currentUser && setAppLoaded(true));
  }

  return (
    <>
      <NavBar />
      <Show when={appLoaded()}>
        <Suspense fallback={<div class="container">Loading...</div>}>
          <Switch>
            <Match when={match("editor", /^editor\/?(.*)/)}><Editor {...getParams()} /></Match>
            <Match when={match("settings", /^settings/)}><Settings /></Match>
            <Match when={match("login", /^login/)}><Auth /></Match>
            <Match when={match("register", /^register/)}><Auth /></Match>
            <Match when={match("article", /^article\/(.*)/)}><Article {...getParams()} /></Match>
            <Match when={match("profile", /^@([^/]*)\/?(favorites)?/)}><Profile {...getParams()} /></Match>
            <Match when={match("", /^#?$/)}><Home /></Match>
          </Switch>
        </Suspense>
      </Show>
    </>
  );
};
