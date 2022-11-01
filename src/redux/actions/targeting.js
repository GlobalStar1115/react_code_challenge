import axios from 'axios'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import { endpoint } from '../../config/api'
import { callGet, callPost } from '../../services/axios'
import {
  GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_START,
  GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_SUCCEED,
  GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_START,
  GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_SUCCEED,
  GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_START,
  GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_SUCCEED,
  GET_ALL_CATEGORIES_START,
  GET_ALL_CATEGORIES_SUCCEED,
  GET_ALL_CATEGORIES_FAILED,
  GET_PRODUCTS_BY_SEARCH_TEXT_START,
  GET_PRODUCTS_BY_SEARCH_TEXT_SUCCEED,
  GET_BRAND_RECOMMENDATION_START,
  GET_BRAND_RECOMMENDATION_SUCCEED,
  GET_REFINE_BRANDS_START,
  GET_REFINE_BRANDS_SUCCEED,
  GET_PRODUCTS_NEGATIVE_TARGETING_START,
  GET_PRODUCTS_NEGATIVE_TARGETING_SUCCEED,
  CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_START,
  CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_BID_SUCCEED,
  CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_START,
  CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_SUCCEED,
  CREATE_NEGATIVE_TARGETS_START,
  CREATE_NEGATIVE_TARGETS_SUCCEED,
  CREATE_NEGATIVE_TARGETS_FAIL,
  CREATE_ADGROUP_NEGATIVE_TARGETS_START,
  CREATE_ADGROUP_NEGATIVE_TARGETS_SUCCEED,
  CREATE_ADGROUP_NEGATIVE_TARGETS_FAIL,
} from '../actionTypes/targeting'

// Get Worst Performing Auto Targeting Data for Advanced Bulk
export const getCampaignOptAdvancedAutoTargetingBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_START,
  })
  axios.get(endpoint+'/targeting/getAutoTargetingByAdGroups/?' + data.adgroupData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_SUCCEED,
      data: response.data,
    })
  })
}

export const getCampaignExAsinsByTargetBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_START,
  })

  axios.post(endpoint+'/targeting/searchbyTargetmult/', data.targetData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_SUCCEED,
      data: response.data,
    })
  })
}
export const getCampaignExCategoriesByTargetBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_START,
  })

  axios.post(endpoint+'/targeting/searchbyTargetmult/', data.targetData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_SUCCEED, data: response.data,
    })
  })
}

export const getAllCategories = () => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_ALL_CATEGORIES_START,
  })
  callGet('/targeting/getCategories', token, {
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_ALL_CATEGORIES_SUCCEED,
      data: response.data,
    })
  }).catch((e) => {
    dispatch({
      type: GET_ALL_CATEGORIES_FAILED,
    })
  })
}

// Get products by search
export const getProductsBySearchText = (params, forAsins = false) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  if (!forAsins) {
    dispatch({
      type: GET_PRODUCTS_BY_SEARCH_TEXT_START,
    })
  }

  return callGet('/targeting/searchProduct', token, {
    ...params,
    user: currentUserId,
  }).then((response) => {
    if (!forAsins) {
      dispatch({
        type: GET_PRODUCTS_BY_SEARCH_TEXT_SUCCEED,
        data: response.data,
      })
    }
    return response.data
  })
}

// Get Brand Recommandations
export const getBrandRecommendations = (params, forRefine = false) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: !forRefine ? GET_BRAND_RECOMMENDATION_START : GET_REFINE_BRANDS_START,
  })
  callGet('/targeting/getBrandRecommendations', token, {
    ...params,
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: !forRefine ? GET_BRAND_RECOMMENDATION_SUCCEED : GET_REFINE_BRANDS_SUCCEED,
      data: response.data,
    })
  })
}
// Get Products for negative product targeting
export const getProductsNegativeTargeting = params => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_PRODUCTS_NEGATIVE_TARGETING_START,
  })
  callGet('/targeting/searchProduct', token, {
    ...params,
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_PRODUCTS_NEGATIVE_TARGETING_SUCCEED,
      data: response.data,
    })
  })
}

// Update Advanced Auto Targeting List State
export const updateCampaignOptAdvancedAutoTargetListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_START,
  })

  axios.post(endpoint+'/targeting/updateProductTargeting/', data.autoTargetData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_STATE_SUCCEED,
      data: {
        response: response['data'],
        state: data.state,
      },
    })
  })
}

// Update Advanced Auto Targeting List Bid
export const updateCampaignOptAdvancedAutoTargetListBid = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_START,
  })

  axios.post(endpoint+'/targeting/updateProductTargeting/', data.autoTargetData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_BID_SUCCEED,
      data: {
        response: response['data'],
        adjustType: data.adjustType ? data.adjustType : null,
        newAdjustBid: data.newAdjustBid ? data.newAdjustBid : null,
      },
    })
  })
}

// Create Campaign Negative Product Targets
export const createOptCampaignNegativeProductTargets = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_START,
  })
  axios.post(endpoint+'/targeting/createCampaignNegativeProductTargets/', data.negativeData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_SUCCEED,
      data: response.data,
    })
  })
}

// Create Campaign Negative Product Targets
export const createOptNegativeProductTargeting = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_START,
  })
  axios.post(endpoint+'/targeting/createNegativeProductTargeting/', data.negativeData, {headers:{authorization: token}}).then((response) => {
    dispatch({
      type: CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_SUCCEED, data: response.data,
    })
  })
}

export const createNegativeTargets = negatives => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: CREATE_NEGATIVE_TARGETS_START,
  })
  return callPost('/targeting/createCampaignNegativeProductTargets/', {
    user: currentUserId,
    negatives,
  }, token).then((response) => {
    if (response.data.statusCode !== 207) {
      toast.show({
        title: 'Success',
        description: 'Add negative ains to campaign level success.',
      })
    }
    dispatch({
      type: CREATE_NEGATIVE_TARGETS_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: CREATE_NEGATIVE_TARGETS_FAIL,
    })
    toast.show({
      title: 'Success',
      description: 'Failed to created negative product targets. Server error.',
    })
  })
}

export const createAdgroupNegativeTargets = negatives => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: CREATE_ADGROUP_NEGATIVE_TARGETS_START,
  })
  return callPost('/targeting/createNegativeProductTargeting/', {
    user: currentUserId,
    negatives,
  }, token).then((response) => {
    if (response.data.statusCode !== 207) {
      toast.show({
        title: 'Success',
        description: 'Add negative asins to adgoup success.',
      })
    }
    dispatch({
      type: CREATE_ADGROUP_NEGATIVE_TARGETS_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: CREATE_ADGROUP_NEGATIVE_TARGETS_FAIL,
    })
    toast.show({
      title: 'Success',
      description: 'Failed to created negative product targets.',
    })
  })
}
