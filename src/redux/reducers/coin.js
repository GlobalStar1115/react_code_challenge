import {
  LOGIN_START,
  CHECK_AUTH_SUCCEED,
} from '../actionTypes/auth'

import {
  COIN_EARNED,
} from '../actionTypes/coin'

export const initialState = {
  balance: 0,
  histories: [],
}

// TODO: Can we use useReducer()?
const calculateBalance = (histories) => {
  let balance = 0
  histories.forEach((history) => {
    balance += history.amount
  })
  return balance
}

const coin = (state = initialState, action) => {
	switch (action.type) {
    case CHECK_AUTH_SUCCEED:
      return {
        ...state,
        balance: calculateBalance(action.coinHistories),
        histories: action.coinHistories,
      }
    case LOGIN_START:
      return {
        ...initialState,
      }
    case COIN_EARNED:
      const histories = [
        ...state.histories,
        action.history,
      ]
      return {
        ...state,
        balance: calculateBalance(histories),
        histories,
      }
    default:
      return state
  }
}

export default coin