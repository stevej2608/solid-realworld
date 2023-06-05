import { lazy } from 'solid-js'
import { useStore } from '../../store/storeContext'

const Editor = lazy(() => import('./Editor'))

interface IProps {
  params: string[]
}

export default function (props: IProps) {
  const [, { loadArticle }] = useStore()
  const slug = props.params[0]
  slug && loadArticle(slug)
  return Editor({ slug })
}
