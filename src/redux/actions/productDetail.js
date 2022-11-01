import { callGet, callPost } from '../../services/axios'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import {
  SET_KEYWORD_ACTIVE_TAB,
  LOAD_BELOW_MODEL_SUCCEED,
  LOAD_ABOVE_MODEL_SUCCEED,
  LOAD_ZERO_MODEL_SUCCEED,
  GET_ALL_TESTS_SUCCEED,
  ADD_NEW_TEST_START,
  ADD_NEW_TEST_SUCCEED,
  GET_CURRENT_TEST_SUCCEED,
  GET_CURRENT_TEST_START,
  FILTER_KEYWORDS_ORGANIC_START,
  FILTER_KEYWORDS_ORGANIC_SUCCEED,
  FILTER_KEYWORDS_TARGET_ACOS_START,
  FILTER_KEYWORDS_TARGET_ACOS_SUCCEED,
  FILTER_KEYWORDS_ZERO_IMPR_START,
  FILTER_KEYWORDS_ZERO_IMPR_SUCCEED,
  GET_TEST_STATS_START,
  GET_TEST_STATS_A_SUCCEED,
  GET_TEST_STATS_B_SUCCEED,
  SET_KEYWORD_DATE_RANGE,
  ENABLE_KEYWORD_RANK_TRACKING_START,
  ENABLE_KEYWORD_RANK_TRACKING_SUCCEED,
  DISABLE_KEYWORD_RANK_TRACKING_START,
  DISABLE_KEYWORD_RANK_TRACKING_SUCCEED,
  ENABLE_KEYWORD_RANK_TRACKING_BULK_START,
  ENABLE_KEYWORD_RANK_TRACKING_BULK_SUCCEED,
  DISABLE_KEYWORD_RANK_TRACKING_BULK_START,
  DISABLE_KEYWORD_RANK_TRACKING_BULK_SUCCEED
} from '../actionTypes/productDetail'

export const updateKeywordsState = ({value, keywordIds}) => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, productDetail: {targetAcosKeywords}, header:{currentUserId}} = getState()
  const keywordsToUpdate = keywordIds.map(d => ({state: targetAcosKeywords.filter(k=>k.keyword_id === d)[0].state, keywordId: d}))

  callPost(`/campaign/updateKeywordsState`, {state: value, token, user: currentUserId, keywordsArr: keywordsToUpdate}, token)
  .then((res) => {
    dispatch(filterTargetAcosKeywords({filter: [], id: curProduct['id'], sku: curProduct['sku']}))
    if (res['data']['statusCode'] === 207) {
      toast.show({
        title: 'Danger',
        description: 'Archived entity cannot be modified',
      })
    } else {
      toast.show({
        title: 'Success',
        description: 'Successfully updated keyword states',
      })
    }
  })
}

export const enableKeywordOrganicRankTrackingBulk = (keywordIds) => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, productDetail: {targetAcosKeywords}, header:{currentUserId}} = getState()
  const keywordsToUpdate = keywordIds.map(d => ({keyword_text: targetAcosKeywords.filter(k=>k.keyword_id === d)[0].keyword, asin: curProduct['asin'], user: currentUserId}))

  dispatch({
    type: ENABLE_KEYWORD_RANK_TRACKING_BULK_START
  })
  callGet(`/product/enableKeywordOrganicRankTrackingBulk`, token, {
    keywordsToUpdate: JSON.stringify(keywordsToUpdate)
  }).then(() => {
    dispatch({
      type: ENABLE_KEYWORD_RANK_TRACKING_BULK_SUCCEED
    })
    dispatch(filterOrganicKeywords())
    toast.show({
      title: 'Success',
      description: 'Successfully track organic rank for the selected keywords',
    })
  })
}
export const disableKeywordOrganicRankTrackingBulk = ({keywordIds}) => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, productDetail: {targetAcosKeywords}, header:{currentUserId}} = getState()
  const keywordsToUpdate = keywordIds.map(d => ({keyword_text: targetAcosKeywords.filter(k=>k.keyword_id === d)[0].keyword, asin: curProduct['asin'], user: currentUserId}))

  dispatch({
    type: DISABLE_KEYWORD_RANK_TRACKING_BULK_START
  })
  callGet(`/product/disableKeywordOrganicRankTrackingBulk`, token, {
    keywordsToUpdate: JSON.stringify(keywordsToUpdate)
  }).then(() => {
    dispatch({
      type: DISABLE_KEYWORD_RANK_TRACKING_BULK_SUCCEED
    })
    dispatch(filterOrganicKeywords())
  })
}

