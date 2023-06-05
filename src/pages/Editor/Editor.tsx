import { createComputed, JSX } from 'solid-js'
import { createStore, IStoreContext } from 'solid-js/store'
import { useStore } from '../../store/storeContext'

import { ListErrors } from '../../components/ListErrors'
import { IArticle } from '../../api/Api'

interface IEditState extends IArticle {
  tagInput: string
  inProgress: boolean
  errors: string
}

interface IEditProps {
  slug: string
}

export default ({ slug }: IEditProps) => {
  const [store, { createArticle, updateArticle }] = useStore()
  const [state, setState] = createStore<IEditState>({ tagInput: '', tagList: [] })

  const updateState = field => (ev: InputEvent) => {
    setState(field, ev.target.value)
  }

  const handleAddTag = () => {
    if (state.tagInput) {
      setState((s: IEditState) => {
        s.tagList.push(s.tagInput.trim())
        s.tagInput = ''
      })
    }
  }

  const handleRemoveTag = tag => {
    !state.inProgress && setState('tagList', tags => tags.filter(t => t !== tag))
  }

  const handleTagInputKeyDown = (ev: InputEvent) => {
    switch (ev.keyCode) {
      case 13: // Enter
      case 9: // Tab
      case 188: // ,
        if (ev.keyCode !== 9) ev.preventDefault()
        handleAddTag()
        break
      default:
        break
    }
  }

  function submitForm(ev: Event) {
    ev.preventDefault()

    setState({ inProgress: true })

    const { inProgress, tagsInput, ...article } = state
    const promise = slug ? updateArticle(article) : createArticle(article)

    promise
      .then(article => {
        location.hash = `/article/${article.slug}`
      })
      .catch((errors: string) => {
        setState({ errors })
      })
      .finally(() => {
        setState({ inProgress: false })
      })
  }

  createComputed(() => {
    let article: IArticle
    if (!slug || !(article = store.articles[slug])) return
    setState(article)
  })

  return (
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={state.errors} />
            <form>
              <fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Article Title"
                    value={state.title || ''}
                    onChange={updateState('title')}
                    disabled={state.inProgress}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="What's this article about?"
                    value={state.description || ''}
                    onChange={updateState('description')}
                    disabled={state.inProgress}
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    value={state.body || ''}
                    onChange={updateState('body')}
                    disabled={state.inProgress}
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    value={state.tagInput}
                    onChange={updateState('tagInput')}
                    onBlur={handleAddTag}
                    onKeyup={handleTagInputKeyDown}
                    disabled={state.inProgress}
                  />
                  <div class="tag-list">
                    <For each={state.tagList}>
                      {tag => (
                        <span class="tag-default tag-pill">
                          <i class="ion-close-round" onClick={[handleRemoveTag, tag]} />
                          {tag}
                        </span>
                      )}
                    </For>
                  </div>
                </fieldset>
                <button class="btn btn-lg pull-xs-right btn-primary" type="button" disabled={state.inProgress} onClick={submitForm}>
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
