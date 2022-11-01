import axios from 'axios'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import { endpoint } from '../../config/api'
import { callGet, callPost } from '../../services/axios'
import { DISABLE_NOTIFICATION } from '../actionTypes/health'

import {
  GET_TOP_PRODUCTS_SUCCEED,
  GET_TOP_PRODUCTS_START,
  GET_SKUS_START,
  GET_SKUS_SUCCEED,
  GET_PRODUCT_SUCCEED,
  GET_PRODUCT_START,
  GET_PRODUCT_KPI_START,
  GET_PRODUCT_KPI_SUCCEED,
  GET_PRODUCT_CHART_DATA_START,
  GET_PRODUCT_CHART_DATA_SUCCEED,
  GET_ALL_PROUDCTS_START,
  GET_ALL_PROUDCTS_SUCCEED,
  GET_PRODUCTS_BY_KEYWORD_START,
  GET_PRODUCTS_BY_KEYWORD_SUCCEED,
  GET_ALL_SKUS_WITH_PROFIT_START,
  GET_ALL_SKUS_WITH_PROFIT_SUCCEED,
  UPDATE_BULK_COGS_START,
  UPDATE_BULK_COGS_SUCCESS,
  UPDATE_BULK_COGS_FAIL,
  UPDATE_PRODUCT_MARGIN_START,
  UPDATE_PRODUCT_MARGIN_SUCCESS,
  UPDATE_PRODUCT_COG_START,
  UPDATE_PRODUCT_COG_SUCCESS,
  SORT_PRODUCT_DATA,
  SET_DATE_RANGE,
  GET_PRODUCT_KEYWORDS_START,
  GET_PRODUCT_KEYWORDS_SUCCESS
} from '../actionTypes/product'

import { loadBelowModels, loadAboveModels, loadZeroModels, getAllTests, filterOrganicKeywords, filterKeywordWithZeroImpression, filterTargetAcosKeywords } from './productDetail'

export const getProductKeywords = ({id, sku}) => (dispatch, getState) => {
  const {auth: { token }, product: { startDate, endDate }, header: { currentUserId }} = getState()

  dispatch(getProductKeywordsStart())
  callGet(`/product/getKeywordsWithOrganicRanking`, token, {
    id,
    sku,
    startDate,
    endDate,
    user: currentUserId,
  }).then((response) => {
    dispatch(getProductKeywordsSuccess(response['data']))
  })
}
export const getProductKeywordsStart = () => {
  return { type: GET_PRODUCT_KEYWORDS_START }
}
export const getProductKeywordsSuccess = (data) => {
  return { type: GET_PRODUCT_KEYWORDS_SUCCESS, data }
}

export const updateProductCog = ({cog, product}) => (dispatch, getState) => {
  const { auth: { token } } = getState()
  dispatch(updateProductCogStart())

  callGet(`/product/updateMargins`, token, {
    ...product,
    cog
  }).then(() => {
    dispatch(updateProductCogSucceed({
      product,
      cog
    }))
  })
}
export const updateProductCogStart = () => {
  return { type: UPDATE_PRODUCT_COG_START }
}
export const updateProductCogSucceed = (data) => {
  return { type: UPDATE_PRODUCT_COG_SUCCESS, data }
}

export const setDateRange = ({ startDate, endDate }) => (dispatch) => {
  dispatch(loadAllProductsData({startDate, endDate}))
  dispatch(setDateRangeSucceed({startDate, endDate}))
}
export const setDateRangeSucceed = ({startDate, endDate}) => {
  return {
    type: SET_DATE_RANGE,
    data: { startDate, endDate }
  }
}

export const loadAllProductsData = ({ startDate, endDate }) => (dispatch) => {
  dispatch(getTopProducts({startDate, endDate}))
  dispatch(getAllSkusWithProfit({startDate, endDate}))
  dispatch(getAllProducts({startDate, endDate}))
}

export const disableNotification = () => {
  return { type: DISABLE_NOTIFICATION }
}

export const updateProductMargin = (cog) => (dispatch, getState) => {

  const { auth: { token }, product: { curProduct } } = getState()
  dispatch(updateProductMarginStart())

  callGet(`/product/updateMargins`, token, {
    ...curProduct,
    cog
  }).then(() => {
    dispatch(updateProductMarginSucceed(cog))
  })
}
export const updateProductMarginStart = () => {
  return { type: UPDATE_PRODUCT_MARGIN_START }
}
export const updateProductMarginSucceed = (data) => {
  return { type: UPDATE_PRODUCT_MARGIN_SUCCESS, data }
}

export const sortProductData = (data) => {
  return { type: SORT_PRODUCT_DATA, data }
}

export const getTopProducts = ({ startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()
  dispatch(getTopProductsStart())
  callGet(`/home/getSkuData/?startDate=${startDate}&endDate=${endDate}&user=${currentUserId}`, token).then((response) => {
    dispatch(getTopProductsSucceed(response['data']))
  })
}

export const getTopProductsSucceed = (data) => {
  return { type: GET_TOP_PRODUCTS_SUCCEED, data }
}
export const getTopProductsStart = () => {
  return { type: GET_TOP_PRODUCTS_START }
}

export const getAllSkusWithProfit = ({ startDate, endDate }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_ALL_SKUS_WITH_PROFIT_START,
  })

  callGet(`/product/getAllSkusWithProfit`, token, {
    page: 1,
    pageSize:1000,
    startDate,
    endDate,
    user: currentUserId
  }).then((response) => {
    dispatch({
      type: GET_ALL_SKUS_WITH_PROFIT_SUCCEED,
      data: response['data'],
    })
  })
}

