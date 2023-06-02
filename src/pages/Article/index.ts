import { lazy } from 'solid-js'
import { useStore } from '../../store/storeContext'
const Article = lazy(() => import('./Article'))

export default function (props) {
  const [, { loadArticle, loadComments }] = useStore()
  const slug = props.params[0]
  loadArticle(slug)
  loadComments(slug)
  return Article({ slug })
}
