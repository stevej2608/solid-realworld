import classnames from 'classnames'
import { IArticle } from '../api/RealWorldApi'

interface IFavoriteButtonProps {
  article: IArticle
  title?: string
  onClick: (article: IArticle, e: InputEvent) => void
}

export const FavoriteButton = (props: IFavoriteButtonProps) => {
  const { article, onClick } = props
  return (
    <button class={'btn btn-sm ' + classnames({ 'btn-outline-primary': !article.favorited, 'btn-primary': article.favorited })} onClick={[onClick, article]}>
      <i class="ion-heart"></i>
      &nbsp; {props.title} <span class="counter">({article.favoritesCount})</span>
    </button>
  )
}