export const enableKeywordOrganicRankTracking = ({keyword}) => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, header:{currentUserId}} = getState()

  dispatch({
    type: ENABLE_KEYWORD_RANK_TRACKING_START
  })
  callGet(`/product/enableKeywordOrganicRankTracking`, token, {
    asin: curProduct['asin'],
    keyword,
    user_id: currentUserId
  }).then(() => {
    dispatch({
      type: ENABLE_KEYWORD_RANK_TRACKING_SUCCEED,
      keyword
    })
    dispatch(filterOrganicKeywords())
  })
}
export const disableKeywordOrganicRankTracking = ({keyword}) => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, header:{currentUserId}} = getState()

  dispatch({
    type: DISABLE_KEYWORD_RANK_TRACKING_START
  })
  callGet(`/product/disableKeywordOrganicRankTracking`, token, {
    asin: curProduct['asin'],
    keyword,
    user_id: currentUserId
  }).then(() => {
    dispatch({
      type: DISABLE_KEYWORD_RANK_TRACKING_SUCCEED,
      keyword
    })
    dispatch(filterOrganicKeywords())
  })
}

export const setActiveTabInKeyword = (tab) => {
  return {
    type: SET_KEYWORD_ACTIVE_TAB,
    tab
  }
}

export const setKeywordDateRange = (data) => {
  return {
    type: SET_KEYWORD_DATE_RANGE,
    data
  }
}

export const filterOrganicKeywords = () => (dispatch, getState) => {
  const {auth: { token }, product: {curProduct}, productDetail: { keywordStartDate, keywordEndDate }, header: { currentUserId }} = getState()
  dispatch(filterKeywordsOrganicStart())
  callGet(`/product/getKeywordsWithOrganicRanking`, token, {
    id: curProduct['id'],
    user: currentUserId,
    sku: curProduct['sku'],
    startDate: keywordStartDate,
    endDate: keywordEndDate
  }).then((response) => {
    dispatch(filterKeywordsOrganicSucceed(response['data']))
  })
}
export const filterKeywordsOrganicStart = () => {
  return { type: FILTER_KEYWORDS_ORGANIC_START }
}
export const filterKeywordsOrganicSucceed = (data) => {
  return { type: FILTER_KEYWORDS_ORGANIC_SUCCEED, data }
}
export const filterTargetAcosKeywords = (data) => (dispatch, getState) => {
  const {auth: { token }, productDetail: { keywordStartDate, keywordEndDate }, header: { currentUserId }} = getState()
  const {filter} = data

  let query = ''
  for (let i in filter) {
    if (filter[i] !== '' && i !== 'id') {
      query += '&'+i+'='+filter[i]
    }
  }

  dispatch(filterKeywordsTargetAcosStart())
  callGet(`/product/customQuery/?id=${data['id']}&user=${currentUserId}&sku=${data['sku']}&startDate=${keywordStartDate}&endDate=${keywordEndDate}${query}`, token).then((response) => {
    dispatch(filterKeywordsTargetAcosSucceed(response['data']))
  })
}
export const filterKeywordsTargetAcosStart = () => {
  return {
    type: FILTER_KEYWORDS_TARGET_ACOS_START
  }
}
export const filterKeywordsTargetAcosSucceed = (data) => {
  return {
    type: FILTER_KEYWORDS_TARGET_ACOS_SUCCEED, data
  }
}
export const filterKeywordWithZeroImpression = () => (dispatch, getState) => {
  const {auth: {token}, product: {curProduct}, productDetail: {keywordStartDate, keywordEndDate}, header: {currentUserId}} = getState()
  dispatch(filterKeywordWithZeroImpressionStart())
  callGet(`/product/getZeroImpressionKeywords`, token, {
    productId: curProduct['id'],
    user: currentUserId,
    matchType: curProduct['matchType'],
    startDate: keywordStartDate,
    endDate: keywordEndDate
  }).then((response) => {
    dispatch(filterKeywordWithZeroImpressionSucceed(response['data']))
  })
}
export const filterKeywordWithZeroImpressionStart = () => {
  return { type: FILTER_KEYWORDS_ZERO_IMPR_START }
}
export const filterKeywordWithZeroImpressionSucceed = (data) => {
  return { type: FILTER_KEYWORDS_ZERO_IMPR_SUCCEED, data }
}

