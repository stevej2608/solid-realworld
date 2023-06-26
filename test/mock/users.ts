import { rest } from 'msw'
import { API_ROOT } from '../../src/config'
import { IUser, INewUser } from '../../src/api/Api'

export const currentUser: IUser = {

}

export const newUserHandler = rest.post(`${API_ROOT}/users`, (req, res, ctx) => {
  const user: INewUser = { ...req.body.user }

  currentUser.email = user.email,
  currentUser.token = "dummytoken",
  currentUser.username = user.username,
  currentUser.bio = "A short bio",
  currentUser.image = ''

  return res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json({ user: currentUser })
  )

})

export const currentUserHandler = rest.get(`${API_ROOT}/user`, (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.delay(500),
    ctx.json({ user: currentUser })
  )

})
