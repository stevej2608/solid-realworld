import { createComputed, lazy } from 'solid-js'
import { useRouter } from '../../routeContext'
import { useStore, IStoreContext } from '../../store/storeContext'

const Profile = lazy(() => import('./Profile'))

interface IProps {
  routeName: string
  params: string[]
}

export default function (props: IProps) {
  const [, { loadProfile, loadArticles }] = useStore()
  const { location } = useRouter()

  createComputed(() => props.routeName === 'profile' && loadProfile(props.params[0]))

  createComputed(
    () =>
      props.routeName === 'profile' &&
      (location().includes('/favorites') ? loadArticles({ favoritedBy: props.params[0] }) : loadArticles({ author: props.params[0] }))
  )
  return <Profile username={props.params[0]} />
}
