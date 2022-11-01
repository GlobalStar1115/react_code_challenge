import axios from 'axios'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import { endpoint } from '../../config/api'
import { callGet, callPost } from '../../services/axios'
import {
  DISABLE_NOTIFICATION,
  GET_TOP_CAMPAIGNS_SUCCEED,
  GET_TOP_CAMPAIGNS_START,
  GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_START,
  GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_SUCCEED,
  GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_FAIL,
  CREATE_NEGATIVE_KEYWORDS_START,
  CREATE_NEGATIVE_KEYWORDS_SUCCEED,
  CREATE_NEGATIVE_KEYWORDS_FAIL,
  CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_START,
  CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_SUCCESS,
  CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_FAIL,
  GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_START,
  GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_SUCCEED,
  GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_FAIL,
  UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_START,
  UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_SUCCEED,
  UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_FAIL,
  GET_OPT_LIST_CAMPAIGNS_POPUP_START,
  GET_OPT_LIST_CAMPAIGNS_POPUP_SUCCEED,
  GET_OPT_ADGROUP_BY_CAMPAIGNID_START,
  GET_OPT_ADGROUP_BY_CAMPAIGNID_SUCCEED,
  GET_CAMPAIGN_OPT_SKUS_BULK_START,
  GET_CAMPAIGN_OPT_SKUS_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_KEYWORDS_BULK_START,
  GET_CAMPAIGN_OPT_KEYWORDS_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_START,
  GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_NEGATIVE_BULK_START,
  GET_CAMPAIGN_OPT_NEGATIVE_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_START,
  GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_START,
  GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_SUCCEED,
  GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_START,
  GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_SUCCEED,
  GET_ALL_CAMPAIGNS_START,
  GET_ALL_CAMPAIGNS_SUCCEED,
  GET_CAMPAIGN_EX_SEARCH_TERM_BULK_START,
  GET_CAMPAIGN_EX_SEARCH_TERM_BULK_SUCCEED,
  GET_CAMPAIGN_EX_MATCH_TYPE_BULK_START,
  GET_CAMPAIGN_EX_MATCH_TYPE_BULK_SUCCEED,
  GET_CAMPAIGNS_BY_KEYWORD_START,
  GET_CAMPAIGNS_BY_KEYWORD_SUCCEED,
  GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_START,
  GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_SUCCEED,
  GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_START,
  GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_SUCCEED,
  GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_START,
  GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_SUCCEED,
  GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_START,
  GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_SUCCEED,
  GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_START,
  GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_SUCCEED,
  UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_START,
  UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_START,
  UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_START,
  UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED,
  UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_START,
  UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_SUCCEED,
  CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_START,
  CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_SUCCEED,
  CREATE_OPT_NEGATIVE_KEYWORDS_START,
  CREATE_OPT_NEGATIVE_KEYWORDS_SUCCEED,
  CREATE_EX_BIDDABLE_KEYWORDS_START,
  CREATE_EX_BIDDABLE_KEYWORDS_SUCCEED,
  GET_CAMPAIGNS_WITH_HISTORY_START,
  GET_CAMPAIGNS_WITH_HISTORY_SUCCESS,
  GET_CAMPAIGNS_WITH_HISTORY_FAIL,
  UPDATE_CAMPAIGN_ACOS_START,
  UPDATE_CAMPAIGN_ACOS_SUCCEED,
  UPDATE_CAMPAIGN_DAILYBUDGET_START,
  UPDATE_CAMPAIGN_DAILYBUDGET_SUCCEED,
  UPDATE_CAMPAIGN_STATE_START,
  UPDATE_CAMPAIGN_STATE_SUCCEED,
  SET_DATE_RANGE,
  SORT_CAMPAIGN_DATA
} from '../actionTypes/campaign'

export const getTopCampaigns = ({ startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_TOP_CAMPAIGNS_START,
  })
  callGet('/home/getTopCampaigns', token, {
    user: currentUserId,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_TOP_CAMPAIGNS_SUCCEED,
      data: response.data,
    })
  })
}

