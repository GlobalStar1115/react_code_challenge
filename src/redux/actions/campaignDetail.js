import { callGet, callPost } from '../../services/axios'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import {
  GET_DETAILS_START,
  GET_DETAILS_SUCCEED,
  UPDATE_NAME_START,
  UPDATE_NAME_SUCCEED,
  UPDATE_NAME_FAIL,
  UPDATE_ACOS_START,
  UPDATE_ACOS_SUCCEED,
  UPDATE_ACOS_FAIL,
  UPDATE_PORTFOLIO_START,
  UPDATE_PORTFOLIO_SUCCEED,
  UPDATE_PORTFOLIO_FAIL,
  UPDATE_BIDDING_START,
  UPDATE_BIDDING_SUCCEED,
  UPDATE_BIDDING_FAIL,
  CHANGE_NEGATIVE_KEYWORD_STATE_START,
  CHANGE_NEGATIVE_KEYWORD_STATE_SUCCEED,
  CHANGE_NEGATIVE_TARGET_STATE_START,
  CHANGE_NEGATIVE_TARGET_STATE_SUCCEED,
  GET_SKU_DATA_START,
  GET_SKU_DATA_SUCCEED,
  CHANGE_SKU_STATE_START,
  CHANGE_SKU_STATE_SUCCEED,
  GET_ST_DATA_START,
  GET_ST_DATA_SUCCEED,
  GET_ST_DATA_FAIL,
  GET_NEGATIVE_KW_DATA_START,
  GET_NEGATIVE_KW_DATA_SUCCEED,
  GET_NEGATIVE_KW_DATA_FAIL,
  GET_BID_DATA_START,
  GET_BID_DATA_SUCCEED,
  GET_BID_DATA_FAIL,
  CHANGE_KEYWORD_BID_START,
  CHANGE_KEYWORD_BID_SUCCEED,
  CHANGE_KEYWORD_BID_FAIL,
  CHANGE_KEYWORD_STATE_START,
  CHANGE_KEYWORD_STATE_SUCCEED,
  GET_BID_TARGET_DATA_START,
  GET_BID_TARGET_DATA_SUCCEED,
  GET_BID_TARGET_DATA_FAIL,
  CHANGE_TARGET_START,
  CHANGE_TARGET_SUCCEED,
  CHANGE_TARGET_FAIL,
  GET_NEGATIVE_WORD_DATA_START,
  GET_NEGATIVE_WORD_DATA_SUCCEED,
  GET_NEGATIVE_WORD_DATA_FAIL,
  GET_NEGATIVE_TARGET_DATA_START,
  GET_NEGATIVE_TARGET_DATA_SUCCEED,
  GET_NEGATIVE_TARGET_DATA_FAIL,
  GET_PLACEMENT_DATA_START,
  GET_PLACEMENT_DATA_SUCCEED,
  GET_PLACEMENT_DATA_FAIL,
  UPDATE_PLACEMENT_BID_START,
  UPDATE_PLACEMENT_BID_SUCCEED,
  UPDATE_PLACEMENT_BID_FAIL,
} from '../actionTypes/campaignDetail'

export const getDetails = (data) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_DETAILS_START,
  })

  const {
    campaignId,
    campaignType,
    startDate,
    endDate,
  } = data

  callGet('/campaignDetail/getDetails', token, {
    userId: currentUserId,
    campaignId,
    campaignType,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_DETAILS_SUCCEED,
      data: response.data
    })
  })
}

// Retrieve a list of campaigns for campaign selector.
export const getCampaignList = (startDate, endDate) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  return callGet('/campaignDetail/getCampaignList', token, {
    userId: currentUserId,
    startDate,
    endDate,
  }).then(response => response.data)
}

export const updateName = ({ campaignId, campaignType, campaignName }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_NAME_START,
  })

  const url = `/campaign/checkAndUpdateCampaignName`
  callGet(url, token, {
    user: currentUserId,
    campaignId,
    campaignType,
    name: campaignName,
  }).then((response) => {
    dispatch({
      type: UPDATE_NAME_SUCCEED,
      data: {
        response: response['data'],
        campaignName: campaignName,
      },
    })

    toast.show({
      title: 'Success',
      description: 'Updated successfully.',
    })
  }).catch(() => {
    dispatch({
      type: UPDATE_NAME_FAIL,
    })

    toast.show({
      title: 'Danger',
      description: 'Failed to update the campaign name.',
    })
  })
}

