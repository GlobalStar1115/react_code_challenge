import {
  GET_ACTIVITY_LOG_START,
  GET_ACTIVITY_LOG_SUCCEED,
  GET_ACTIVITY_LOG_FAIL,
} from '../actionTypes/activityLog'

export const initialState = {
  isLoading: false,
  logs: [],
}

const activityLog = (state = initialState, action) => {
	switch (action.type) {
    case GET_ACTIVITY_LOG_START:
      return {
        ...state,
        isLoading: true,
        logs: [],
      }
    case GET_ACTIVITY_LOG_SUCCEED:
      return {
        ...state,
        isLoading: false,
        logs: action.data,
      }
    case GET_ACTIVITY_LOG_FAIL:
      return {
        ...state,
        isLoading: false,
      }
    default:
      return state
  }
}

export default activityLog