// bulk editor
export const getOptListCampaignsPopupStart = () => {
  return { type: GET_OPT_LIST_CAMPAIGNS_POPUP_START }
}
export const getOptListCampaignsPopupSucceed = (data) => {
  return { type: GET_OPT_LIST_CAMPAIGNS_POPUP_SUCCEED, data }
}
export const getOptAdGroupByCampaignIdStart = () => {
  return { type: GET_OPT_ADGROUP_BY_CAMPAIGNID_START }
}
export const getOptAdGroupByCampaignIdSucceed = (data) => {
  return { type: GET_OPT_ADGROUP_BY_CAMPAIGNID_SUCCEED, data }
}
export const getCampaignOptSkusBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_SKUS_BULK_START }
}
export const getCampaignOptSkusBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_SKUS_BULK_SUCCEED, data }
}
export const getCampaignOptKeywordsBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_KEYWORDS_BULK_START }
}
export const getCampaignOptKeywordsBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_KEYWORDS_BULK_SUCCEED, data }
}
export const getCampaignOptSearchTermBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_START }
}
export const getCampaignOptSearchTermBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_SUCCEED, data }
}
export const getCampaignOptNegativeBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_NEGATIVE_BULK_START }
}
export const getCampaignOptNegativeBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_NEGATIVE_BULK_SUCCEED, data }
}
export const getCampaignOptAdvancedKeywordBulkStart = (data) => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_START, data }
}
export const getCampaignOptAdvancedKeywordBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_SUCCEED, data }
}
export const getCampaignOptAdvancedNegativeBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_START }
}
export const getCampaignOptAdvancedNegativeBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_SUCCEED, data }
}
export const getCampaignOptAdvancedWorstAdgBulkStart = () => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_START }
}
export const getCampaignOptAdvancedWorstAdgBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_SUCCEED, data }
}

export const getAllCampaignsStart = () => {
  return { type: GET_ALL_CAMPAIGNS_START }
}
export const getAllCampaignsSucceed = (data) => {
  return { type: GET_ALL_CAMPAIGNS_SUCCEED, data }
}
export const getCampaignExSearchTermBulkStart = () => {
  return { type: GET_CAMPAIGN_EX_SEARCH_TERM_BULK_START }
}
export const getCampaignExSearchTermBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_SEARCH_TERM_BULK_SUCCEED, data }
}
export const getCampaignExMatchTypeBulkStart = () => {
  return { type: GET_CAMPAIGN_EX_MATCH_TYPE_BULK_START }
}
export const getCampaignExMatchTypeBulkSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_MATCH_TYPE_BULK_SUCCEED, data }
}
export const getCampaignsByKeywordStart = () => {
  return { type: GET_CAMPAIGNS_BY_KEYWORD_START }
}
export const getCampaignsByKeywordSucceed = (data) => {
  return { type: GET_CAMPAIGNS_BY_KEYWORD_SUCCEED, data }
}
export const getCampaignExFindKeywordsStart = () => {
  return { type: GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_START }
}
export const getCampaignExFindKeywordsSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_SUCCEED, data }
}
export const getCampaignExFindDuplicateKeywordsStart = () => {
  return { type: GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_START }
}
export const getCampaignExFindDuplicateKeywordsSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_SUCCEED, data }
}
export const getAdgroupAndNumberOfKeywordsStart = () => {
  return { type: GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_START }
}
export const getAdgroupAndNumberOfKeywordsSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_SUCCEED, data }
}
export const getCampaignsByIdsStart = () => {
  return { type: GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_START }
}
export const getCampaignsByIdsSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_SUCCEED, data }
}
export const getCampaignExKeywordByCampaignAndAdgroupStart = () => {
  return { type: GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_START }
}
export const getCampaignExKeywordByCampaignAndAdgroupSucceed = (data) => {
  return { type: GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_SUCCEED, data }
}
export const updateCampaignOptSkuAdListStateStart = () => {
  return { type: UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_START }
}
export const updateCampaignOptSkuAdListStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_SUCCEED, data }
}
export const updateCampaignOptKeywordListStateStart = () => {
  return { type: UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_START }
}
export const updateCampaignOptKeywordListStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_SUCCEED, data }
}
export const updateCampaignOptAdvancedKeywordListStateStart = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_START, data }
}
export const updateCampaignOptAdvancedKeywordListStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_SUCCEED, data }
}

export const updateCampaignOptAdvancedAdNegativeKeywordListStateStart = () => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_START }
}
export const updateCampaignOptAdvancedAdNegativeKeywordListStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED, data }
}
export const updateCampaignOptAdvancedCampaignNegativeKeywordListStateStart = () => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_START }
}
export const updateCampaignOptAdvancedCampaignNegativeKeywordListStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED, data }
}