export const getSkus = () => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch({
    type: GET_SKUS_START,
  })

  callGet(`/campaignCreator/getSkus/?userId=${currentUserId}`, token).then((response) => {
    dispatch({
      type: GET_SKUS_SUCCEED,
      data: response['data'],
    })
  })
}

export const getProductById = ({ id, startDate, endDate, sku }) => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  dispatch(getProductStart())
  callGet(`/product/getById/?endDate=${endDate}&startDate=${startDate}&user=${currentUserId}&id=${id}`, token).then((response) => {
    dispatch(getProductSucceed(response['data'][0]))
  })
  dispatch(getProductKpiDataStart())
  callGet(`/product/getKpiData/?endDate=${endDate}&startDate=${startDate}&user=${currentUserId}&id=${id}`, token).then((response) => {
    dispatch(getProductKpiDataSucceed(response['data'][0]))
  })
  dispatch(getProductChartDataStart())
  callGet(`/product/getChart/?id=${id}&startDate=${startDate}&endDate=${endDate}&user=${currentUserId}`, token).then((response) => {
    dispatch(getProductChartDataSucceed(response['data']))
  })

  dispatch(loadBelowModels(currentUserId))
  dispatch(loadAboveModels(currentUserId))
  dispatch(loadZeroModels(currentUserId))
  dispatch(getAllTests(id, currentUserId))
  dispatch(filterTargetAcosKeywords({
    id,
    sku,
    userId: currentUserId,
    startDate,
    endDate
  }))
  dispatch(filterKeywordWithZeroImpression({
    id,
    sku,
    userId: currentUserId,
    startDate,
    endDate
  }))
  dispatch(filterOrganicKeywords({
    id,
    sku,
    userId: currentUserId,
    startDate,
    endDate
  }))

}
export const getProductSucceed = (data) => {
  return { type: GET_PRODUCT_SUCCEED, data }
}
export const getProductStart = () => {
  return { type: GET_PRODUCT_START }
}
export const getProductKpiDataStart = (data) => {
  return { type: GET_PRODUCT_KPI_START, data }
}
export const getProductKpiDataSucceed = (data) => {
  return { type: GET_PRODUCT_KPI_SUCCEED, data }
}
export const getProductChartDataStart = (data) => {
  return { type: GET_PRODUCT_CHART_DATA_START, data }
}
export const getProductChartDataSucceed = (data) => {
  return { type: GET_PRODUCT_CHART_DATA_SUCCEED, data }
}
export const getAllProducts = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getAllProductsStart())
  axios.get(endpoint+'/campaign/getAllSkus/?user=238', {headers:{authorization: token}}).then(function (response) {
    dispatch(getAllProductsSucceed(response['data']))
  })
}
export const getAllProductsStart = () => {
  return { type: GET_ALL_PROUDCTS_START }
}
export const getAllProductsSucceed = (data) => {
  return { type: GET_ALL_PROUDCTS_SUCCEED, data }
}
export const getProductsByKeyword = (data) => (dispatch) => {
  const token = 'Bearer ' + data.token
  dispatch(getProductsByKeywordStart())
  axios.get(endpoint+'/product/searchSKUsByKeyword/?keyword='+data.keyword+'&user=238', {headers:{authorization: token}}).then(function (response) {
    dispatch(getProductsByKeywordSucceed(response['data']))
  })
}
export const getProductsByKeywordStart = () => {
  return { type: GET_PRODUCTS_BY_KEYWORD_START }
}
export const getProductsByKeywordSucceed = (data) => {
  return { type: GET_PRODUCTS_BY_KEYWORD_SUCCEED, data }
}
// upload bulk cogs for product table
export const updateBulkCogs = ({ skus }) => (dispatch, getState) => {
  const {
    auth: { token },
    header: { currentUserId },
  } = getState()

  dispatch({
    type: UPDATE_BULK_COGS_START,
  })

  callPost('/product/updateBulkCogs', {
    userId: currentUserId,
    skus,
  }, token).then((response) => {
    toast.show({
      title: 'Success',
      description: `${response.data.successfulSkusCount} skus have been changed!`,
    })
    if (response.data.invalidSkus && response.data.invalidSkus.length > 0) {
      const strInvalidSkus = response.data.invalidSkus.map(sku => sku.sku)
      toast.show({
        title: 'Warning',
        description: `${strInvalidSkus.join(', ')} are invalid!`,
      })
    }
    dispatch({
      type: UPDATE_BULK_COGS_SUCCESS,
      data: {
        successSkus: response.data.successSkus,
      }
    })
  }).catch(() => {
    toast.show({
      title: 'Warning',
      description: 'Failed to update the cogs!',
    })
    dispatch({
      type: UPDATE_BULK_COGS_FAIL,
    })
  })
}