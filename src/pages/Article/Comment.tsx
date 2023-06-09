import { NavLink } from '../../components/NavLink'
import { IComment, IUser } from '../../api/Api'

interface ICommentProps {
  comment: IComment
  currentUser: IUser
}

export const Comment = ({ comment, currentUser, onDelete }: ICommentProps) => {
  const show = currentUser && currentUser.username === comment.author.username
  const {
    id,
    body,
    author: { username, image },
    createdAt
  } = comment

  return (
    <div class="card">
      <div class="card-block">
        <p class="card-text" textContent={body} />
      </div>
      <div class="card-footer">
        <NavLink href={`@${username}`} route="profile" class="comment-author">
          <img src={image} class="comment-author-img" alt="" />
        </NavLink>
        &nbsp;
        <NavLink href={`@${username}`} route="profile" class="comment-author">
          {username}
        </NavLink>
        <span class="date-posted">{new Date(createdAt).toDateString()}</span>
        {show && (
          <span class="mod-options">
            <i class="ion-trash-a" onClick={[onDelete, id]} />
          </span>
        )}
      </div>
    </div>
  )
}
