import { lazy } from 'solid-js'
import { Show } from 'solid-js'
import { useStore } from '../../store/storeContext'
import { IRouteParams } from '../../routeContext'

const Article = lazy(() => import('./Article'))

export default function (props: IRouteParams) {
  const [store, { loadArticle, loadComments }] = useStore()
  const slug = props.params[0]

  console.log('************** page=Article] ******************')

  if (!(slug in store.articles)) {
    loadArticle(slug)
  }

  loadComments(slug)

  return (
    <Show when={store.articles[slug]}>
      <Article slug={slug} />
    </Show>
  )
}
