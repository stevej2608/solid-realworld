import { createComputed, lazy } from 'solid-js'
import { useRouter, IRouteParams } from '../../routeContext'
import { useStore } from '../../store/storeContext'

const Profile = lazy(() => import('./Profile'))

export default function (props: IRouteParams) {
  const [, { loadProfile, loadArticles }] = useStore()
  const { location } = useRouter()

  const userName = props.params[0]

  createComputed(() => props.routeName === 'profile' && loadProfile(userName))

  // Determine which article feed to display. The user/authors feed ('My Articles' tab) or
  // the user/favorites ('Favorited Articles' tab)

  createComputed(() => {
    if (props.routeName === 'profile' && (location().includes('/favorites'))) {
      loadArticles({ favoritedBy: userName })
    }
    else {
      loadArticles({ author: userName })
    }
  })

  return <Profile username={props.params[0]} />
}
