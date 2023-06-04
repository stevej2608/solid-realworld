import { useStore } from '../store/storeContext'
import { ArticlePreview } from './ArticlePreview'
import { IArticle } from '../api/Api'
interface IProps {
  articles: IArticle[]
  currentPage: number
  onSetPage(page:number)
  totalPagesCount: number
}

/**
 * List of articles with paginator
 *
 * @param props
 * @returns
 */

export const ArticleList = (props:IProps) => {
  const [{ token }, { unmakeFavorite, makeFavorite }] = useStore()

  const handleClickFavorite = (article: IArticle, e) => {
    e.preventDefault()
    article.favorited ? unmakeFavorite(article.slug) : makeFavorite(article.slug)
  }

  const handlePage = (v, e) => {
    e.preventDefault()
    props.onSetPage(v)
    setTimeout(() => window.scrollTo(0, 0), 200)
  }

  return (
    <Suspense fallback={<div class="article-preview">Loading articles...</div>}>
      <For each={props.articles} fallback={<div class="article-preview">No articles are here... yet.</div>}>
        {article => <ArticlePreview article={article} token={token} onClickFavorite={handleClickFavorite} />}
      </For>
      <Show when={props.totalPagesCount > 1}>
        <nav>
          <ul class="pagination">
            <For each={[...Array(props.totalPagesCount).keys()]}>
              {v => (
                <li class="page-item" classList={{ active: props.currentPage === v }} onClick={[handlePage, v]}>
                  <a class="page-link" href="" textContent={v + 1} />
                </li>
              )}
            </For>
          </ul>
        </nav>
      </Show>
    </Suspense>
  )
}
