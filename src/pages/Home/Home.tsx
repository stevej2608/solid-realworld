import { NavLink } from '../../components/NavLink'
import { ArticleList } from '../../components/ArticleList'
import { IStoreState } from '../../store/storeState'

interface IHomeProps {
  appName: string
  handleSetPage: (page: number) => void
  tab: string
  state: IStoreState
}

/**
 * This is the conduit home page. Display navbar, banner
 * tabs and article list.
 *
 * https://demo.realworld.io/#/
 */

export default ({ appName, token, handleSetPage, tab, state }: IHomeProps) => {
  console.log('************** page=[Home] ******************')
  return (
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font" textContent={appName} />
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            {/* Display feed tabs */}

            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                {/* Users feed - only if a user is logged in */}

                <Show when={state.token}>
                  <li class="nav-item">
                    <NavLink class="nav-link" href="?tab=feed" active={tab() === 'feed'}>
                      Your Feed
                    </NavLink>
                  </li>
                </Show>

                {/* Global feed - always */}

                <li class="nav-item">
                  <NavLink class="nav-link" href="?tab=all" active={tab() === 'all'}>
                    Global Feed
                  </NavLink>
                </li>

                {/* Show popular tag feed - if one is selected */}

                <Show when={tab() !== 'all' && tab() !== 'feed'}>
                  <li class="nav-item">
                    <a href="" class="nav-link active">
                      <i class="ion-pound" /> {tab()}
                    </a>
                  </li>
                </Show>
              </ul>
            </div>

            {/* Display articles for selected feed */}

            <ArticleList articles={Object.values(state.articles)} totalPagesCount={state.totalPagesCount} currentPage={state.page} onSetPage={handleSetPage} />
          </div>

          {/* Popular tags panel */}

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <Suspense fallback="Loading tags...">
                <div class="tag-list">
                  <For each={state.tags}>
                    {(tag: string) => (
                      <a href={`#/?tab=${tag}`} class="tag-pill tag-default">
                        {tag}
                      </a>
                    )}
                  </For>
                </div>
              </Suspense>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
