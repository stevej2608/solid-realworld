import { createComputed, lazy } from 'solid-js'
import { useRouter } from '../../routeContext'
import { useStore } from '../../store/storeContext'

const Profile = lazy(() => import('./Profile'))

interface IProps {
  routeName: string
  params: string[]
}

export default function (props: IProps) {
  const [, { loadProfile, loadArticles }] = useStore()
  const { location } = useRouter()

  const userName = props.params[0]

  createComputed(() => props.routeName === 'profile' && loadProfile(userName))

  createComputed(
    () => props.routeName === 'profile' && (location().includes('/favorites') ? loadArticles({ favoritedBy: userName }) : loadArticles({ author: userName }))
  )
  return <Profile username={props.params[0]} />
}
