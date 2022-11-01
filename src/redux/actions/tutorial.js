import { callPost } from '../../services/axios.js'

import {
  COIN_EARNED,
} from '../actionTypes/coin'

import {
  COIN_TYPE_SCHEDULE_CALL,
} from '../../utils/constants/coin'

export const watch = flow => (dispatch, getState) => {
  const { auth: { token } } = getState()

  return callPost('/tutorial/watch', {
    flow,
  }, token).then((response) => {
    if (response.data.amount) {
      dispatch({
        type: COIN_EARNED,
        history: {
          type: flow,
          amount: response.data.amount,
          newlyEarned: true,
        },
      })
    }
  }).catch(() => {
    // Keep silence.
  })
}

export const scheduleCall = () => (dispatch, getState) => {
  const { auth: { token } } = getState()

  return callPost('/tutorial/scheduleCall', {}, token).then((response) => {
    if (response.data.amount) {
      dispatch({
        type: COIN_EARNED,
        history: {
          type: COIN_TYPE_SCHEDULE_CALL,
          amount: response.data.amount,
          newlyEarned: true,
        },
      })
    }
  }).catch(() => {
    // Keep silence.
  })
}
