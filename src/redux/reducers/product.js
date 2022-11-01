import moment from 'moment'
import {
  GET_TOP_PRODUCTS_SUCCEED,
  GET_TOP_PRODUCTS_START,
  GET_SKUS_SUCCEED,
  GET_SKUS_START,
  GET_PRODUCT_SUCCEED,
  GET_PRODUCT_FAILED,
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
  DISABLE_NOTIFICATION,
  SET_DATE_RANGE,
  GET_PRODUCT_KEYWORDS_START,
  GET_PRODUCT_KEYWORDS_SUCCESS
} from '../actionTypes/product.js'

export const initialState = {
  curProduct: {},
  curProductKpi: {},
  curProductChart: [],
  topProducts: [],
  skus: [],
  allProducts: [],
  allSkusWithProfit: [],
  productsByKeyword: [],
  isLoading: false,
  isProductLoading: false,
  isProductKpiLoading: false,
  isProductChartLoading: false,
  isAllProductLoading: false,
  isProductsByKeywordLoading: false,
  // true: highest->lowest, false: lowest->highest
  isUpdateBulkCogs: false,
  sortDirection: true,
  sortColumnName: 'orders',
  isUpdateProductCog: false,
  isUpdateProductCogSucceed: false,
  isUpdateProductMargin: false,
  isUpdateProductMarginSucceed: false,
  isLoadingProductKeywords: false,
  productKeywords: [],
  startDate: moment().subtract(6, 'month').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD')
}

const product = (state = initialState, action) => {
  const { sortDirection, sortColumnName, curProduct, allSkusWithProfit } = state

	switch (action.type) {
    case GET_PRODUCT_KEYWORDS_START:
      return {
        ...state,
        isLoadingProductKeywords: true,
        productKeywords: []
      }
    case GET_PRODUCT_KEYWORDS_SUCCESS:
      return {
        ...state,
        isLoadingProductKeywords: false,
        productKeywords: action.data
      }
    case SET_DATE_RANGE:
      return {
        ...state,
        startDate: action.data.startDate,
        endDate: action.data.endDate
      }
    case DISABLE_NOTIFICATION:
      return {
        ...state,
        isUpdateProductMarginSucceed: false,
        isUpdateProductCogSucceed: false
      }
    case UPDATE_PRODUCT_COG_START:
      return {
        ...state,
        isUpdateProductCog: true
      }
    case UPDATE_PRODUCT_COG_SUCCESS:
      const tmpAllSkusWithProfit = [...(allSkusWithProfit || [])]
      const product = tmpAllSkusWithProfit.filter(data => data.id === action.data.product.id)[0]
      product['cog'] = action.data.cog

      return {
        ...state,
        allSkusWithProfit: tmpAllSkusWithProfit,
        isUpdateProductCog: false,
        isUpdateProductCogSucceed: true
      }
    case UPDATE_PRODUCT_MARGIN_START:
      return {
        ...state,
        isUpdateProductMargin: true
      }
    case UPDATE_PRODUCT_MARGIN_SUCCESS:
      return {
        ...state,
        isUpdateProductMargin: false,
        isUpdateProductMarginSucceed: true,
        curProduct: {...curProduct, cog: action.data}
      }

    case SORT_PRODUCT_DATA:
      return {
        ...state,
        sortColumnName: action.data,
        sortDirection: (sortColumnName === action.data) ? !sortDirection : true
      }
    case GET_ALL_SKUS_WITH_PROFIT_START:
      return {
        ...state,
        isLoading: true
      }
    case GET_ALL_SKUS_WITH_PROFIT_SUCCEED:
      return {
        ...state,
        allSkusWithProfit: action.data['list'],
        isLoading: false
      }
    case GET_TOP_PRODUCTS_START:
      return {
        ...state,
        isLoading: true
      }
    case GET_TOP_PRODUCTS_SUCCEED:
      return {
        ...state,
        topProducts: action.data,
        isLoading: false
      }
    case GET_SKUS_START:
      return {
        ...state,
        isLoading: true
      }
    case GET_SKUS_SUCCEED:
      return {
        ...state,
        skus: action.data,
        isLoading: false
      }
    case GET_PRODUCT_SUCCEED:
      return {
        ...state,
        curProduct: action.data,
        isProductLoading: false,

      }
    case GET_PRODUCT_FAILED:
      return {
        ...state,
        isProductLoading: false
      }
    case GET_PRODUCT_START:
      return {
        ...state,
        isProductLoading: true
      }
    case GET_PRODUCT_KPI_START:
      return {
        ...state,
        isProductKpiLoading: true
      }
    case GET_PRODUCT_KPI_SUCCEED:
      return {
        ...state,
        isProductKpiLoading: false,
        curProductKpi: action.data
      }
    case GET_PRODUCT_CHART_DATA_START:
      return {
        ...state,
        isProductChartLoading: true
      }
    case GET_PRODUCT_CHART_DATA_SUCCEED:
      return {
        ...state,
        isProductChartLoading: false,
        curProductChart: action.data
      }
    case GET_ALL_PROUDCTS_START:
      return {
        ...state,
        isAllProductLoading: true
      }
    case GET_ALL_PROUDCTS_SUCCEED:
      return {
        ...state,
        isAllProductLoading: false,
        allProducts: action.data
      }
    case GET_PRODUCTS_BY_KEYWORD_START:
      return {
        ...state,
        isProductsByKeywordLoading: true
      }
    case GET_PRODUCTS_BY_KEYWORD_SUCCEED:
      return {
        ...state,
        isProductsByKeywordLoading: false,
        productsByKeyword: action.data
      }
    case UPDATE_BULK_COGS_START:
      return {
        ...state,
        isUpdateBulkCogs: true,
      }
    case UPDATE_BULK_COGS_SUCCESS:
      const tmpSkusWithProfit = [...state.allSkusWithProfit]
      const changedSkus = action.data.successSkus || []
      if (changedSkus && changedSkus.length === 0) {
        changedSkus.forEach(changedSku => {
          const index = tmpSkusWithProfit.findIndex(tmpSku => tmpSku.sku === changedSku.sku)
          if (index !== -1) {
            tmpSkusWithProfit[index].cog = changedSku.cog
          }
        })
      }
      return {
        ...state,
        isUpdateBulkCogs: false,
        allSkusWithProfit: tmpSkusWithProfit,
      }
    case UPDATE_BULK_COGS_FAIL:
      return {
        ...state,
        isUpdateBulkCogs: false,
      }
    default:
      return state
  }
}

export default product