export const updateCampaignOptAdvancedWorstAdgStateStart = () => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_START }
}
export const updateCampaignOptAdvancedWorstAdgStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_SUCCEED, data }
}
export const createOptCampaignNegativeKeywordsStart = () => {
  return { type: CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_START }
}
export const createOptCampaignNegativeKeywordsSucceed = (data) => {
  return { type: CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_SUCCEED, data }
}

export const sortCampaignData = (data) => {
  return { type: SORT_CAMPAIGN_DATA, data }
}

// campaign detail page: keyword cleander
// get all keywords
export const getCampaignDashboardKeywordCleanerKeywords = ({ user, startDate, endDate, campaignId }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(
    getCampaignDashboardKeywordCleanerKeywordsStart()
  )
  callGet(`/campaign/listKeywordsSyncAMZ/?user=${user}&campaignId=${campaignId}&startDate=${startDate}&endDate=${endDate}`, token).then((response) => {
    dispatch(
      getCampaignDashboardKeywordCleanerKeywordsSucceed(response['data'])
    )
  }).catch((error) => {
    dispatch(
      getCampaignDashboardKeywordCleanerKeywordsFail(error)
    )
  })
}
export const getCampaignDashboardKeywordCleanerKeywordsStart = () => {
  return { type: GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_START }
}
export const getCampaignDashboardKeywordCleanerKeywordsSucceed = (data) => {
  return { type: GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_SUCCEED, data }
}
export const getCampaignDashboardKeywordCleanerKeywordsFail = (data) => {
  return { type: GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_FAIL, data }
}
// Create negative keywords - campaign level
export const createNegativeKeywords = (campaignType, campaignNegativeKeywords, adgroupId) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CREATE_NEGATIVE_KEYWORDS_START,
  })

  return callPost('/campaign/createCampaignNegativeKeywords/', {
    user: currentUserId,
    campaignType,
    campaignNegativeKeywords,
    adgroupId,
  }, token).then((response) => {
    if (response.status === 207) {
      const errorText = response.data.text ? response.data.text : 'Failed to add negatives to campaign.'
      toast.show({
        title: 'Warning',
        description: errorText,
      })
      dispatch({
        type: CREATE_NEGATIVE_KEYWORDS_FAIL,
      })
      return
    }
    toast.show({
      title: 'Success',
      description: 'Negative Search Term was saved.',
    })

    dispatch({
      type: CREATE_NEGATIVE_KEYWORDS_SUCCEED,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: CREATE_NEGATIVE_KEYWORDS_FAIL,
    })
    toast.show({
      title: 'Warning',
      description: 'Failed to add negatives to campaign.',
    })
  })
}
// Create negative keywords - ad group level
export const createAdgroupNegativeKeywords = (negativeKeywords) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_START,
  })

  return callPost('/campaign/createNegativeKeywords/', {
    user: currentUserId,
    negativeKeywords,
  }, token).then((response) => {
    if (response.data.status === 207) {
      const errorText = response.data.text ? response.data.text : 'Failed to Add Negative to Ad Group'
      toast.show({
        title: 'Warning',
        description: errorText,
      })
      dispatch({
        type: CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_FAIL,
        data: errorText,
      })
      return
    }
    toast.show({
      title: 'Success',
      description: 'Negative Search Term was saved!',
    })

    dispatch({
      type: CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_SUCCESS,
      data: response['data'],
    })
  }).catch((error) => {
    dispatch({
      type: CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_FAIL,
      data: error,
    })
  })
}
// show related terms: withoutSales, nonProfit, lowCtr
export const getCampaignDashbaordKeywordsCleanerRelatedTerms = ({ user, campaignId, keyword, matchType, acosProfitZone, startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch({
    type: GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_START,
  })
  callGet(`/campaign/getRelatedUnprofitableTerms/?user=${user}&campaignId=${campaignId}&keyword=${keyword}&matchType=${matchType}&acosProfitZone=${acosProfitZone}&startDate=${startDate}&endDate=${endDate}`, token).then((response) => {
    dispatch({
      type: GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_SUCCEED,
      data: response.data,
    })
  }).catch((error) => {
    dispatch({
      type: GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_FAIL,
      data: error,
    })
  })
}

// update keyword state
export const updateCampaignDashboardKeywordCleanerKeywordState = ({ user, keywordsArr, state }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(
    updateCampaignDashboardKeywordCleanerKeywordStateStart()
  )
  callPost(`/campaign/updateKeywordsState/`, {
    user,
    keywordsArr,
    state,
  }, token)
  .then((response) => {
    dispatch(
      updateCampaignDashboardKeywordCleanerKeywordStateSucceed({
        response: response['data'],
        state,
      })
    )
  })
  .catch((error) => {
    dispatch(
      updateCampaignDashboardKeywordCleanerKeywordStateFail(error)
    )
  })
}
export const updateCampaignDashboardKeywordCleanerKeywordStateStart = () => {
  return { type: UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_START }
}
export const updateCampaignDashboardKeywordCleanerKeywordStateSucceed = (data) => {
  return { type: UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_SUCCEED, data }
}
export const updateCampaignDashboardKeywordCleanerKeywordStateFail = (data) => {
  return { type: UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_FAIL, data }
}

// Bulk Editor page Skus Campaigns List
export const getOptListCampaignsPopup = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getOptListCampaignsPopupStart())
  axios.get(endpoint + '/campaign/listCampaignsPopup/?user=238', { headers: { authorization: token } }).then(res => {
    dispatch(getOptListCampaignsPopupSucceed(res['data']))
  })
}

