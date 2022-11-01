import { GET_ALL_ACCOUNT_START } from '../actionTypes/header'
import {
  MAX_DASHBOARD_TABLE,
  MIN_DASHBOARD_TABLE,
  GET_DASHBOARD_SALES_STATS_START,
  GET_DASHBOARD_SALES_STATS_SUCCEED,
  GET_DASHBOARD_STATS_START,
  GET_DASHBOARD_STATS_SUCCEED,
} from '../actionTypes/dashboard.js'

export const initialState = {
  maxTable: false,
  salesStats: null,
  stats: null,
  isSalesStatsLoading: false,
  isStatsLoading: false,
}

const dashboard = (state = initialState, action) => {
	switch (action.type) {
    case GET_ALL_ACCOUNT_START:
      return initialState
    case MAX_DASHBOARD_TABLE:
      return {
        ...state,
        maxTable: true
      }
    case MIN_DASHBOARD_TABLE:
      return {
        ...state,
        maxTable: false
      }
    case GET_DASHBOARD_SALES_STATS_START:
      return {
        ...state,
        isSalesStatsLoading: true,
        salesStats: null,
      }
    case GET_DASHBOARD_SALES_STATS_SUCCEED:
      return {
        ...state,
        isSalesStatsLoading: false,
        salesStats: action.data,
      }
    case GET_DASHBOARD_STATS_START:
      return {
        ...state,
        isStatsLoading: true,
        stats: null,
      }
    case GET_DASHBOARD_STATS_SUCCEED:
      return {
        ...state,
        isStatsLoading: false,
        stats: action.data,
      }
    default:
      return state
  }
}

export default dashboard