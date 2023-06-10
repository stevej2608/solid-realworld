import { createComputed, createMemo, useTransition, lazy } from 'solid-js'
import { useRouter, IRouteContext } from '../../routeContext'
import { useStore } from '../../store/storeContext'

const Home = lazy(() => import('./Home'))

export default function () {
  const [state, { loadArticles, setPage }] = useStore()
  const { token, appName } = state
  const { location } = useRouter()

  // https://www.solidjs.com/docs/latest/api#creatememo

  const tab = createMemo(() => {
    const search = location().split('?')[1]
    console.log('search %s', search)
    if (!search) return token ? 'feed' : 'all'
    const query = new URLSearchParams(search)
    return query.get('tab')
  })

  console.log('tab %s', tab())

  const [, start] = useTransition()

  const getPredicate = () => {
    switch (tab()) {
      case 'feed':
        return { myFeed: true }
      case 'all':
        return {}
      case undefined:
        return undefined
      default:
        return { tag: tab() }
    }
  }

  const handleSetPage = (page: number) => {
    const promise = start(() => {
      setPage(page)
      loadArticles(getPredicate())
    })
  }

  createComputed(() => loadArticles(getPredicate()))

  return Home({ handleSetPage, appName, token, tab, state })
}