export const getOptAdGroupByCampaignId = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getOptAdGroupByCampaignIdStart())
  axios.post(endpoint + '/campaign/getAdGroupByCampaignId/', data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getOptAdGroupByCampaignIdSucceed(response['data']))
  })
}

export const getCampaignOptSkusBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptSkusBulkStart())
  axios.post(endpoint + '/campaign/getSkusBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptSkusBulkSucceed(response['data']))
  })
}

export const getCampaignOptKeywordsBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptKeywordsBulkStart())
  axios.post(endpoint + '/campaign/listKeywordsBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptKeywordsBulkSucceed(response['data']))
  })
}
export const getCampaignOptSearchTermBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptSearchTermBulkStart())
  axios.post(endpoint + '/campaign/listSearchTermBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptSearchTermBulkSucceed(response['data']))
  })
}

export const getCampaignOptNegativeBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptNegativeBulkStart())
  axios.post(endpoint + '/campaign/getNegativeWordBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptNegativeBulkSucceed(response['data']))
  })
}
// Get Keywords/Targets for Advanced Bulk
export const getCampaignOptAdvancedKeywordBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptAdvancedKeywordBulkStart({ filter: data.adgroupData.filterOption }))
  axios.post(endpoint + '/campaign/listKeywordsAdvancedBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptAdvancedKeywordBulkSucceed({ response: response['data'], filter: data.adgroupData.filterOption }))
  })
}
// Get All Negatives for Advanced Bulk
export const getCampaignOptAdvancedNegativeBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptAdvancedNegativeBulkStart())
  axios.post(endpoint + '/campaign/reviewAllNegativeKeywordAdvancedBulk/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptAdvancedNegativeBulkSucceed(response['data']))
  })
}
// Get Worst Performing Ad Group Data for Advanced Bulk
export const getCampaignOptAdvancedWorstAdgBulk = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignOptAdvancedWorstAdgBulkStart())
  axios.post(endpoint + '/campaign/getAdGroupByCampaignId/', data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignOptAdvancedWorstAdgBulkSucceed(response['data']))
  })
}

// Get All Camapaign
export const getAllCampaigns = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getAllCampaignsStart())
  axios.post(endpoint + '/campaign/getAllCampaigns/', data.skuData, { headers: { authorization: token } }).then((response) => {
    dispatch(getAllCampaignsSucceed(response['data']))
  })
}

// Get remove keywords
export const getCampaignExSearchTermRemoveKeywords = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignExSearchTermBulkStart())
  axios.post(endpoint + '/campaign/removeKeywords/', data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignExSearchTermBulkSucceed(response['data']))
  })
}

// Get keywords by acos
export const getCampaignExSearchTermSearchbyACoSmult = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignExSearchTermBulkStart())
  axios.post(endpoint + '/campaign/searchbyACoSmult/', data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignExSearchTermBulkSucceed(response['data']))
  })
}

// Get keywords by acos mult1
export const getCampaignExMatchTypeSearchbyACoSmult = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignExMatchTypeBulkStart())
  axios.post(endpoint + '/campaign/searchbyACoSmult1/', data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignExMatchTypeBulkSucceed(response['data']))
  })
}

// Get campaigns by keyword
export const getCampaignsByKeyword = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignsByKeywordStart())
  axios.get(endpoint + '/campaign/searchCampaignsByKeyword/?keyword=' + data.keyword + '&user=238', { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignsByKeywordSucceed(response['data']))
  })
}

