// action for campaign log
import { callGet } from '../../services/axios'

import {
  GET_OUT_OF_BUDGET_CAMPAIGNS_START,
  GET_OUT_OF_BUDGET_CAMPAIGNS_SUCCESS,
  GET_OUT_OF_BUDGET_CAMPAIGNS_FAIL,
} from '../actionTypes/campaignLog'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'

export const loadOutOfBudgetLog = () => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_OUT_OF_BUDGET_CAMPAIGNS_START,
  })
  callGet('/campaignlog/loadOutOfBudgetLog', token, {
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_OUT_OF_BUDGET_CAMPAIGNS_SUCCESS,
      data: response['data'],
    })
  }).catch((error) => {
    dispatch({
      type: GET_OUT_OF_BUDGET_CAMPAIGNS_FAIL,
      error,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get the campaigns out of budget.',
    })
  })
}
