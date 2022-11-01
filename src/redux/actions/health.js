import moment from 'moment'
import { callGet } from '../../services/axios'

import {
  GET_SUMMARY_DATA_START,
  GET_SUMMARY_DATA_SUCCEED,
  GET_MATCH_TYPE_DATA_START,
  GET_MATCH_TYPE_DATA_SUCCEED,
  GET_PLACEMENT_REPORT_START,
  GET_PLACEMENT_REPORT_SUCCEED,
  GET_LIST_CAMPAIGNS_SUCCEED,
  SET_DATE_RANGE,
  SAVE_NOTIFICATION_PLAN_STARTED,
  SAVE_NOTIFICATION_PLAN_SUCCEED,
  DISABLE_NOTIFICATION
} from '../actionTypes/health'

export const disableNotification = () => {
  return {
    type: DISABLE_NOTIFICATION
  }
}
export const saveNotificationPlan = ({weeklyAlert, monthlyAlert, additionalAlert}) => (dispatch, getState) => {
  const { auth: { token }, header: {currentUserId} } = getState()

  dispatch(saveNotificationPlanStarted())
  callGet(`/account/saveNotifications`, token, {
    weeklyAlert: weeklyAlert ? 1:0,
    monthlyAlert: monthlyAlert ? 1:0,
    additionalAlert: additionalAlert ? 1:0,
    userId: currentUserId
  }).then((response) => {
    dispatch(saveNotificationPlanSucceed(response['data']))
  })
}
export const saveNotificationPlanStarted = () => {
  return {
    type: SAVE_NOTIFICATION_PLAN_STARTED
  }
}
export const saveNotificationPlanSucceed = (data) => {
  return {
    type: SAVE_NOTIFICATION_PLAN_SUCCEED,
    data
  }
}

export const setDateRange = ({ startDate, endDate, adTypeFilter, productFilter, portfolioFilter }) => (dispatch) => {
  dispatch(getAccountHealthData({
    startDate,
    endDate,
    adTypeFilter,
    productFilter,
    portfolioFilter
  }))
  dispatch(setHealthDateRange({startDate, endDate}))
}
export const setHealthDateRange = (data) => {
  return {
    type: SET_DATE_RANGE,
    data
  }
}

export const getAccountHealthData = (data) => (dispatch, getState) => {
  const { auth: { token }, header: {currentUserId} } = getState()
  const startDate = moment(data['startDate']).format('YYYY-MM-DD')
  const endDate = moment(data['endDate']).format('YYYY-MM-DD')

  const query = {}

  if (data && data['adTypeFilter'] && data['adTypeFilter'].value && data['adTypeFilter'].value !== 'all') {
    query['campaignAdType'] = data['adTypeFilter'].value
  }
  if (data && data['productFilter'] && data['productFilter'].value && data['productFilter'].value !== 'all') {
    query['productSkuId'] = data['productFilter'].value
  }
  if (data && data['portfolioFilter'] && data['portfolioFilter'].value && data['portfolioFilter'].value !== 'all') {
    query['portfolioId'] = data['portfolioFilter'].value
  }

  dispatch(getSummaryDataStart())
  dispatch(getMatchTypeDataStart())
  dispatch(getPlacementReportStart())

  callGet(`/account/listCampaignsAdType`, token, {
    endDate,
    startDate,
    user: currentUserId,
    ...query
  }).then((response) => {
    dispatch(getListCampaignsSucceed(response['data']))
  })
  callGet(`/account/getSummaryAdType`, token, {
    endOfMonth: endDate,
    startOfMonth: startDate,
    userId: currentUserId,
    ...query
  }).then((response) => {
    dispatch(getSummaryDataSucceed(response['data']))
  })
  callGet(`/account/getMatchTypeDataAdType`, token, {
    endOfMonth: endDate,
    startOfMonth: startDate,
    userId: currentUserId,
    ...query
  }).then((response) => {
    dispatch(getMatchTypeDataSucceed(response['data']))
  })
  callGet(`/account/getPlacementReportAdType`, token, {
    endOfMonth: endDate,
    startOfMonth: startDate,
    userId: currentUserId,
    ...query
  }).then((response) => {
    dispatch(getPlacementReportSucceed(response['data']))
  })
}

export const getListCampaignsSucceed = (data) => {
  return {
    type: GET_LIST_CAMPAIGNS_SUCCEED,
    data
  }
}

export const getSummaryDataStart = () => {
  return {
    type: GET_SUMMARY_DATA_START
  }
}
export const getSummaryDataSucceed = (data) => {
  return {
    type: GET_SUMMARY_DATA_SUCCEED,
    data
  }
}

export const getMatchTypeDataStart = () => {
  return {
    type: GET_MATCH_TYPE_DATA_START
  }
}
export const getMatchTypeDataSucceed = (data) => {
  return {
    type: GET_MATCH_TYPE_DATA_SUCCEED,
    data
  }
}

export const getPlacementReportStart = () => {
  return {
    type: GET_PLACEMENT_REPORT_START
  }
}
export const getPlacementReportSucceed = (data) => {
  return {
    type: GET_PLACEMENT_REPORT_SUCCEED,
    data
  }
}