// Get Find Keywords
export const getCampaignExFindKeywords = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignExFindKeywordsStart())
  axios.get(endpoint + '/campaign/findKeywords/?' + data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignExFindKeywordsSucceed(response['data']))
  })
}
// Get Dupliate Keywords
export const getCampaignExFindDuplicateKeywords = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getCampaignExFindDuplicateKeywordsStart())
  axios.post(endpoint + '/campaign/searchByDup/', data.campaignData, { headers: { authorization: token } }).then((response) => {
    dispatch(getCampaignExFindDuplicateKeywordsSucceed(response['data']))
  })
}

// Get Adgroup of add to existing campaign
export const getAdgroupAndNumberOfKeywords = ({ userId, campaignId }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(getAdgroupAndNumberOfKeywordsStart())

  callGet(`/campaign/getAdgroupAndNumberOfKeywords/?user=${userId}&campaignId=${campaignId}`, token).then((response) => {
    dispatch(getAdgroupAndNumberOfKeywordsSucceed(response['data']))
  })
}

export const getCampaignsByIds = ({ userId, campaignIds }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(getCampaignsByIdsStart())

  callGet(`/campaign/getCampaignsByIds/?user=${userId}&${campaignIds}`, token).then((response) => {
    dispatch(getCampaignsByIdsSucceed(response['data']))
  })
}

export const getCampaignExKeywordByCampaignAndAdgroup = ({ userId, campaignId, adgroupId }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(getCampaignExKeywordByCampaignAndAdgroupStart())
  callGet(`/campaign/getKeywordByCampaignAndAdgroup/?user=${userId}&campaignId=${campaignId}&adgroupId=${adgroupId}`, token).then((response) => {
    dispatch(getCampaignExKeywordByCampaignAndAdgroupSucceed(response['data']))
  })
}
// Update Sku State in bulk page
export const updateCampaignOptSkuAdListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  const state = data.state
  dispatch(updateCampaignOptSkuAdListStateStart())
  axios.get(endpoint + '/campaign/updateProductAdListState/?' + data.adgroupData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptSkuAdListStateSucceed({ response: response.data, state }))
  })
}

// Update Keyword State in bulk page
export const updateCampaignOptKeywordListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(updateCampaignOptKeywordListStateStart())
  axios.post(endpoint + '/campaign/updateKeywordsState/', data.keywordData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptKeywordListStateSucceed({ response: response.data, state: data.keywordData.state, campaignType: data.keywordData.campaignType }))
  })
}

// Update Keyword Bid in bulk page
export const updateCampaignOptKeywordListBid = (data) => (dispatch, getState) => {
  const { campaignDetail: { currentAcos } } = getState()

  const token = 'Bearer ' + data.token
  dispatch({
    type: UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_START,
  })
  axios.get(endpoint + '/campaign/updateBiddableKeywordsList/?' + data.keywordData, { headers: { authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_SUCCEED,
      data: {
        response: response.data,
        campaignType: data.campaignType,
        type: data.type,
        adjustType: data.adjustType ? data.adjustType : null,
        newAdjustBid: data.newAdjustBid ? data.newAdjustBid : null,
        currentAcos,
      },
    })
  })
}

// Update Advanced Keyword State in bulk page
export const updateCampaignOptAdvancedKeywordListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(updateCampaignOptAdvancedKeywordListStateStart({ filter: data.filter }))
  axios.post(endpoint + '/campaign/updateKeywordsState/', data.keywordData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptAdvancedKeywordListStateSucceed({ response: response.data, filter: data.filter, state: data.keywordData.state, campaignType: data.keywordData.campaignType }))
  })
}

// Update Advanced Keyword Bid in bulk page
export const updateCampaignOptAdvancedKeywordListBid = (data) => (dispatch, getState) => {
  const { campaignDetail: { currentAcos } } = getState()

  const token = 'Bearer ' + data.token
  dispatch({
    type: UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_START,
    data: {
      filter: data.filter,
    },
  })
  axios.get(endpoint + '/campaign/updateBiddableKeywordsList/?' + data.keywordData, { headers: { authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_SUCCEED,
      data: {
        response: response.data,
        campaignType: data.campaignType,
        filter: data.filter,
        type: data.type,
        adjustType: data.adjustType ? data.adjustType : null,
        newAdjustBid: data.newAdjustBid ? data.newAdjustBid : null,
        currentAcos,
      },
    })
  })
}

