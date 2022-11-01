import moment from 'moment'

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

import {
  SAVE_NOTIFICATION_SUCCEED,
  SAVE_UNIVERSAL_SUCCEED,
} from '../actionTypes/auth'

export const initialState = {
  listAccounts: [],
  isLoading: false,
  isInitialDataLoaded: false,
  currentUserId: '',
  selectedUserInfo: {},
  currencyRateList: {},
  currencyRate: 1,
  currencySign: '$',
  currentStartDate: moment().startOf('day').subtract(29, 'day').toDate(),
  currentEndDate: moment().endOf('day').toDate(),
  isCheckedNotification: false,
  currentOutOfBudgetCampaignLogs: [],
}

const header = (state = initialState, action) => {
	switch (action.type) {
    case GET_ALL_ACCOUNT_START:
      return {
        ...state,
        isLoading: true,
      }
    case GET_ALL_ACCOUNT_SUCCEED:
      return {
        ...state,
        listAccounts: action.data,
        isLoading: false,
        isInitialDataLoaded: true,
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUserId: action.data,
        isInitialDataLoaded: false,
      }
    case SET_SELECTED_USER_INFO:
      return {
        ...state,
        selectedUserInfo: action.data,
        currentUserId: action.data.user,
        currencySign: action.data.currency.sign,
        isInitialDataLoaded: false,
      }
    case GET_CURRENCY_RATE_SUCCEED:
      return {
        ...state,
        currencyRateList: action.data && action.data.length > 0 && JSON.parse(action.data[0].response),
      }
    case SET_CURRENCY_INFO:
      return {
        ...state,
        currencyRate: action.data.currencyRate,
        currencySign: action.data.currencySign,
      }
    case SET_DATE_RANGE:
      return {
        ...state,
        currentStartDate: action.data.startDate,
        currentEndDate: action.data.endDate
      }
    case SAVE_NOTIFICATION_SUCCEED:
      const { userId, monthlyAlert, weeklyAlert, additionalAlert } = action.data
      return {
        ...state,
        listAccounts: state.listAccounts.map(account => {
          if (account.user === userId) {
            return {
              ...account,
              monthly_alert: monthlyAlert,
              weekly_alert: weeklyAlert,
              additional_alert: additionalAlert,
            }
          }
          return account
        }),
        selectedUserInfo: {
          ...state.selectedUserInfo,
          monthly_alert: monthlyAlert,
          weekly_alert: weeklyAlert,
          additional_alert: additionalAlert,
        },
      }
    case SAVE_UNIVERSAL_SUCCEED:
      const { userId: universalUserId, profitMargin, acos } = action.data
      return {
        ...state,
        listAccounts: state.listAccounts.map(account => {
          if (account.user === universalUserId) {
            return {
              ...account,
              average_profit: profitMargin,
              average_acos: acos,
            }
          }
          return account
        }),
        selectedUserInfo: {
          ...state.selectedUserInfo,
          average_profit: profitMargin,
          average_acos: acos,
        },
      }
    case SET_NOTIFICATION_CHECKED:
      return {
        ...state,
        isCheckedNotification: action.data,
      }
    case SET_OUT_OF_BUDGET:
      return {
        ...state,
        currentOutOfBudgetCampaignLogs: action.data,
      }
    default:
      return state
  }
}

export default header