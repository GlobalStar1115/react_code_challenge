import { callGet, callPost } from '../../services/axios'

import {
  GET_SP_SUGGESTIONS_START,
  GET_SP_SUGGESTIONS_SUCCEED,
  GET_SUGGESTED_BIDS_START,
  GET_SUGGESTED_BIDS_SUCCEED,
  CREATE_CAMPAIGN_START,
  CREATE_CAMPAIGN_FINISH,
  GET_SD_SUGGESTIONS_START,
  GET_SD_SUGGESTIONS_SUCCEED,
} from '../actionTypes/campaignCreator'

export const getSPSuggestions = asins => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_SP_SUGGESTIONS_START,
  })

  callGet('/campaignCreator/getSPSuggestions', token, {
    userId: currentUserId,
    asins: asins.join(','),
  }).then((response) => {
    dispatch({
      type: GET_SP_SUGGESTIONS_SUCCEED,
      data: response.data,
    })
  })
}

export const getSuggestedKeywordBids = keywords => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_SUGGESTED_BIDS_START,
  })

  callGet('/campaignCreator/getSuggestedKeywordBids', token, {
    userId: currentUserId,
    keywords,
  }).then((response) => {
    dispatch({
      type: GET_SUGGESTED_BIDS_SUCCEED,
      data: response.data,
    })
  })
}

export const createSPCampaign = (data) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CREATE_CAMPAIGN_START,
  })

  return callPost('/campaign/createCampaignsAsync/', Object.assign({}, data, {
    user: currentUserId,
  }), token).then(() => {
    dispatch({
      type: CREATE_CAMPAIGN_FINISH,
    })
  }).catch((error) => {
    dispatch({
      type: CREATE_CAMPAIGN_FINISH,
    })
    if (typeof error === 'string') {
      return Promise.reject(error)
    }
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data.details
        || error.response.data.text
        || 'Failed to create a campaign.')
    }
    return Promise.reject('Failed to create a campaign.')
  })
}

export const getSDSuggestions = (tactic, asins) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_SD_SUGGESTIONS_START,
  })

  callGet('/campaignCreator/getSDSuggestions', token, {
    userId: currentUserId,
    tactic,
    asins: asins.join(','),
  }).then((response) => {
    dispatch({
      type: GET_SD_SUGGESTIONS_SUCCEED,
      data: response.data,
    })
  })
}

export const getSDAudiences = path => async (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  return await callGet('/campaignCreator/getSDAudiences', token, {
    userId: currentUserId,
    path,
  }).then(response => response.data)
}

export const createSDCampaign = (data) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CREATE_CAMPAIGN_START,
  })

  return callPost('/campaignCreator/createSDCampaign', Object.assign({}, data, {
    userId: currentUserId,
  }), token).then((response) => {
    if (response.data.errorDetails) {
      return Promise.reject(response.data.text || 'Failed to create a campaign.')
    }
    dispatch({
      type: CREATE_CAMPAIGN_FINISH,
    })
  }).catch((error) => {
    dispatch({
      type: CREATE_CAMPAIGN_FINISH,
    })
    if (typeof error === 'string') {
      return Promise.reject(error)
    }
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data.details
        || error.response.data.text
        || 'Failed to create a campaign.')
    }
    return Promise.reject('Failed to create a campaign.')
  })
}
