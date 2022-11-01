import { APP_START } from '../actionTypes/app.js'

// The initial state of the App
export const initialState = {
  loading: false,
  createLoading: false,
  error: false,
  appState: 'NOT_STARTED',
}

const user = (state = initialState, action) => {
  switch (action.type) {
    case APP_START:
      return {
        ...state,
        appState: 'INITIALIZING',
      };
    default:
      return state
  }
}

export default user
