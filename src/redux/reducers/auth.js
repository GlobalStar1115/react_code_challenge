import {
  LOGIN_START,
  LOGIN_SUCCEED,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  CHANGE_USER_INFO_SUCCEED,
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

export const initialState = {
  isLoading: false,
  isLoggedIn: false,
  token: '',
  user: {},
  isSigningBasic: false,
  signupBasicInfo: null,
  isSPCodeGetting: false,
  spRefreshToken: '',
  isADCodeGetting: false,
  adRefreshToken: '',
}

const auth = (state = initialState, action) => {
	switch (action.type) {
    case CHECK_AUTH_SUCCEED:
      return {
        ...state,
        isLoggedIn: true
      }
    case CHECK_AUTH_FAILED:
      return {
        ...state,
        isLoggedIn: false
      }
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
      }
    case LOGIN_SUCCEED:
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        token: action.data.token,
        user: action.data.user,
      }
    case LOGIN_FAILED:
      return {
        ...initialState,
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        token: '',
        user: {},
      }
    case CHANGE_USER_INFO_SUCCEED:
      return {
        ...state,
        user: {
          ...state.user,
          firstname: action.data.firstName,
          lastname: action.data.lastName,
          email: action.data.email,
        },
      }
    case SIGNUP_BASIC_START:
      return {
        ...state,
        isSigningBasic: true,
        signupBasicInfo: null,
        isSPCodeGetting: false,
        spRefreshToken: '',
        isADCodeGetting: false,
        adRefreshToken: '',
      }
    case SIGNUP_BASIC_SUCCEED:
      return {
        ...state,
        isSigningBasic: false,
        signupBasicInfo: action.data,
      }
    case SIGNUP_BASIC_FAILED:
      return {
        ...state,
        isSigningBasic: false,
      }
    case SP_CODE_START:
      return {
        ...state,
        isSPCodeGetting: true,
        spRefreshToken: '',
      }
    case SP_CODE_SUCCEED:
      return {
        ...state,
        isSPCodeGetting: false,
        spRefreshToken: action.data.refreshToken,
      }
    case SP_CODE_FAILED:
      return {
        ...state,
        isSPCodeGetting: false,
      }
    case AD_CODE_START:
      return {
        ...state,
        isADCodeGetting: true,
        adRefreshToken: '',
      }
    case AD_CODE_SUCCEED:
      return {
        ...state,
        isADCodeGetting: false,
        adRefreshToken: action.data.refreshToken,
      }
    case AD_CODE_FAILED:
      return {
        ...state,
        isADCodeGetting: false,
      }
    case SIGNUP_SUCCEED:
      return {
        ...state,
        isSigningBasic: false,
        signupBasicInfo: null,
        isSPCodeGetting: false,
        spRefreshToken: '',
        isADCodeGetting: false,
        adRefreshToken: '',
      }
    default:
      return state
  }
}

export default auth