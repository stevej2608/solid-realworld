import marked from 'marked'
import NavLink from '../../components/NavLink'
import { useStore } from '../../store/storeContext'

import Comments from './Comments'

const ArticleMeta = props => (
  <div class="article-meta">
    <NavLink href={`@${props.article?.author.username}`} route="profile">
      <img src={props.article?.author.image} alt="" />
    </NavLink>
    <div class="info">
      <NavLink href={`@${props.article?.author.username}`} route="profile" class="author">
        {props.article?.author.username}
      </NavLink>
      <span class="date">{new Date(props.article?.createdAt).toDateString()}</span>
    </div>
    <Show when={props.canModify} fallback={<span />}>
      <span>
        <NavLink href={`editor/${props.article.slug}`} route="editor" class="btn btn-outline-secondary btn-sm">
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
        &nbsp; Favorite Article <span class="counter">(29)</span>
      </button>
    </Show>
  </div>
)

export default ({ slug }) => {
  const [store, { deleteArticle }] = useStore()

  const article = () => store.articles[slug]
  const canModify = () => store.currentUser && store.currentUser.username === article()?.author.username
  const handleDeleteArticle = () => deleteArticle(slug).then(() => (location.hash = '/'))

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
            <div innerHTML={article() && marked(article()?.body, { sanitize: true })} />

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
              <img />
            </a>
            <div class="info">
              <a href="" class="author">
                Brad Green
              </a>
              <span class="date">January 20th</span>
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
