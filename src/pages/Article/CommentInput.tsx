import { createStore } from 'solid-js/store'
import { ListErrors, IErrors } from '../../components/ListErrors'
import { ICommentsActions } from '../../store/createComments'
import { IUser } from '../../api/Api'

interface ICommentStore {
  body: string
  errors: IErrors
  isCreatingComment: boolean
}
interface ICommentInputProps extends ICommentsActions {
  slug: string
  currentUser: IUser
}

export const CommentInput = ({ slug, createComment, loadComments, currentUser }: ICommentInputProps) => {
  const [state, setState] = createStore<ICommentStore>({ body: '' })

  const handleBodyChange = (ev: InputEvent) => setState({ body: ev.target.value as string })

  const createCommentHandler = (ev: InputEvent) => {
    ev.preventDefault()

    setState({ isCreatingComment: true })

    createComment({ body: state.body })
      .then(() => {
        setState({ body: '' })
        loadComments(slug, true)
      })
      .catch((errors: IErrors) => setState({ errors }))
      .finally(() => setState({ isCreatingComment: false }))
  }

  return (
    <>
      <ListErrors errors={state.errors} />
      <form class="card comment-form" onSubmit={createCommentHandler}>
        <div class="card-block">
          <textarea
            class="form-control"
            placeholder="Write a comment..."
            value={state.body}
            disabled={state.isCreatingComment}
            onChange={handleBodyChange}
            rows="3"
          />
        </div>
        <div class="card-footer">
          <img src={currentUser.image} class="comment-author-img" alt="" />
          <button class="btn btn-sm btn-primary" type="submit">
            Post Comment
          </button>
        </div>
      </form>
    </>
  )
}
