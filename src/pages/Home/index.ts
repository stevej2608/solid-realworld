import { createComputed, createMemo, useTransition, lazy } from "solid-js";
import { useStore, useRouter } from "../../store";

const Home = lazy(() => import("./Home"));

export default function() {

  const [store, { loadArticles, setPage }] = useStore()
  const { token, appName } = store
  const { location } = useRouter()

  const tab = createMemo(() => {
      const search = location().split("?")[1];
      if (!search) return token ? "feed" : "all";
      const query = new URLSearchParams(search);
      return query.get("tab");
    })

  const [, start] = useTransition()

  const getPredicate = () => {
      switch (tab()) {
        case "feed":
          return { myFeed: true };
        case "all":
          return {};
        case undefined:
          return undefined;
        default:
          return { tag: tab() };
      }
    }

  const handleSetPage = page => {
      start(() => {
        setPage(page);
        loadArticles(getPredicate());
      });
    }

  createComputed(() => loadArticles(getPredicate()));

  return Home({ handleSetPage, appName, token, tab, store });
}
