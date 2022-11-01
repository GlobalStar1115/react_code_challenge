import moment from 'moment'
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

export const initialState = {
  matchTypes: [],
  summaryData: {},
  placementData: {auto:{}, legacy:{}, manual:{}},
  listCampaignData: {},
  isLoadingSummary: false,
  isLoadingMatchType: false,
  isLoadingPlacement: false,
  isSavingNotificationPlan: false,
  isNotificationUpdated: false,
  startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD')
}

const header = (state = initialState, action) => {
	switch (action.type) {
    case DISABLE_NOTIFICATION:
      return {
        ...state,
        isNotificationUpdated: false
      }
    case SAVE_NOTIFICATION_PLAN_STARTED:
      return {
        ...state,
        isSavingNotificationPlan: true
      }
    case SAVE_NOTIFICATION_PLAN_SUCCEED:
      return {
        ...state,
        isSavingNotificationPlan: false,
        isNotificationUpdated: true
      }
    case SET_DATE_RANGE:
      return {
        ...state,
        startDate: action.data.startDate,
        endDate: action.data.endDate
      }
    case GET_LIST_CAMPAIGNS_SUCCEED:
      return {
        ...state,
        listCampaignData: action.data
      }
    case GET_SUMMARY_DATA_START:
      return {
        ...state,
        isLoadingSummary: true
      }
    case GET_SUMMARY_DATA_SUCCEED:
      return {
        ...state,
        summaryData: action.data,
        isLoadingSummary: false
      }
    case GET_MATCH_TYPE_DATA_START:
      return {
        ...state,
        isLoadingMatchType: true
      }
    case GET_MATCH_TYPE_DATA_SUCCEED:
      return {
        ...state,
        matchTypes: action.data,
        isLoadingMatchType: false
      }
    case GET_PLACEMENT_REPORT_START:
      return {
        ...state,
        isLoadingPlacement: true
      }
    case GET_PLACEMENT_REPORT_SUCCEED:
      return {
        ...state,
        placementData: action.data,
        isLoadingPlacement: false
      }
    default:
      return state
  }
}

export default header