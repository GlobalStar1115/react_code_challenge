import { callGet, callPost } from '../../services/axios'

import {
  GET_LIST_PORTFOLIOS_SUCCEED,
  GET_LIST_PORTFOLIOS_START,
  CREATE_PORTFOLIO_START,
  CREATE_PORTFOLIO_SUCCEED,
  CREATE_PORTFOLIO_FAILD,
  ADD_CAMPAIGN_EXISTING_PORTFOLIO_START,
  ADD_CAMPAIGN_EXISTING_PORTFOLIO_SUCCEED,
  SORT_PORTFOLIO_DATA,
  SET_DATE_RANGE
} from '../actionTypes/portfolio'

export const sortPortfolioData = (data) => {
  return { type: SORT_PORTFOLIO_DATA, data }
}

export const setDateRange = ({ startDate, endDate }) => {
  return {
    type: SET_DATE_RANGE,
    data: {startDate, endDate}
  }
}

export const getListPortfolios = () => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch(getListPortfoliosStart())
  callGet(`/portfolio/getListPortfolio/?user=${currentUserId}`, token).then((response) => {
    dispatch(getListPortfoliosSucceed(response['data']))
  })
}

export const getListPortfoliosSucceed = (data) => {
  return {
    type: GET_LIST_PORTFOLIOS_SUCCEED,
    data
  }
}
export const getListPortfoliosStart = () => {
  return {
    type: GET_LIST_PORTFOLIOS_START
  }
}

export const createPortfolio = ( { user, portfolioName }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(
    createPortfolioStart()
  )
  callPost('/portfolio/createPortfolio', {
    user,
    portfolioName,
  }, token).then((response) => {
    dispatch(
      createPortfolioSucceed(response['data'])
    )
  }).catch((error) => {
    dispatch(
      createPortfolioFaild(error)
    )
  })
}
export const createPortfolioStart = () => {
  return { type: CREATE_PORTFOLIO_START }
}
export const createPortfolioSucceed = (data) => {
  return { type: CREATE_PORTFOLIO_SUCCEED, data }
}
export const createPortfolioFaild = (data) => {
  return { type: CREATE_PORTFOLIO_FAILD, data }
}

//add campaign to existing portfolio
export const addCampaignToExistingPortfolio = ({ campaigns, user, portfolioId }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch({ type: ADD_CAMPAIGN_EXISTING_PORTFOLIO_START })
  callPost('/campaign/updatePortfolioOfCampaign/', {
    user,
    campaigns,
    portfolioId
  }, token).then((response) => {
    dispatch({ type: ADD_CAMPAIGN_EXISTING_PORTFOLIO_SUCCEED, data: response.data })
  })
}