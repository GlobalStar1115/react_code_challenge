import { callGet } from '../../services/axios'

import {
  GET_ACTIVITY_LOG_START,
  GET_ACTIVITY_LOG_SUCCEED,
  GET_ACTIVITY_LOG_FAIL,
} from '../actionTypes/activityLog'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'

export const getActivityLog = (startDate, endDate) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_ACTIVITY_LOG_START,
  })

  callGet('/campaignlog/loadLogByUserPaging', token, {
    user: currentUserId,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_ACTIVITY_LOG_SUCCEED,
      data: response.data,
    })
  }).catch((error) => {
    dispatch({
      type: GET_ACTIVITY_LOG_FAIL,
    })

    toast.show({
      title: 'Danger',
      description: error || 'Failed to load activity log.',
    })
  })
}
