import {
  GET_OUT_OF_BUDGET_CAMPAIGNS_START,
  GET_OUT_OF_BUDGET_CAMPAIGNS_SUCCESS,
  GET_OUT_OF_BUDGET_CAMPAIGNS_FAIL,
} from '../actionTypes/campaignLog'

export const initialState = {
  isOutOfBudgetCampaignLogsLoading: false,
  outOfBudgetCampaignLogs: [],
}

const campaignLog = (state = initialState, action) => {
	switch (action.type) {
    case GET_OUT_OF_BUDGET_CAMPAIGNS_START:
      return {
        ...state,
        isOutOfBudgetCampaignLogsLoading: true,
      }
    case GET_OUT_OF_BUDGET_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        isOutOfBudgetCampaignLogsLoading: false,
        outOfBudgetCampaignLogs: action.data,
      }
    case GET_OUT_OF_BUDGET_CAMPAIGNS_FAIL:
      return {
        ...state,
        isOutOfBudgetCampaignLogsLoading: false,
      }
    default:
      return state
  }
}

export default campaignLog