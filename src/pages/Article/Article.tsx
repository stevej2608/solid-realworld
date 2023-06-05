import { JSX } from 'solid-js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { NavLink } from '../../components/NavLink'
import { useStore } from '../../store/storeContext'

import Comments from './Comments'
import { IArticle } from '../../api/Api'

interface IArticleMetaProps {
  article: IArticle
  canModify: boolean
  onDelete: () => void | object
}

/**
 * Article meta - author image & name, date, follow, favorite
 *
 * @param props
 * @returns
 */

const ArticleMeta = (props: IArticleMetaProps) => {
  const [{ token }, { unmakeFavorite, makeFavorite }] = useStore()
  const article = props.article

  const handleClickFavorite = (e: InputEvent) => {
    e.preventDefault()
    const promise = article.favorited ? unmakeFavorite(article.slug) : makeFavorite(article.slug)
  }

  return (
    <div class="article-meta">
      <NavLink href={`@${article?.author.username}`} route="profile">
        <img src={article?.author.image} alt="" />
      </NavLink>
      <div class="info">
        <NavLink href={`@${article?.author.username}`} route="profile" class="author">
          {article?.author.username}
        </NavLink>
        <span class="date">{new Date(article?.createdAt).toDateString()}</span>
      </div>
      <Show when={props.canModify} fallback={<span />}>
        <span>
          <NavLink href={`editor/${article.slug}`} route="editor" class="btn btn-outline-secondary btn-sm">
            <i class="ion-edit" /> Edit Article
          </NavLink>
          <button class="btn btn-outline-danger btn-sm" onClick={props.onDelete}>
            <i class="ion-trash-a" /> Delete Article
          </button>
        </span>
      </Show>
      <Show when={!props.canModify} fallback={<span />}>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp; Follow Brad Green
        </button>
        &nbsp;
        <button class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp; Favorite Article <span class="counter">(xxx)</span>
        </button>
      </Show>
    </div>
  )
}

interface IArticleProps {
  slug: string
}

export default ({ slug }: IArticleProps) => {
  const [store, { deleteArticle }] = useStore()

  const article = () => store.articles[slug]
  const canModify = () => store.currentUser && store.currentUser.username === article()?.author.username
  const handleDeleteArticle = () => deleteArticle(slug).then(() => (location.hash = '/'))

  const renderMarkdown = (article: IArticle): string => {
    if (article()) {
      const html = marked((article() as IArticle)?.body)
      return DOMPurify.sanitize(html)
    }
    return ''
  }

  const {
    title,
    description,
    createdAt,
    tagList,
    author: { username, image }
  } = article()

  return (
    <div class="article-page">
      <div class="banner">
        <div class="container">
          <h1>{article()?.title}</h1>
          <ArticleMeta article={article()} canModify={canModify()} onDelete={handleDeleteArticle} />
        </div>
      </div>
      <div class="container page">
        <div class="row article-content">
          <div class="col-xs-12">
            <div innerHTML={renderMarkdown(article)} />
            <ul class="tag-list">
              {article()?.tagList.map(tag => (
                <li class="tag-default tag-pill tag-outline">{tag}</li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div class="article-actions">
          <div class="article-meta">
            <a href="">
              <img src={article()?.author.image} />
            </a>
            <div class="info">
              <a href="" class="author">
                {article()?.author.username}
              </a>
              <span class="date" textContent={/*@once*/ new Date(article()?.createdAt).toDateString()} />
            </div>
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-plus-round"></i>
              &nbsp; Follow Brad Green
            </button>
            &nbsp;
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart"></i>
              &nbsp; Favorite Article <span class="counter">(29)</span>
            </button>
          </div>
        </div>

        <div class="row">
          <Comments />
        </div>
      </div>
    </div>
  )
}
