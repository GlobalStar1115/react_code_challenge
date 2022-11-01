import { callGet } from '../../services/axios'

import {
  MAX_DASHBOARD_TABLE,
  MIN_DASHBOARD_TABLE,
  GET_DASHBOARD_SALES_STATS_START,
  GET_DASHBOARD_SALES_STATS_SUCCEED,
  GET_DASHBOARD_STATS_START,
  GET_DASHBOARD_STATS_SUCCEED,
} from '../actionTypes/dashboard'

export const MaxDashboardTable = () => {
  return {
    type: MAX_DASHBOARD_TABLE
  }
}
export const MinDashboardTable = () => {
  return {
    type: MIN_DASHBOARD_TABLE
  }
}

export const getSalesStats = ({ startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_DASHBOARD_SALES_STATS_START,
  })

  callGet(`/dashboard/getSalesStats/?userId=${currentUserId}`
    + `&startDate=${startDate}&endDate=${endDate}`, token).then((response) => {
    dispatch({
      type: GET_DASHBOARD_SALES_STATS_SUCCEED,
      data: response['data'],
    })
  })
}

export const getStats = ({ adType, startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_DASHBOARD_STATS_START,
  })

  callGet(`/dashboard/getStats/?userId=${currentUserId}&adType=${adType}`
    + `&startDate=${startDate}&endDate=${endDate}`, token).then((response) => {
    dispatch({
      type: GET_DASHBOARD_STATS_SUCCEED,
      data: response['data'],
    })
  })
}
