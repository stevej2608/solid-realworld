import { NavLink } from './NavLink'
import { IArticle } from '../api/RealWorldApi'
import { FavoriteButton } from '../components/FavoriteButton'

interface IArticlePreviewProps {
  article: IArticle
  token: string
  onClickFavorite: (article: IArticle, e: InputEvent) => void
}

/**
 * Provides preview of an article, used when listing pages
 * of articles on the home page
 */

export const ArticlePreview = ({ article, token, onClickFavorite }: IArticlePreviewProps) => {
  const {
    title,
    description,
    slug,
    createdAt,
    tagList,
    favorited,
    favoritesCount,
    author: { username, image }
  } = article

  return (
    <div class="article-preview">
      <div class="article-meta">
        <NavLink href={`@${username}`} route="profile">
          <img src={image} alt="" />
        </NavLink>

        <div class="info">
          <NavLink class="author" href={`@${username}`} route="profile">
            {username}
          </NavLink>
          <span class="date" textContent={/*@once*/ new Date(createdAt).toDateString()} />
        </div>

        {token && (
          <div class="pull-xs-right">
            <FavoriteButton article={article} onClick={onClickFavorite} />
          </div>
        )}
      </div>

      <NavLink href={`article/${slug}`} route="article" class="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          {
            /*@once*/
            tagList.map(tag => (
              <li class="tag-default tag-pill tag-outline" textContent={tag} />
            ))
          }
        </ul>
      </NavLink>
    </div>
  )
}
