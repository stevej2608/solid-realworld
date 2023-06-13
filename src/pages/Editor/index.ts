import { lazy } from 'solid-js'
import { useStore } from '../../store/storeContext'
import { IRouteParams } from '../../routeContext'

const Editor = lazy(() => import('./Editor'))

export default function (props: IRouteParams) {
  const [store, { loadArticle }] = useStore()

  const slug = props.params[0]

  console.log('***** Editor[slug=%s] **********', slug)

  slug && loadArticle(slug)

  return Editor({ slug })

}