export const updateAcos = ({ campaignId, campaignType, acos }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_ACOS_START,
  })

  callGet('/campaign/updateAcos', token, {
    user: currentUserId,
    campaignId,
    campaignType,
    acos,
  }).then(() => {
    dispatch({
      type: UPDATE_ACOS_SUCCEED,
      data: acos,
    })

    toast.show({
      title: 'Success',
      description: 'Updated successfully.',
    })
  }).catch(() => {
    dispatch({
      type: UPDATE_ACOS_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to update ACoS Target.',
    })
  })
}

export const updatePortfolio = ({ campaigns, portfolioId, portfolioName }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: UPDATE_PORTFOLIO_START,
  })
  callPost('/campaign/updatePortfolioOfCampaign/', {
    user: currentUserId,
    campaigns,
    portfolioId,
  }, token).then((response) => {
    dispatch({
      type: UPDATE_PORTFOLIO_SUCCEED,
      data: {
        response: response.data,
        portfolioId,
        portfolioName,
      },
    })

    if (!portfolioId) {
      toast.show({
        title: 'Success',
        description: 'The campaign was removed from an old portfolio.',
      })
    } else {
      toast.show({
        title: 'Success',
        description: 'The portfolio of campaign has been updated.',
      })
    }
  }).catch(() => {
    dispatch({ type: UPDATE_PORTFOLIO_FAIL })
    toast.show({
      title: 'Danger',
      description: 'Failed to update the portfolio of campaign.',
    })
  })
}

export const updateBidding = campaign => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_BIDDING_START,
  })

  callPost('/campaign/updateCampaignBidding/', {
    user: currentUserId,
    campaign,
  }, token).then((response) => {
    dispatch({
      type: UPDATE_BIDDING_SUCCEED,
      data: response.data,
    })

    toast.show({
      title: 'Success',
      description: 'Updated successfully.',
    })
  }).catch(() => {
    dispatch({
      type: UPDATE_BIDDING_FAIL,
    })

    toast.show({
      title: 'Danger',
      description: 'Failed to update bidding.',
    })
  })
}

export const changeNegativeKeywordState = (campaignType, negatives) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CHANGE_NEGATIVE_KEYWORD_STATE_START,
  })

  let sanitized
  if (campaignType === 'Sponsored Products') {
    sanitized = negatives.map(negative => ({
      keywordId: parseInt(negative.keywordId, 10),
      state: negative.state,
      isCampaignLevel: typeof negative.campaign_level !== 'undefined',
    }))
  } else {
    // For SB/SBV, we need campaign and ad group IDs as well.
    sanitized = negatives.map(negative => ({
      campaignId: Number(negative.campaign_id),
      adGroupId: Number(negative.adgroup_id),
      keywordId: parseInt(negative.keywordId, 10),
      state: negative.state,
    }))
  }

  callPost('/campaignDetail/updateNegativeKeywords', {
    userId: currentUserId,
    campaignType,
    negatives: sanitized,
  }, token).then((response) => {
    dispatch({
      type: CHANGE_NEGATIVE_KEYWORD_STATE_SUCCEED,
      data: response.data,
    })

    toast.show({
      title: 'Success',
      description: 'Updated successfully.',
    })
  })
}

export const changeNegativeTargetState = (campaignType, negatives) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CHANGE_NEGATIVE_TARGET_STATE_START,
  })

  let sanitized
  if (campaignType === 'Sponsored Products') {
    sanitized = negatives.map(negative => ({
      targetId: parseInt(negative.target_id, 10),
      state: negative.state,
      isCampaignLevel: typeof negative.campaign_level !== 'undefined',
    }))
  } else if (campaignType === 'Sponsored Displays') {
    sanitized = negatives.map(negative => ({
      targetId: parseInt(negative.target_id, 10),
      state: negative.state,
    }))
  } else {
    sanitized = negatives.map(negative => ({
      targetId: parseInt(negative.target_id, 10),
      adGroupId: parseInt(negative.adgroup_id, 10),
      state: negative.state,
    }))
  }

  callPost('/campaignDetail/updateNegativeTargets', {
    userId: currentUserId,
    campaignType,
    negatives: sanitized,
  }, token).then((response) => {
    dispatch({
      type: CHANGE_NEGATIVE_TARGET_STATE_SUCCEED,
      data: response.data,
    })

    toast.show({
      title: 'Success',
      description: 'Updated successfully.',
    })
  })
}

