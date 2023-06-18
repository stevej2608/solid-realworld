import { createEffect } from 'solid-js'
import { SetStoreFunction } from 'solid-js/store'
import { IStoreState } from './storeState'

import { logger } from '../utils/logger'
export interface ICommonActions {
  setToken: (token: string | undefined) => void
}

/**
 *
 * @param agent
 * @param actions
 * @param state
 * @param setState
 * @returns
 */

export function createCommonStore(actions: ICommonActions, state: IStoreState, setState: SetStoreFunction<IStoreState>): void {

  // Triggered by change in the store.token state. Save the new
  // token state to the local store.

  createEffect(() => {
    if (state.token) {
      logger.warn('Add token [%s ...]', state.token.slice(0, 15))
      localStorage.setItem('jwt', state.token)
    } else {
      logger.warn('Remove token')
      localStorage.removeItem('jwt')
    }
  })

  // login/logout actions call setToken() which updates the
  // token state in the store. This, in turn, triggers
  // the above createEffect()

  actions.setToken = (token: string | undefined) => {
    logger.info('setToken tok=%s', token)
    setState({ token })
  }

}
