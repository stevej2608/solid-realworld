import { createComputed, createMemo, useTransition, lazy } from 'solid-js'
import { useRouter, IRouteContext } from '../../routeContext'
import { useStore } from '../../store/storeContext'
import { IPredicate } from '../../store/createArticles'

const Home = lazy(() => import('./Home'))

export default function () {
  const [state, { loadArticles, setPage }] = useStore()
  const { token, appName } = state
  const { location } = useRouter()

  // The feedTab, this is driven by the page URL. If
  // none is specified we default to the personal ('feed') if
  // a user is signed in or the global feed ('all') if
  // operating anonymously

  const feedTab = createMemo<string>(() => {
    let feed = token ? 'feed' : 'all'
    const search = location().split('?')[1]
    if (search) {
      const query = new URLSearchParams(search)
      feed = query.get('tab')
    }
    console.log('feedTab changed to [%s]', feed)
    return feed
  })

  console.log('tab %s', feedTab())

  const [, start] = useTransition()

  // Convert the selected feed tab into a predicate that
  // is used to load the correct articles feed

  const getPredicate = (): IPredicate => {
    switch (feedTab()) {
      case 'feed':
        return { myFeed: true }
      case 'all':
        return {}
      case undefined:
        return undefined
      default:
        return { tag: feedTab() }
    }
  }

  // Linked to paginator in ArticleList.tsx

  const handleSetPage = (page: number) => {
    const promise = start(() => {
      setPage(page)
      loadArticles(getPredicate())
    })
  }

  createComputed(() => loadArticles(getPredicate()))

  return Home({ handleSetPage, appName, tab: feedTab, state })
}