export const getSKUData = ({ campaignId, campaignType, startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_SKU_DATA_START,
  })

  callGet('/campaignDetail/getSKUData', token, {
    userId: currentUserId,
    campaignId,
    campaignType,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_SKU_DATA_SUCCEED,
      data: response.data,
    })
  })
}

export const changeSkuState = ({ campaignType, productAds, adId, state, adGroupId }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: CHANGE_SKU_STATE_START,
  })
  callGet('/campaign/updateProductAdState', token, {
    user: currentUserId,
    campaignType,
    productAds,
  }).then((response) => {
    dispatch({
      type: CHANGE_SKU_STATE_SUCCEED,
      data: {
        response: response.data,
        adGroupId,
        adId,
        state,
      },
    })

    toast.show({
      title: 'Success',
      description: 'State has been changed.',
    })
  })
}

export const getSTData = (data) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  const {
    campaignId,
    campaignType,
    startDate,
    endDate,
    isProfitable,
    stOnly,
    targetAcos,
  } = data

  dispatch({
    type: GET_ST_DATA_START,
  })

  callGet('/campaignDetail/getSTData', token, {
    userId: currentUserId,
    campaignId,
    campaignType,
    startDate,
    endDate,
    isProfitable,
    stOnly,
    targetAcos,
  }).then((response) => {
    dispatch({
      type: GET_ST_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_ST_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to load search terms.',
    })
  })
}

export const getNegativeKWData = ({ campaignId, adGroupIds }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_NEGATIVE_KW_DATA_START,
  })
  callGet('/campaign/listNegativeKeywordByBoths', token, {
    userId: currentUserId,
    campaignId,
    adGroupIds,
  }).then((response) => {
    dispatch({
      type: GET_NEGATIVE_KW_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_NEGATIVE_KW_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get negative keywords.',
    })
  })
}

export const getBidData = data => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  const {
    campaignId,
    adgroupId,
    campaignType,
    startDate,
    endDate,
    targetAcos,
    isProfitable,
  } = data

  dispatch({
    type: GET_BID_DATA_START,
  })

  callGet('/campaignDetail/getBidData', token, {
    userId: currentUserId,
    campaignId,
    adgroupId,
    campaignType,
    startDate,
    endDate,
    targetAcos,
    isProfitable,
  }).then((response) => {
    dispatch({
      type: GET_BID_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_BID_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to load keywords.',
    })
  })
}

export const changeKeywordBid = ({ changeToNewBid, campaignType, keywords, newAdjustBid, adjustType }) => (dispatch, getState) => {
  const {
    auth: { token },
    header: { currentUserId },
    campaignDetail: { currentAcos },
  } = getState()

  dispatch({
    type: CHANGE_KEYWORD_BID_START,
  })

  callGet('/campaign/updateBiddableKeywordsList', token, {
    user: currentUserId,
    changeToNewBid,
    campaignType,
    keywords,
    newAdjustBid,
    adjustType,
  }).then((response) => {
    toast.show({
      title: 'Success',
      description: 'Bid was changed.',
    })
    dispatch({
      type: CHANGE_KEYWORD_BID_SUCCEED,
      data: {
        response: response.data,
        campaignType,
        changeToNewBid,
        adjustType,
        newAdjustBid,
        currentAcos,
      }
    })
  }).catch(() => {
    toast.show({
      title: 'Danger',
      description: 'Failed to update keyword bid.',
    })
    dispatch({
      type: CHANGE_KEYWORD_BID_FAIL,
    })
  })
}

export const changeKeywordState = ({ keywordsArr, state, campaignType }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: CHANGE_KEYWORD_STATE_START,
  })
  callPost('/campaign/updateKeywordsState', {
    user: currentUserId,
    keywordsArr,
    state,
    campaignType,
  }, token).then((response) => {
    dispatch({
      type: CHANGE_KEYWORD_STATE_SUCCEED,
      data: {
        response: response.data,
        campaignType,
        state,
      },
    })
    toast.show({
      title: 'Success',
      description: 'State was changed.',
    })
  })
}

