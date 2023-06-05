import { lazy } from 'solid-js'
import { useStore } from '../../store/storeContext'
const Article = lazy(() => import('./Article'))

interface IArticleProps {
  params: string[]
}

export default function (props: IArticleProps) {
  const [, { loadArticle, loadComments }] = useStore()
  const slug = props.params[0]
  loadArticle(slug)
  loadComments(slug)
  return Article({ slug })
}
