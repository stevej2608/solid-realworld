import { createComputed, splitProps, Show } from 'solid-js'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { NavLink } from '../../components/NavLink'
import { useStore } from '../../store/storeContext'

import Comments from './Comments'
import { IArticle, IProfile } from '../../api/Api'
import { FavoriteButton } from '../../components/FavoriteButton'
import { FollowingButton } from '../../components/FollowingButton'

interface IArticleMetaProps {
  article: IArticle
  profile: IProfile
  canModify: boolean
  onClickFavorite: (article: IArticle, e: InputEvent) => void
  onClickFollow: (e: InputEvent) => void
  onDelete: () => void | object
}

/**
 * Article meta - author image & name, date, follow, favorite
 *
 * @param props
 * @returns
 */

const ArticleMeta = (props: IArticleMetaProps) => {
  const [local] = splitProps(props, ['article', 'profile'])
  const [{ token }, { unmakeFavorite, makeFavorite }] = useStore()

  return (
    <div class="article-meta">
      <NavLink href={`@${local.article?.author.username}`} route="profile">
        <img src={local.article.author.image} alt="" />
      </NavLink>
      <div class="info">
        <NavLink href={`@${local.article.author.username}`} route="profile" class="author">
          {local.article?.author.username}
        </NavLink>
        <span class="date">{new Date(local.article.createdAt).toDateString()}</span>
      </div>
      <Show when={props.canModify} fallback={<span />}>
        <span>
          <NavLink href={`editor/${local.article.slug}`} route="editor" class="btn btn-outline-secondary btn-sm">
            <i class="ion-edit" /> Edit Article
          </NavLink>
          <button class="btn btn-outline-danger btn-sm" onClick={props.onDelete}>
            <i class="ion-trash-a" /> Delete Article
          </button>
        </span>
      </Show>
      <Show when={!props.canModify} fallback={<span />}>
        <FollowingButton profile={local.profile} onClick={props.onClickFollow} />
        &nbsp;
        <FavoriteButton article={local.article} title={'Favorite Article'} onClick={props.onClickFavorite} />
      </Show>
    </div>
  )
}

interface IArticleProps {
  slug: string
}

export default ({ slug }: IArticleProps) => {
  const [store, { deleteArticle, unmakeFavorite, makeFavorite, loadProfile, unfollow, follow }] = useStore()

  const article = store.articles[slug]
  const canModify = () => store.currentUser && store.currentUser.username === article.author.username
  const handleDeleteArticle = () => deleteArticle(slug).then(() => (location.hash = '/'))

  createComputed(() => loadProfile(article.author.username))

  const renderMarkdown = (article: IArticle): string => {
    if (article) {
      const html = marked(article?.body, { mangle: false, headerIds: false })
      return DOMPurify.sanitize(html)
    }
    return ''
  }

  const onClickFavorite = (article: IArticle, e: InputEvent) => {
    e.preventDefault()
    const slug: string = article.slug
    article.favorited ? unmakeFavorite(slug) : makeFavorite(slug)
  }

  const onClickFollow = (ev: InputEvent) => {
    ev.preventDefault()
    const promise = store.profile.following ? unfollow() : follow()
  }

  const {
    title,
    description,
    createdAt,
    tagList,
    author: { username, image }
  } = article

  return (
    <div class="article-page">
      <div class="banner">
        <div class="container">
          <h1>{article?.title}</h1>
          <ArticleMeta
            article={article}
            profile={store.profile}
            canModify={canModify()}
            onClickFavorite={onClickFavorite}
            onClickFollow={onClickFollow}
            onDelete={handleDeleteArticle}
          />
        </div>
      </div>
      <div class="container page">
        <div class="row article-content">
          <div class="col-xs-12">
            <div innerHTML={renderMarkdown(article)} />
            <ul class="tag-list">
              {article.tagList.map(tag => (
                <li class="tag-default tag-pill tag-outline">{tag}</li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div class="article-actions">
          <div class="article-meta">
            <a href="">
              <img src={article.author.image} />
            </a>
            <div class="info">
              <a href="" class="author">
                {article.author.username}
              </a>
              <span class="date" textContent={/*@once*/ new Date(article.createdAt).toDateString()} />
            </div>
            <FollowingButton profile={store.profile} onClick={onClickFollow} />
            &nbsp;
            <FavoriteButton article={article} title={'Favorite Article'} onClick={onClickFavorite} />
          </div>
        </div>

        <div class="row">
          <Comments />
        </div>
      </div>
    </div>
  )
}
