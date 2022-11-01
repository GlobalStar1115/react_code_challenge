import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import { callGet, callPost } from '../../services/axios.js'
import {
  LOGIN_START,
  LOGIN_SUCCEED,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  CHANGE_USER_INFO_SUCCEED,
  SAVE_NOTIFICATION_SUCCEED,
  SAVE_UNIVERSAL_SUCCEED,
  CHECK_AUTH_SUCCEED,
  CHECK_AUTH_FAILED,
  SIGNUP_BASIC_START,
  SIGNUP_BASIC_SUCCEED,
  SIGNUP_BASIC_FAILED,
  SP_CODE_START,
  SP_CODE_SUCCEED,
  SP_CODE_FAILED,
  AD_CODE_START,
  AD_CODE_SUCCEED,
  AD_CODE_FAILED,
  SIGNUP_SUCCEED,
} from '../actionTypes/auth.js'

import {
  setCurrentUser,
} from '../../redux/actions/header'

export const checkAuth = () => (dispatch, getState) => {
  const { auth: { token } } = getState()

  callGet(`/auth/me`, token).then((response) => {
    dispatch({
      type: CHECK_AUTH_SUCCEED,
      coinHistories: response.data.coinHistories,
    })
  }).catch(() => {
    dispatch({
      type: CHECK_AUTH_FAILED,
    })
  })
}

export const doLogin = data => (dispatch) => {
  dispatch({ type: LOGIN_START })
  return callPost('/login', {
    identifier: data.email,
    password: data.pwd,
  }).then((response) => {
    if (response.data) {
      dispatch({
        type: LOGIN_SUCCEED,
        data: response.data,
      })
      dispatch(setCurrentUser(response.data.user.id))
    } else {
      dispatch({ type: LOGIN_FAILED })
      return Promise.reject()
    }
  }).catch(() => {
    dispatch({ type: LOGIN_FAILED })
    return Promise.reject()
  })
}

export const doLogout = () => (dispatch) => {
  dispatch({ type: LOGOUT_SUCCESS })
}

export const changeUserInfo = ({ password, firstName, lastName, email }) => (dispatch, getState) => {
  const { auth: { user, token } } = getState()
  return callPost('/update-info', {
    userId: user.id,
    password,
    firstName,
    lastName,
    email,
  }, token).then((response) => {
    if (response.data === 'ok') {
      dispatch({
        type: CHANGE_USER_INFO_SUCCEED,
        data: {
          firstName,
          lastName,
          email,
        },
      })

      toast.show({
        title: 'Success',
        description: 'Changed successfully.',
      })
    } else {
      let error = 'Failed to update the user information.'
      if (response.data === 'notp') {
        error = 'The password is incorrect.'
      }
      toast.show({
        title: 'Danger',
        description: error,
      })
    }
  })
}

export const changePassword = ({ oldpwd, newpwd }) => (dispatch, getState) => {
  const { auth: { user, token } } = getState()
  return callPost('/pchange', {
    userId: user.id,
    oldpwd,
    newpwd,
  }, token).then((response) => {
    if (response.data === 'ok') {
      toast.show({
        title: 'Success',
        description: 'Changed successfully.',
      })
    } else {
      let error = 'Failed to change password.'
      if (response.data === 'notp') {
        error = 'The old password is incorrect.'
      }
      toast.show({
        title: 'Danger',
        description: error,
      })
    }
  })
}

export const saveNotification = ({ monthlyAlert, weeklyAlert, additionalAlert }) => (dispatch, getState) => {
  const { auth: { token }, header: { selectedUserInfo } } = getState()
  return callGet(`/account/saveNotifications`, token, {
    userId: selectedUserInfo.user,
    monthlyAlert,
    weeklyAlert,
    additionalAlert,
  }).then(() => {
    dispatch({
      type: SAVE_NOTIFICATION_SUCCEED,
      data: {
        userId: selectedUserInfo.user,
        monthlyAlert,
        weeklyAlert,
        additionalAlert,
      }
    })

    toast.show({
      title: 'Success',
      description: 'Saved successfully.',
    })
  })
}

export const saveUniversalSettings = ({ profitMargin, acos }) => (dispatch, getState) => {
  const { auth: { token }, header: { selectedUserInfo } } = getState()
  return callGet(`/account/saveUniversalSettings`, token, {
    userId: selectedUserInfo.user,
    profitMargin,
    acos,
  }).then(() => {
    dispatch({
      type: SAVE_UNIVERSAL_SUCCEED,
      data: {
        userId: selectedUserInfo.user,
        profitMargin,
        acos,
      }
    })

    toast.show({
      title: 'Success',
      description: 'Saved successfully.',
    })
  })
}

export const getCardList = () => (dispatch, getState) => {
  const { auth: { user, token } } = getState()
  return callGet('/account/getCardList', token, {
    userId: user.id,
  }).then((response) => {
    return response.data
  })
}

export const signupBasic = (firstName, lastName, email, password) => (dispatch) => {
  dispatch({ type: SIGNUP_BASIC_START })
  return callPost('/account/signupBasic', {
    email,
  }).then((response) => {
    dispatch({
      type: SIGNUP_BASIC_SUCCEED,
      data: {
        firstName,
        lastName,
        email,
        password,
      },
    })
    return response.data.isValid
  }).catch((error) => {
    dispatch({ type: SIGNUP_BASIC_FAILED })
    return Promise.reject(error.response.data.message || 'Failed to sign up.')
  })
}

export const signupSPCode = code => (dispatch) => {
  dispatch({ type: SP_CODE_START })
  return callPost('/account/signupSPCode', {
    code,
  }).then((response) => {
    dispatch({
      type: SP_CODE_SUCCEED,
      data: response.data,
    })
  }).catch((error) => {
    dispatch({ type: SP_CODE_FAILED })
    return Promise.reject(error.response.data.message || 'Failed to get the refresh token.')
  })
}

export const signupADCode = (code, redirectUri) => (dispatch) => {
  dispatch({ type: AD_CODE_START })
  return callPost('/account/signupADCode', {
    code,
    redirectUri,
  }).then((response) => {
    dispatch({
      type: AD_CODE_SUCCEED,
      data: response.data,
    })
  }).catch((error) => {
    dispatch({ type: AD_CODE_FAILED })
    return Promise.reject(error.response.data.message || 'Failed to get the refresh token.')
  })
}

export const signup = payload => (dispatch) => {
  return callPost('/account/signupV2', payload).then(() => {
    dispatch({ type: SIGNUP_SUCCEED })
  }).catch((error) => {
    return Promise.reject(error.response.data.message || 'Failed to sign up.')
  })
}