// Update Advanced Adgroup Negative Keywords State in bulk page
export const updateCampaignOptAdvancedAdNegativeKeywordListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(updateCampaignOptAdvancedAdNegativeKeywordListStateStart())
  axios.get(endpoint + '/campaign/updateNegativeKeywords/?' + data.negativeData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptAdvancedAdNegativeKeywordListStateSucceed({ response: response.data, state: data.state }))
  })
}

// Update Advanced Campaign Negative Keywords State in bulk page
export const updateCampaignOptAdvancedCampaignNegativeKeywordListState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(updateCampaignOptAdvancedCampaignNegativeKeywordListStateStart())
  axios.get(endpoint + '/campaign/updateCampaignNegativeKeywords/?' + data.negativeData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptAdvancedCampaignNegativeKeywordListStateSucceed({ response: response.data, selectedKeywords: data.selectedKeywords, state: data.state }))
  })
}

// Update Advanced Worst Adg State
export const updateCampaignOptAdvancedWorstAdgState = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(updateCampaignOptAdvancedWorstAdgStateStart())
  axios.get(endpoint + '/campaign/updateAdGroups/?' + data.adgData, { headers: { authorization: token } }).then((response) => {
    dispatch(updateCampaignOptAdvancedWorstAdgStateSucceed({ response: response['data'], state: data.state }))
  })
}

// Create Campaign Negative Keywords
export const createOptCampaignNegativeKeywords = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(createOptCampaignNegativeKeywordsStart())
  axios.post(endpoint + '/campaign/createCampaignNegativeKeywords/', data.negativeData, { headers: { authorization: token } }).then((response) => {
    dispatch(createOptCampaignNegativeKeywordsSucceed(response['data']))
  })
}

// Create Negative Keywords
export const createOptNegativeKeywords = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch({
    type: CREATE_OPT_NEGATIVE_KEYWORDS_START,
  })
  axios.post(endpoint + '/campaign/createNegativeKeywords/', data.negativeData, { headers: { authorization: token } }).then((response) => {
    dispatch({
      type: CREATE_OPT_NEGATIVE_KEYWORDS_SUCCEED,
      data: response.data,
    })
  })
}

export const createExBiddableKeywords = ({ userId, keywords }) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch({
    type: CREATE_EX_BIDDABLE_KEYWORDS_START,
  })
  callPost('/campaign/createBiddableKeywords/', {
    userId,
    keywords,
  }, token).then((response) => {
    dispatch({
      type: CREATE_EX_BIDDABLE_KEYWORDS_SUCCEED,
      data: response.data,
    })
  })
}

// Retrieve campaigns with history.
export const getCampaignsWithHistory = ({ startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch({
    type: GET_CAMPAIGNS_WITH_HISTORY_START,
  })
  callGet('/campaign/listCampaignsWithHistory', token, {
    userId: currentUserId,
    startDate,
    endDate,
  }).then((response) => {
    dispatch({
      type: GET_CAMPAIGNS_WITH_HISTORY_SUCCESS,
      data: response.data,
    })
  }).catch(() => {
    dispatch({
      type: GET_CAMPAIGNS_WITH_HISTORY_FAIL,
    })
    toast.show({
      title: 'Danger',
      description: 'Failed to get campaigns.',
    })
  })
}

export const updateCampaignAcos = (campaignId, campaignType, acos) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_CAMPAIGN_ACOS_START,
  })

  callGet('/campaign/updateAcos', token, {
    campaignId,
    campaignType,
    acos,
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_ACOS_SUCCEED,
      data: response.data,
    })
  })
}

export const updateCampaignsDailyBudget = (campaignId, campaignType, dailyBudget) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_CAMPAIGN_DAILYBUDGET_START,
  })

  callGet('/campaign/updateCampaignsDailyBudget', token, {
    campaignId,
    campaignType,
    dailyBudget,
    user: currentUserId,
  }).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_DAILYBUDGET_SUCCEED,
      data: response.data,
    })
  })
}

// Update campaign state.
export const updateCampaignsState = (campaignsArr, state) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: UPDATE_CAMPAIGN_STATE_START,
  })

  callPost('/campaign/updateCampaignsState', {
    user: currentUserId,
    campaignsArr,
    state,
  }, token).then((response) => {
    dispatch({
      type: UPDATE_CAMPAIGN_STATE_SUCCEED,
      data: response.data,
    })
  })
}

export const disableNotification = () => {
  return {
    type: DISABLE_NOTIFICATION
  }
}

export const setDateRange = ({ startDate, endDate }) => {
  return {
    type: SET_DATE_RANGE,
    data: {startDate, endDate}
  }
}