export const getBidTargetData = ({ campaignId, adgroupId, campaignType, startDate, endDate, targetAcos, isProfitable }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_BID_TARGET_DATA_START,
  })
  callGet('/campaignDetail/getBidTargetData', token, {
    userId: currentUserId,
    campaignId,
    adgroupId,
    campaignType,
    startDate,
    endDate,
    targetAcos,
    isProfitable,
  }).then((response) => {
    dispatch({
      type: GET_BID_TARGET_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_BID_TARGET_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get targets.',
    })
  })
}

export const changeTarget = (targets, campaignType) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CHANGE_TARGET_START,
  })
  callPost(`/targeting/updateProductTargeting/`, {
    user: currentUserId,
    targets,
    campaignType,
  }, token).then((response) => {
    if (typeof response.data.statusCode !== 'undefined' && response.data.statusCode !== 200) {
      dispatch({
        type: CHANGE_TARGET_FAIL,
      })
      toast.show({
        title: 'Danger',
        description: response.data.text || 'Failed to update targets.',
      })
    } else {
      dispatch({
        type: CHANGE_TARGET_SUCCEED,
        data: {
          targets,
        },
      })
      toast.show({
        title: 'Success',
        description: 'Target was changed.',
      })
    }
  }).catch((error) => {
    dispatch({
      type: CHANGE_TARGET_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: error.response.data.text
        || error.response.data.message
        || 'Failed to update targets.',
    })
  })
}

export const getNegativeWordData = ({ campaignId, adgroupIds, campaignType, startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_NEGATIVE_WORD_DATA_START,
  })
  callGet('/campaignDetail/getNegativeWordData', token, {
    userId: currentUserId,
    campaignId,
    adgroupIds,
    campaignType,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_NEGATIVE_WORD_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_NEGATIVE_WORD_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get negative words.',
    })
  })
}

export const getNegativeTargetData = ({ campaignId, adgroupId, startDate, endDate, targetAcos }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_NEGATIVE_TARGET_DATA_START,
  })
  callGet('/campaignDetail/getNegativeTargetData', token, {
    userId: currentUserId,
    campaignId,
    adgroupId,
    startDate,
    endDate,
    targetAcos,
  }).then((response) => {
    dispatch({
      type: GET_NEGATIVE_TARGET_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_NEGATIVE_TARGET_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get negative targets.',
    })
  })
}

export const getPlacementData = ({ campaignId, startDate, endDate }) => (dispatch, getState) => {
  const {
    auth: { token },
    header: { currentUserId },
  } = getState()

  dispatch({
    type: GET_PLACEMENT_DATA_START,
  })

  callGet('/campaign/getCampaignPlacement', token, {
    userId: currentUserId,
    campaignId,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_PLACEMENT_DATA_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_PLACEMENT_DATA_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to retrieve placements',
    })
  })
}

export const updatePlacementBid = ({ campaign, newBid, placementType }) => (dispatch, getState) => {
  const {
    auth: { token },
    header: { currentUserId },
  } = getState()

  dispatch({
    type: UPDATE_PLACEMENT_BID_START,
  })

  callPost('/campaign/updateCampaignBidding', {
    user: currentUserId,
    campaign,
  }, token).then((response) => {
    if (response.status === 207) {
      const errorText = response.data.errorDetails && response.data.errorDetails.length > 0
        ? response.data.errorDetails[0].description
        : 'Failed to update bidding information.'
      toast.show({
        title: 'Danger',
        description: errorText,
      })
      dispatch({
        type: UPDATE_PLACEMENT_BID_FAIL,
      })
      return
    }

    dispatch({
      type: UPDATE_PLACEMENT_BID_SUCCEED,
      data: {
        response: response.data,
        campaign,
        placementType,
        newBid,
      },
    })
    // show notification
    toast.show({
      title: 'Success',
      description: 'Successfully updated the bidding information.',
    })
  }).catch(() => {
    dispatch({
      type: UPDATE_PLACEMENT_BID_FAIL,
    })

    toast.show({
      title: 'Danger',
      description: 'Failed to update bidding information.',
    })
  })
}
