import { callPost } from '../../services/axios.js'

import {
  COIN_EARNED,
} from '../actionTypes/coin'

import {
  COIN_TYPE_PURCHASE_COACHING,
  COIN_TYPE_PURCHASE_OP,
} from '../../utils/constants/coin'

export const buyCoaching = topics => (dispatch, getState) => {
  const { auth: { token } } = getState()

  return callPost('/marketplace/buyCoaching', {
    topics,
  }, token).then((response) => {
    if (response.data.amount) {
      dispatch({
        // The name of action type is misleading, because coins
        // are spent here, not earned.
        type: COIN_EARNED,
        history: {
          type: COIN_TYPE_PURCHASE_COACHING,
          amount: response.data.amount,
        },
      })
    }
  }).catch((error) => {
    return Promise.reject(error.response.data.message || 'Failed to buy the ad coaching.')
  })
}

export const buyOp = answers => (dispatch, getState) => {
  const { auth: { token } } = getState()

  return callPost('/marketplace/buyOp', {
    answers,
  }, token).then((response) => {
    if (response.data.amount) {
      dispatch({
        // The name of action type is misleading, because coins
        // are spent here, not earned.
        type: COIN_EARNED,
        history: {
          type: COIN_TYPE_PURCHASE_OP,
          amount: response.data.amount,
        },
      })
    }
  }).catch((error) => {
    return Promise.reject(error.response.data.message || 'Failed to buy the optimization blitz.')
  })
}
