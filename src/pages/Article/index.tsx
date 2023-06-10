import { lazy, Show } from 'solid-js'
import { useRouter } from '../../routeContext'
import { useStore, IStoreContext } from '../../store/storeContext'
const Article = lazy(() => import('./Article'))


export default function () {
  const { params } = useRouter()
  const [store, { loadArticle, loadComments }] = useStore()
  const slug = params['slug']
  loadArticle(slug)
  loadComments(slug)
  return (
    <Show when={store.articles[slug]}>
      <Article slug={slug} />
    </Show>
  )
}
