import { JSX } from 'solid-js'
import { createStore } from 'solid-js/store'
import { NavLink } from '../components/NavLink'
import { ListErrors, IErrors } from '../components/ListErrors'
import { useStore } from '../store/storeContext'
import { INewUser } from '../api/Api'

interface IAuthStore extends INewUser {
  errors: IErrors
  inProgress: boolean
}

export default () => {
  const [state, setState] = createStore<IAuthStore>({ username: '', inProgress: false })
  const [, { register, login }] = useStore()
  const isLogin = location.hash.includes('login')
  const text = isLogin ? 'Sign in' : 'Sign up'
  const link = isLogin ? <NavLink route="register">Need an account?</NavLink> : <NavLink route="login">Have an account?</NavLink>

  const handleSubmit = (e: InputEvent) => {
    e.preventDefault()
    setState({ inProgress: true })
    const p = isLogin ? login(state.email, state.password) : register(state.username, state.email, state.password)
    p.then(() => (location.hash = '/'))
      .catch((errors: IErrors) => setState({ errors }))
      .finally(() => setState({ inProgress: false }))
  }

  return (
    <div class="auth-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center" textContent={text} />
            <p class="text-xs-center">{link}</p>
            <ListErrors errors={state.errors} />
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    value={state.username || ''}
                    onChange={e => setState({ username: e.target.value })}
                  />
                </fieldset>
              )}
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  value={state.email || ''}
                  onChange={e => setState({ email: e.target.value })}
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={state.password || ''}
                  onChange={e => setState({ password: e.target.value })}
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" type="submit" disabled={state.inProgress} textContent={text} />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
