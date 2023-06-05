import { JSX } from 'solid-js'
import { useRouter } from '../../routeContext'
import { useStore, IStoreContext } from '../../store/storeContext'

import { NavLink } from '../../components/NavLink'
import { ArticleList } from '../../components/ArticleList'

interface IProfileProps {
  username: string
}

export default (props: IProfileProps) => {
  const [store, { setPage, loadArticles, unfollow, follow }] = useStore()
  const { location } = useRouter()

  const handleClick = (ev: InputEvent) => {
    ev.preventDefault()
    const promise = store.profile.following ? unfollow() : follow()
  }

  const handleSetPage = (page: number) => {
    setPage(page)
    loadArticles()
  }

  const isUser = () => store.currentUser && props.username === store.currentUser.username

  return (
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img src={store.profile?.image} class="user-img" alt="" />
              <h4 textContent={props.username} />
              <p>{store.profile?.bio}</p>
              {isUser() && (
                <NavLink route="settings" class="btn btn-sm btn-outline-secondary action-btn">
                  <i class="ion-gear-a" /> Edit Profile Settings
                </NavLink>
              )}
              {store.token && !isUser() && (
                <button
                  class="btn btn-sm action-btn"
                  classList={{
                    'btn-secondary': store.profile?.following,
                    'btn-outline-secondary': !store.profile?.following
                  }}
                  onClick={handleClick}
                >
                  <i class="ion-plus-round" /> {store.profile?.following ? 'Unfollow' : 'Follow'} {store.profile?.username}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <NavLink class="nav-link" active={location().includes('/favorites') ? 0 : 1} href={`@${props.username}`}>
                    My Articles
                  </NavLink>
                </li>

                <li class="nav-item">
                  <NavLink class="nav-link" active={location().includes('/favorites')} href={`@${props.username}/favorites`}>
                    Favorited Articles
                  </NavLink>
                </li>
              </ul>
            </div>

            <ArticleList articles={Object.values(store.articles)} totalPagesCount={store.totalPagesCount} onSetPage={handleSetPage} />
          </div>
        </div>
      </div>
    </div>
  )
}
