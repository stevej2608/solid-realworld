import { NavLink } from '../../components/NavLink'
import { useStore } from '../../store/storeContext'
import { IComment } from '../../api/Api';

import { Comment } from './Comment'
import { CommentInput } from './CommentInput'

export default () => {
  const [store, { createComment, deleteComment, loadComments }] = useStore()
  const { currentUser, articleSlug } = store

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId)
  }

  return (
    <div class="col-xs-12 col-md-8 offset-md-2">
      {currentUser ? (
        <CommentInput slug={articleSlug} currentUser={currentUser} createComment={createComment} loadComments={loadComments} />
      ) : (
        <p>
          <NavLink route="login">Sign in</NavLink>
          &nbsp;or&nbsp;
          <NavLink route="register">sign up</NavLink>
          &nbsp;to add comments on this article.
        </p>
      )}
      <Suspense fallback="Loading comments">
        <For each={store.comments}>{(comment: IComment) => <Comment comment={comment} currentUser={currentUser} onDelete={handleDeleteComment} />}</For>
      </Suspense>
    </div>
  )
}
