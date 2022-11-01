import moment from 'moment'
import {
  LOAD_BELOW_MODEL_SUCCEED,
  LOAD_ABOVE_MODEL_SUCCEED,
  LOAD_ZERO_MODEL_SUCCEED,
  SET_KEYWORD_ACTIVE_TAB,
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
  DISABLE_KEYWORD_RANK_TRACKING_SUCCEED
} from '../actionTypes/productDetail'

export const initialState = {
  activeKeywordTab: 'zero',
  belowFilterModels: [],
  aboveFilterModels: [],
  zeroFilterModels: [],
  tests: [],
  currentTest: {},
  isAddingNewTest: false,
  isLoadingTest: false,
  isFiltering: false,
  isUpdatingKeyword: false,
  organicKeywords: [],
  targetAcosKeywords: [],
  zeroImprKeywords: [],
  isLoadingTestStats: false,
  testStatsA: [],
  testStatsB: [],
  keywordStartDate: moment().startOf('day').subtract(29, 'day').format('YYYY-MM-DD'),
  keywordEndDate: moment().endOf('day').format('YYYY-MM-DD'),
}

const productDetail = (state = initialState, action) => {
  const { targetAcosKeywords, zeroImprKeywords } = state

  let tmpTargetAcosKeywords = JSON.parse(JSON.stringify(targetAcosKeywords))
  let tmpZeroImprKeywords = JSON.parse(JSON.stringify(zeroImprKeywords))
  let keyword = {}

  switch (action.type) {
    case ENABLE_KEYWORD_RANK_TRACKING_START:
      return {
        ...state,
        isUpdatingKeyword: true
      }
    case ENABLE_KEYWORD_RANK_TRACKING_SUCCEED:
      if (tmpTargetAcosKeywords.filter(data => data.keyword === action.keyword)[0]) {
        keyword = tmpTargetAcosKeywords.filter(data => data.keyword === action.keyword)[0]
        keyword['auto_organic_rank_checking'] = true
        return {
          ...state,
          targetAcosKeywords: tmpTargetAcosKeywords,
          isUpdatingKeyword: false
        }
      }
      if (tmpZeroImprKeywords.filter(data => data.keyword === action.keyword)[0]) {
        keyword = tmpZeroImprKeywords.filter(data => data.keyword === action.keyword)[0]
        keyword['auto_organic_rank_checking'] = true
        return {
          ...state,
          zeroImprKeywords: tmpZeroImprKeywords,
          isUpdatingKeyword: false
        }
      }
      break
    case DISABLE_KEYWORD_RANK_TRACKING_START:
      return {
        ...state,
        isUpdatingKeyword: true
      }
    case DISABLE_KEYWORD_RANK_TRACKING_SUCCEED:
      if (tmpTargetAcosKeywords.filter(data => data.keyword === action.keyword)[0]) {
        keyword = tmpTargetAcosKeywords.filter(data => data.keyword === action.keyword)[0]
        keyword['auto_organic_rank_checking'] = false
        return {
          ...state,
          targetAcosKeywords: tmpTargetAcosKeywords,
          isUpdatingKeyword: false
        }
      }
      if (tmpZeroImprKeywords.filter(data => data.keyword === action.keyword)[0]) {
        keyword = tmpZeroImprKeywords.filter(data => data.keyword === action.keyword)[0]
        keyword['auto_organic_rank_checking'] = false
        return {
          ...state,
          zeroImprKeywords: tmpZeroImprKeywords,
          isUpdatingKeyword: false
        }
      }
      break
    case SET_KEYWORD_DATE_RANGE:
      return {
        ...state,
        keywordStartDate: action.data.startDate,
        keywordEndDate: action.data.endDate
      }
    case FILTER_KEYWORDS_ORGANIC_START:
      return {
        ...state,
        isFiltering: true
      }
    case FILTER_KEYWORDS_ORGANIC_SUCCEED:
      return {
        ...state,
        isFiltering: false,
        organicKeywords: action.data
      }
    case FILTER_KEYWORDS_TARGET_ACOS_START:
      return {
        ...state,
        isFiltering: true
      }
    case FILTER_KEYWORDS_TARGET_ACOS_SUCCEED:
      return {
        ...state,
        isFiltering: false,
        targetAcosKeywords: action.data
      }
    case FILTER_KEYWORDS_ZERO_IMPR_START:
      return {
        ...state,
        isFiltering: true
      }
    case FILTER_KEYWORDS_ZERO_IMPR_SUCCEED:
      return {
        ...state,
        isFiltering: false,
        zeroImprKeywords: action.data
      }
    case SET_KEYWORD_ACTIVE_TAB:
      return {
        ...state,
        activeKeywordTab: action.tab
      }
    case LOAD_BELOW_MODEL_SUCCEED:
      return {
        ...state,
        belowFilterModels: action.data
      }
    case LOAD_ABOVE_MODEL_SUCCEED:
      return {
        ...state,
        aboveFilterModels: action.data
      }
    case LOAD_ZERO_MODEL_SUCCEED:
      return {
        ...state,
        zeroFilterModels: action.data
      }
    case GET_ALL_TESTS_SUCCEED:
      return {
        ...state,
        tests: action.data
      }
    case ADD_NEW_TEST_START:
      return {
        ...state,
        isAddingNewTest: true
      }
    case ADD_NEW_TEST_SUCCEED:
      return {
        ...state,
        isAddingNewTest: false
      }
    case GET_CURRENT_TEST_SUCCEED:
      return {
        ...state,
        isLoadingTest: false,
        currentTest: action.data[0]
      }
    case GET_CURRENT_TEST_START:
      return {
        ...state,
        isLoadingTest: true
      }
    case GET_TEST_STATS_A_SUCCEED:
      return {
        ...state,
        isLoadingTestStats: false,
        testStatsA: action.data[0]
      }
    case GET_TEST_STATS_B_SUCCEED:
      return {
        ...state,
        isLoadingTestStats: false,
        testStatsB: action.data[0]
      }
    case GET_TEST_STATS_START:
      return {
        ...state,
        isLoadingTestStats: true
      }
    default:
      return state
  }
}

export default productDetail