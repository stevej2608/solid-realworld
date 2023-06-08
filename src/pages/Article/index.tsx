import { lazy } from 'solid-js'
import { Show } from 'solid-js'
import { useStore } from '../../store/storeContext'
const Article = lazy(() => import('./Article'))

interface IArticleProps {
  params: string[]
}

export default function (props: IArticleProps) {
  const [store, { loadArticle, loadComments }] = useStore()
  const slug = props.params[0]
  loadArticle(slug)
  loadComments(slug)
  return (
    <Show when={store.articles[slug]}>
      <Article slug={slug} />
    </Show>
  )
}
