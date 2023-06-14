import { lazy } from 'solid-js'
import { useStore } from '../../store/storeContext'
import { IRouteParams } from '../../routeContext'

import { logger } from '../../utils/logger'

const Editor = lazy(() => import('./Editor'))

export default function (props: IRouteParams) {
  const [store, { loadArticle }] = useStore()

  const slug = props.params[0]

  logger.info('***** Editor[slug=%s] **********', slug)

  slug && loadArticle(slug)

  return Editor({ slug })

}