export const addNewTest = (data) => (dispatch, getState) => {
  const query = `&after_backend1=${data['backendB1']}
              &after_backend2=${data['backendB2']}
              &after_backend3=${data['backendB3']}
              &after_backend4=${data['backendB4']}
              &after_backend5=${data['backendB5']}
              &after_bullet1=${data['bulletsB1']}
              &after_bullet2=${data['bulletsB2']}
              &after_bullet3=${data['bulletsB3']}
              &after_bullet4=${data['bulletsB4']}
              &after_bullet5=${data['bulletsB5']}
              &after_coupon=${data['couponB']}
              &after_discount=${data['discountB']}
              &after_price=${data['priceB']}
              &after_summary=${data['summaryB']}
              &after_title=${data['titleA']}
              &before_backend1=${data['backendA1']}
              &before_backend2=${data['backendA2']}
              &before_backend3=${data['backendA3']}
              &before_backend4=${data['backendA4']}
              &before_backend5=${data['backendA5']}
              &before_bullet1=${data['bulletsA1']}
              &before_bullet2=${data['bulletsA2']}
              &before_bullet3=${data['bulletsA3']}
              &before_bullet4=${data['bulletsA4']}
              &before_bullet5=${data['bulletsA5']}
              &before_coupon=${data['couponA']}
              &before_discount=${data['discountA']}
              &before_price=${data['priceA']}
              &before_summary=${data['summaryA']}
              &before_title=${data['titleA']}
              &before_timeframe=${data['timeFrame']}
              &name=${data['testName']}
              &sku=${data['sku']}`
  const { auth: { token } } = getState()
  dispatch(addNewTestStart())
  callGet(`/product/saveNewTest/?user=${data['userId']}${query}`, token).then(async (response) => {
    await dispatch(getAllTests(data['id'], data['userId']))
    await dispatch(addNewTestSucceed())
  })
}
export const addNewTestStart = () => {
  return { type: ADD_NEW_TEST_START }
}
export const addNewTestSucceed = () => {
  return { type: ADD_NEW_TEST_SUCCEED }
}

export const getTestStatsById = (id, userId, startDate, endDate, prevStartDate) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(getTestStatsStart())
  callGet(`/product/getTestStats/?id=${id}&user=${userId}&startDate=${startDate}&endDate=${endDate}`, token).then((response) => {
    dispatch(getTestStatsASucceed(response['data']))
  })
  callGet(`/product/getTestStats/?id=${id}&user=${userId}&startDate=${prevStartDate}&endDate=${startDate}`, token).then((response) => {
    dispatch(getTestStatsBSucceed(response['data']))
  })
}
export const getTestStatsStart = () => {
  return { type: GET_TEST_STATS_START,  }
}
export const getTestStatsASucceed = (data) => {
  return { type: GET_TEST_STATS_A_SUCCEED, data }
}
export const getTestStatsBSucceed = (data) => {
  return { type: GET_TEST_STATS_B_SUCCEED, data }
}


export const getTestById = (id, userId) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(getCurrentTestStart())
  callGet(`/product/getTestById/?id=${id}&user=${userId}`, token).then((response) => {
    dispatch(getCurrentTestSucceed(response['data']))
  })
}
export const getCurrentTestStart = () => {
  return { type: GET_CURRENT_TEST_START,  }
}
export const getCurrentTestSucceed = (data) => {
  return { type: GET_CURRENT_TEST_SUCCEED, data }
}

export const getAllTests = (id, userId) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  callGet(`/product/getAllTests/?id=${id}&user=${userId}`, token).then((response) => {
    dispatch(getAllTestsSucceed(response['data']))
  })
}
export const getAllTestsSucceed = (data) => {
  return { type: GET_ALL_TESTS_SUCCEED, data }
}

export const loadBelowModels = (userId) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  callGet(`/campaign/loadModels/?modelno=1&userId=${userId}`, token).then((response) => {
    dispatch(loadBelowModelSucceed(response['data']))
  })
}
export const loadAboveModels = (userId) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  callGet(`/campaign/loadModels/?modelno=2&userId=${userId}`, token).then((response) => {
    dispatch(loadAboveModelSucceed(response['data']))
  })
}
export const loadZeroModels = (userId) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  callGet(`/campaign/loadModels/?modelno=3&userId=${userId}`, token).then((response) => {
    dispatch(loadZeroModelSucceed(response['data']))
  })
}

export const loadBelowModelSucceed = (data) => {
  return { type: LOAD_BELOW_MODEL_SUCCEED, data }
}
export const loadAboveModelSucceed = (data) => {
  return { type: LOAD_ABOVE_MODEL_SUCCEED, data }
}
export const loadZeroModelSucceed = (data) => {
  return { type: LOAD_ZERO_MODEL_SUCCEED, data }
}