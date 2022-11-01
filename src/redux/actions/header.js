import { callGet } from '../../services/axios'
import {
  GET_ALL_ACCOUNT_START,
  GET_ALL_ACCOUNT_SUCCEED,
  SET_CURRENT_USER,
  SET_SELECTED_USER_INFO,
  GET_CURRENCY_RATE_SUCCEED,
  SET_CURRENCY_INFO,
  SET_DATE_RANGE,
  SET_NOTIFICATION_CHECKED,
  SET_OUT_OF_BUDGET,
} from '../actionTypes/header'

export const getAllAccount = ({ userId }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch({
    type: GET_ALL_ACCOUNT_START,
  })
  callGet('/account/getAllAccounts', token, {
    user: userId,
  }).then((response) => {
    dispatch({
      type: GET_ALL_ACCOUNT_SUCCEED,
      data: response.data,
    })
  })
}

export const setCurrentUser = (data) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_USER,
    data,
  })
}

export const setSelectedUserInfo = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTED_USER_INFO,
    data,
  })
}

export const getCurrencyRate = () => (dispatch, getState) => {
  const { auth: { token } } = getState()
  callGet('/home/getCurrencyRate/', token).then((response) => {
    dispatch(getCurrencyRateSucceed(response['data']))
  })
}

export const getCurrencyRateSucceed = (data) => {
  return {
    type: GET_CURRENCY_RATE_SUCCEED,
    data
  }
}

export const setCurrencyInfo = (data) => (dispatch) => {
  dispatch({
    type: SET_CURRENCY_INFO,
    data
  })
}

export const setDateRange = ({ startDate, endDate }) => (dispatch) => {
  dispatch({
    type: SET_DATE_RANGE,
    data: { startDate, endDate }
  })
}

export const setNotificationChecked = (data) => {
  return {
    type: SET_NOTIFICATION_CHECKED,
    data,
  }
}

export const setOutOfBudget = (data) => {
  return {
    type: SET_OUT_OF_BUDGET,
    data,
  }
}
