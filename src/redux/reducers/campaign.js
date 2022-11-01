import moment from 'moment'
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
  CREATE_OPT_NEGATIVE_KEYWORDS_START,
  CREATE_OPT_NEGATIVE_KEYWORDS_SUCCEED,
  CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_START,
  CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_SUCCEED,
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
  SORT_CAMPAIGN_DATA,
} from '../actionTypes/campaign'

import {
  SAVE_AP_SUCCESS,
  SAVE_AP_TEMPLATE_SUCCESS,
  TURN_AP_BULK_SUCCESS,
  APPLY_TEMPLATE_BULK_SUCCESS,
} from '../actionTypes/ap'

import {
  formatValue
} from '../../services/helper.js'

export const initialState = {
  topCampaigns: [],
  allCampaigns: [],
  campaignsByKeyword: [],
  // campaign detail page: bid tab
  dashboardAllNewBidKeywords: {},
  // campaign detail page: keyword tab
  dashboardKeywordCleanerKeywords: [],
  dashboardKeywordCleanerRelatedTerms: {},
  // optimization
  optListCampaigns: {},
  // loading
  isLoading: false,
  isAllCampaignsLoading: false,
  isCampaignsByKeywordLoading: false,
  // campaign detail page: keyword tab
  isDashboardKeywordCleanerKeywordsLoading: false,
  isDashboardKeywordCleanerRelatedTermsLoading: false,
  isUpdatingDashboardKeywordCleanerKeywordState: false,
  isCreatingCampDashKeywordCleanerNegativeKeywords: false,
  isCreatingCampDashKeywordCleanerAdGroupNegativeKeywords: false,
  // bulk editor: optimization
  isOptListCampaignsLoading: false,
  isOptAdGroupsLoading: false,
  isOptSkusBulkLoading: false,
  isOptKeywordsBulkLoading: false,
  isOptSearchTermBulkLoading: false,
  isOptNegativeBulkLoading: false,
  isOptAdvancedKeywordsBulkLoading: false,
  isOptAdvancedMostKeywordsBulkLoading: false,
  isOptAdvancedZeroKeywordsBulkLoading: false,
  isOptAdvancedLowKeywordsBulkLoading: false,
  isOptAdvancedFindKeywordsBulkLoading: false,
  isOptAdvancedHighKeywordsBulkLoading: false,
  isOptAdvancedNegativesBulkLoading: false,
  isOptAdvancedWorstAdgsBulkLoading: false,
  // bulk editor: expansion
  isExSearchTermBulkLoading: false,
  isExMatchTypeBulkLoading: false,
  isExFindKeywordsBulkLoading: false,
  isExFindDuplicateKeywordsBulkLoading: false,
  isExAdgroupNumberKeywordsBulkLoading: false,
  isExCampaignsByIdsBulkLoading: false,
  isExKeywordsByCampaignIdAndAdgroupIdBulkLoading: false,
  // optimization update
  isUpdateOptSkuAdListBulk: false,
  isUpdateOptKeywordListStateBulk: false,
  isUpdateOptKeywordListBidBulk: false,
  isUpdateOptAdvancedAdNegativeKeywordListStateBulk: false,
  isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk: false,
  isUpdateOptAdvancedMostKeywordListStateBulk: false,
  isUpdateOptAdvancedZeroKeywordListStateBulk: false,
  isUpdateOptAdvancedLowKeywordListStateBulk: false,
  isUpdateOptAdvancedFindKeywordListStateBulk: false,
  isUpdateOptAdvancedHighKeywordListStateBulk: false,
  isUpdateOptAdvancedWorstAdgStateBulk: false,
  // optimization create
  isCreateOptNegativeKeywords: false,
  isCreateOptCampaignNegativeKeywords: false,
  isCreateExBiddableKeywords: false,
  // optimiation data
  optAdgroups: [],
  optSkusBulk: [],
  optKeywordsBulk: [],
  optSearchTermBulk: [],
  optNegativeBulk: [],
  optAdvancedKeywordsBulk: [],
  optAdvancedMostKeywordsBulk: [],
  optAdvancedZeroKeywordsBulk: [],
  optAdvancedLowKeywordsBulk: [],
  optAdvancedFindKeywordsBulk: [],
  opAdvancedHighKeywordsBulk: [],
  opAdvancedNegativesBulk: [],
  opAdvancedWorstAdgsBulk: [],
  // expansion
  exSearchTermBulk: [],
  exMatchTypeBulk: [],
  exFindKeywordsBulk: [],
  exFindDuplicateKeywordsBulk: [],
  exAdgroupAndNumberKeywordsBulk: [],
  exCampaignsByIdsBulk: [],
  exKeywordsByCampaignIdAndAdgroupIdBulk: [],

  campaignsWithHistory: [],
  updateDailyBudgetSuccess: false,
  updateCampaignAcosSuccess: false,
  isUpdateCampaignAcos: false,
  isUpdateCampaignDailyBudget: false,
  isUpdateCampaignState: false,
  // campaign detail: keyword tab
  // loading response
  loadDashboardKeywordCleanerKeywordsResponse: '',
  loadDashboardKeywordCleanerRelatedTermsResponse: '',
  // update response
  updateDashboardKeywordCleanerKeywordStateReponse: '',
  // create response
  createCampDashKeywordCleanerAdGroupNegativeKeywordsReponse: '',
  startDate: moment().subtract(29, 'day').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  // true: highest->lowest, false: lowest->highest
  sortDirection: true,
  sortColumnName: 'cost'
}

const campaign = (state = initialState, action) => {
  const { sortDirection, sortColumnName } = state

  let changedKeywordIds = []
  let newOptKeywordsBulk = []
  let changedAdgroudIds = []
  let newOptAdvancedAdGroupsBulk = []
  let changedNegativeKeywordIds = []
  let newOptAdvancedNegativesBulk = []

  switch (action.type) {
    case SORT_CAMPAIGN_DATA:
      return {
        ...state,
        sortColumnName: action.data,
        sortDirection: (sortColumnName === action.data) ? !sortDirection : true
      }
    case GET_TOP_CAMPAIGNS_START:
      return {
        ...state,
        isLoading: true,
      }
    case GET_TOP_CAMPAIGNS_SUCCEED:
      return {
        ...state,
        topCampaigns: action.data,
        isLoading: false,
      }
    // campaign detail page: keyword cleaner: get all keywrods
    case GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_START:
      return {
        ...state,
        isDashboardKeywordCleanerKeywordsLoading: true,
        loadDashboardKeywordCleanerKeywordsResponse: '',
      }
    case GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_SUCCEED:
      return {
        ...state,
        isDashboardKeywordCleanerKeywordsLoading: false,
        dashboardKeywordCleanerKeywords: action.data,
      }
    case GET_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORDS_FAIL:
      return {
        ...state,
        isDashboardKeywordCleanerKeywordsLoading: false,
        loadDashboardKeywordCleanerKeywordsResponse: action.data,
      }
    case CREATE_NEGATIVE_KEYWORDS_START:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerNegativeKeywords: true,
      }
    case CREATE_NEGATIVE_KEYWORDS_SUCCEED:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerNegativeKeywords: false,
      }
    case CREATE_NEGATIVE_KEYWORDS_FAIL:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerNegativeKeywords: false,
      }
    case CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_START:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerAdGroupNegativeKeywords: true,
        createCampDashKeywordCleanerAdGroupNegativeKeywordsReponse: '',
      }
    case CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_SUCCESS:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerAdGroupNegativeKeywords: false,
      }
    case CREATE_CAMP_DASH_KEYWORD_CLEANER_AD_GROUP_NEGATIVE_KEYWORDS_FAIL:
      return {
        ...state,
        isCreatingCampDashKeywordCleanerAdGroupNegativeKeywords: false,
        createCampDashKeywordCleanerAdGroupNegativeKeywordsReponse: action.data,
      }
    // campaign detail page: keyword cleaner: get related terms
    case GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_START:
      return {
        ...state,
        isDashboardKeywordCleanerRelatedTermsLoading: true,
        loadDashboardKeywordCleanerRelatedTermsResponse: '',
      }
    case GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_SUCCEED:
      return {
        ...state,
        isDashboardKeywordCleanerRelatedTermsLoading: false,
        dashboardKeywordCleanerRelatedTerms: action.data,
      }
    case GET_CAMPAIGN_DASHBOARD_KEYWORDS_CLEANER_RALATED_TERMS_FAIL:
      return {
        ...state,
        isDashboardKeywordCleanerRelatedTermsLoading: false,
        loadDashboardKeywordCleanerRelatedTermsResponse: action.data,
      }
    case UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_START:
      return {
        ...state,
        isUpdatingDashboardKeywordCleanerKeywordState: true,
        updateDashboardKeywordCleanerKeywordStateReponse: '',
      }
    case UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_SUCCEED:
      let tmpKeywordCleanerKeywordForState = state.dashboardKeywordCleanerKeywords ? state.dashboardKeywordCleanerKeywords : []

      changedKeywordIds = []
      if (!action.data.response.changeStateKeyword) {
        return {
          ...state,
          isUpdatingDashboardKeywordCleanerKeywordState: false,
          updateDashboardKeywordCleanerKeywordStateReponse: action.data.response.text
        }
      }
      if (!action.data.response.changeStateKeyword.updateAMZ) {
        return {
          ...state,
          isUpdatingDashboardKeywordCleanerKeywordState: false,
          updateDashboardKeywordCleanerKeywordStateReponse: action.data.response.text,
        }
      }

      changedKeywordIds = action.data.response.changeStateKeyword.updateAMZ
        .filter((res) => res.code === 'SUCCESS')
        .map((res) => res.keywordId.toString())

      if (tmpKeywordCleanerKeywordForState.length > 0) {
        tmpKeywordCleanerKeywordForState[0].forEach((keyword) => {
          if (changedKeywordIds.includes(keyword.keywordId.toString())) {
            keyword.state = action.data.state
          }
        })
        tmpKeywordCleanerKeywordForState[1].forEach((keyword) => {
          if (changedKeywordIds.includes(keyword.keywordId.toString())) {
            keyword.state = action.data.state
          }
        })
      }
      return {
        ...state,
        isUpdatingDashboardKeywordCleanerKeywordState: false,
        dashboardKeywordCleanerKeywords: tmpKeywordCleanerKeywordForState,
      }
    case UPDATE_CAMPAIGN_DASHBOARD_KEYWORD_CLEANER_KEYWORD_STATE_FAIL:
      return {
        ...state,
        isUpdatingDashboardKeywordCleanerKeywordState: false,
        updateDashboardKeywordCleanerKeywordStateReponse: 'Failed to update keyword state. Server error.'
      }
    case GET_OPT_LIST_CAMPAIGNS_POPUP_START:
      return {
        ...state,
        isOptListCampaignsLoading: true,
      }
    case GET_OPT_LIST_CAMPAIGNS_POPUP_SUCCEED:
      return {
        ...state,
        isOptListCampaignsLoading: false,
        optListCampaigns: action.data,
      }
    case GET_OPT_ADGROUP_BY_CAMPAIGNID_START:
      return {
        ...state,
        isOptAdGroupsLoading: true,
      }
    case GET_OPT_ADGROUP_BY_CAMPAIGNID_SUCCEED:
      return {
        ...state,
        isOptAdGroupsLoading: false,
        optAdgroups: action.data,
      }
    case GET_CAMPAIGN_OPT_SKUS_BULK_START:
      return {
        ...state,
        isOptSkusBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_SKUS_BULK_SUCCEED:
      return {
        ...state,
        isOptSkusBulkLoading: false,
        optSkusBulk: action.data,
      }
    case GET_CAMPAIGN_OPT_KEYWORDS_BULK_START:
      return {
        ...state,
        isOptKeywordsBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_KEYWORDS_BULK_SUCCEED:
      return {
        ...state,
        isOptKeywordsBulkLoading: false,
        optKeywordsBulk: action.data,
      }
    case GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_START:
      return {
        ...state,
        isOptSearchTermBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_SEARCH_TERM_BULK_SUCCEED:
      return {
        ...state,
        isOptSearchTermBulkLoading: false,
        optSearchTermBulk: action.data,
      }
    case GET_CAMPAIGN_OPT_NEGATIVE_BULK_START:
      return {
        ...state,
        isOptNegativeBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_NEGATIVE_BULK_SUCCEED:
      return {
        ...state,
        isOptNegativeBulkLoading: false,
        optNegativeBulk: action.data,
      }
    case GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_START:
      if (action.data.filter === 'FindMost') {
        return {
          ...state,
          isOptAdvancedMostKeywordsBulkLoading: true,
        }
      } else if (action.data.filter === 'FindZero') {
        return {
          ...state,
          isOptAdvancedZeroKeywordsBulkLoading: true,
        }
      } else if (action.data.filter === 'FindLow') {
        return {
          ...state,
          isOptAdvancedLowKeywordsBulkLoading: true,
        }
      } else if (action.data.filter === 'FindKeywords') {
        return {
          ...state,
          isOptAdvancedFindKeywordsBulkLoading: true,
        }
      } else if (action.data.filter === 'FindHigh') {
        return {
          ...state,
          isOptAdvancedHighKeywordsBulkLoading: true,
        }
      }
      break
    case GET_CAMPAIGN_OPT_ADVANCED_KEYWORD_BULK_SUCCEED:
      if (action.data.filter === 'FindMost') {
        return {
          ...state,
          isOptAdvancedMostKeywordsBulkLoading: false,
          optAdvancedMostKeywordsBulk: action.data.response,
        }
      } else if (action.data.filter === 'FindZero') {
        return {
          ...state,
          isOptAdvancedZeroKeywordsBulkLoading: false,
          optAdvancedZeroKeywordsBulk: action.data.response,
        }
      } else if (action.data.filter === 'FindLow') {
        return {
          ...state,
          isOptAdvancedLowKeywordsBulkLoading: false,
          optAdvancedLowKeywordsBulk: action.data.response,
        }
      } else if (action.data.filter === 'FindKeywords') {
        return {
          ...state,
          isOptAdvancedFindKeywordsBulkLoading: false,
          optAdvancedFindKeywordsBulk: action.data.response,
        }
      } else if (action.data.filter === 'FindHigh') {
        return {
          ...state,
          isOptAdvancedHighKeywordsBulkLoading: false,
          opAdvancedHighKeywordsBulk: action.data.response,
        }
      }
      break
    case GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_START:
      return {
        ...state,
        isOptAdvancedNegativesBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_ADVANCED_NEGATIVE_BULK_SUCCEED:
      return {
        ...state,
        isOptAdvancedNegativesBulkLoading: false,
        opAdvancedNegativesBulk: action.data,
      }
    case GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_START:
      return {
        ...state,
        isOptAdvancedWorstAdgsBulkLoading: true,
      }
    case GET_CAMPAIGN_OPT_ADVANCED_WORST_ADG_BULK_SUCCEED:
      return {
        ...state,
        isOptAdvancedWorstAdgsBulkLoading: false,
        opAdvancedWorstAdgsBulk: action.data,
      }

    case GET_ALL_CAMPAIGNS_START:
      return {
        ...state,
        isAllCampaignsLoading: true,
      }
    case GET_ALL_CAMPAIGNS_SUCCEED:
      return {
        ...state,
        isAllCampaignsLoading: false,
        allCampaigns: action.data,
      }
    case GET_CAMPAIGNS_BY_KEYWORD_START:
      return {
        ...state,
        isCampaignsByKeywordLoading: true,
      }
    case GET_CAMPAIGNS_BY_KEYWORD_SUCCEED:
      return {
        ...state,
        isCampaignsByKeywordLoading: false,
        campaignsByKeyword: action.data,
      }
    case GET_CAMPAIGN_EX_SEARCH_TERM_BULK_START:
      return {
        ...state,
        isExSearchTermBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_SEARCH_TERM_BULK_SUCCEED:
      return {
        ...state,
        isExSearchTermBulkLoading: false,
        exSearchTermBulk: action.data,
      }
    case GET_CAMPAIGN_EX_MATCH_TYPE_BULK_START:
      return {
        ...state,
        isExMatchTypeBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_MATCH_TYPE_BULK_SUCCEED:
      return {
        ...state,
        isExMatchTypeBulkLoading: false,
        exMatchTypeBulk: action.data,
      }
    case GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_START:
      return {
        ...state,
        isExFindKeywordsBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_FIND_KEYWORDS_BULK_SUCCEED:
      return {
        ...state,
        isExFindKeywordsBulkLoading: false,
        exFindKeywordsBulk: action.data,
      }
    case GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_START:
      return {
        ...state,
        isExFindDuplicateKeywordsBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_FIND_DUPLICATE_KEYWORDS_BULK_SUCCEED:
      return {
        ...state,
        isExFindDuplicateKeywordsBulkLoading: false,
        exFindDuplicateKeywordsBulk: action.data,
      }
    case GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_START:
      return {
        ...state,
        isExAdgroupNumberKeywordsBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_ADGROUP_NUMBER_KEYWORDS_SUCCEED:
      return {
        ...state,
        isExAdgroupNumberKeywordsBulkLoading: false,
        exAdgroupAndNumberKeywordsBulk: action.data,
      }
    case GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_START:
      return {
        ...state,
        isExCampaignsByIdsBulkLoading: true,
      }
    case GET_CAMPAIGN_EX_CAMPAIGNS_BY_IDS_SUCCEED:
      return {
        ...state,
        isExCampaignsByIdsBulkLoading: false,
        exCampaignsByIdsBulk: action.data,
      }
    case GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_START:
      return {
        ...state,
        isExKeywordsByCampaignIdAndAdgroupIdBulkLoading: true,
        exKeywordsByCampaignIdAndAdgroupIdBulk: [],
      }
    case GET_CAMPAIGN_EX_KEYWORDS_BY_CAMPAIGN_AND_ADGROUP_SUCCEED:
      return {
        ...state,
        isExKeywordsByCampaignIdAndAdgroupIdBulkLoading: false,
        exKeywordsByCampaignIdAndAdgroupIdBulk: action.data,
      }
    case UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_START:
      return {
        ...state,
        isUpdateOptSkuAdListBulk: true,
      }
    case UPDATE_CAMPAIGN_OPT_SKU_AD_LIST_STATE_SUCCEED:
      const changedAdIds = action.data.response
        .filter((res) => res.code === 'SUCCESS')
        .map((res) => res.adId.toString())
      const newOptSkusBulk = state.optSkusBulk.map((sku) =>
        changedAdIds.includes(sku.ad_id.toString())
          ? { ...sku, state: action.data.state }
          : sku
      )

      return {
        ...state,
        isUpdateOptSkuAdListBulk: false,
        optSkusBulk: newOptSkusBulk,
      }
    case UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_START:
      return {
        ...state,
        isUpdateOptKeywordListStateBulk: true,
      }
    case UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_STATE_SUCCEED:
      if (action.data.campaignType === 'Sponsored Displays') {
        newOptKeywordsBulk = state.optKeywordsBulk
        changedKeywordIds = []
        changedKeywordIds = action.data.response.changeStateTargeting.filter(res => res.code === 'SUCCESS').map(res => (res.targetId).toString())
        newOptKeywordsBulk = state.optKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((keyword.targetId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
      } else {
        newOptKeywordsBulk = state.optKeywordsBulk
        changedKeywordIds = []
        changedKeywordIds = action.data.response.changeStateKeyword.updateAMZ.filter(res => res.code === 'SUCCESS').map(res => (res.keywordId).toString())
        newOptKeywordsBulk = state.optKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
      }
      return {
        ...state,
        isUpdateOptKeywordListStateBulk: false,
        optKeywordsBulk: newOptKeywordsBulk
      }

    case UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_START:
      return {
        ...state,
        isUpdateOptKeywordListBidBulk: true,
      }

    case UPDATE_CAMPAIGN_OPT_KEYWORD_LIST_BID_SUCCEED:
      changedKeywordIds = action.data.response.filter(res => res.code === 'SUCCESS').map(res => (action.data.campaignType === 'Sponsored Displays' ? res.targetId : res.keywordId).toString())
      newOptKeywordsBulk = state.optKeywordsBulk

      if (action.data.type === 'adjustBid') {
        newOptKeywordsBulk = state.optKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            let newBid = formatValue(action.data.newAdjustBid, 'number', 2)

            if (action.data.adjustType === 'raiseBid')
              newBid = keyword.bid * (1 + parseFloat(action.data.newAdjustBid) / 100)
            else if (action.data.adjustType === 'lowerBid')
              newBid = keyword.bid * (1 - parseFloat(action.data.newAdjustBid) / 100)

            return { ...keyword, bid: formatValue(newBid, 'number', 2) }
          }
          return keyword
        })
      } else if (action.data.type === 'changeToNewBid') {
        newOptKeywordsBulk = state.optKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            return { ...keyword, bid: keyword.newbid ? keyword.newbid : 0 }
          }
          return keyword
        })
      } else if (action.data.type === 'changeToMaxBid') {
        newOptKeywordsBulk = state.optKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            return {
              ...keyword,
              bid: keyword.clickorderratio && parseInt(keyword.units, 10)
                ? formatValue(((keyword.revenue / parseInt(keyword.units, 10)) * (action.data.currentAcos / 100)) / keyword.clickorderratio, 'number', 2)
                : 0 }
          }
          return keyword
        })
      }

      return {
        ...state,
        isUpdateOptKeywordListBidBulk: false,
        optKeywordsBulk: newOptKeywordsBulk,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_START:
      if (action.data.filter === 'FindMost') {
        return {
          ...state,
          isUpdateOptAdvancedMostKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindZero') {
        return {
          ...state,
          isUpdateOptAdvancedZeroKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindLow') {
        return {
          ...state,
          isUpdateOptAdvancedLowKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindKeywords') {
        return {
          ...state,
          isUpdateOptAdvancedFindKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindHigh') {
        return {
          ...state,
          isUpdateOptAdvancedHighKeywordListStateBulk: true,
        }
      }
      break
    case UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_STATE_SUCCEED:
      if (action.data.campaignType === 'Sponsored Displays') {
        changedKeywordIds = action.data.response.changeStateTargeting.filter(res => res.code === 'SUCCESS').map(res => (res.targetId).toString())
      } else {
        changedKeywordIds = action.data.response.changeStateKeyword.updateAMZ.filter(res => res.code === 'SUCCESS').map(res => (res.keywordId).toString())
      }
      if (action.data.filter === 'FindMost') {
        newOptKeywordsBulk = state.optAdvancedMostKeywordsBulk
        newOptKeywordsBulk = state.optAdvancedMostKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
        return {
          ...state,
          isUpdateOptAdvancedMostKeywordListStateBulk: false,
          optAdvancedMostKeywordsBulk: newOptKeywordsBulk
        }
      } else if (action.data.filter === 'FindZero') {
        newOptKeywordsBulk = state.optAdvancedZeroKeywordsBulk
        newOptKeywordsBulk = state.optAdvancedZeroKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
        return {
          ...state,
          isUpdateOptAdvancedZeroKeywordListStateBulk: false,
          optAdvancedZeroKeywordsBulk: newOptKeywordsBulk
        }
      } else if (action.data.filter === 'FindLow') {
        newOptKeywordsBulk = state.optAdvancedLowKeywordsBulk
        newOptKeywordsBulk = state.optAdvancedLowKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
        return {
          ...state,
          isUpdateOptAdvancedLowKeywordListStateBulk: false,
          optAdvancedLowKeywordsBulk: newOptKeywordsBulk
        }
      } else if (action.data.filter === 'FindKeywords') {
        newOptKeywordsBulk = state.optAdvancedFindKeywordsBulk
        newOptKeywordsBulk = state.optAdvancedFindKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
        return {
          ...state,
          isUpdateOptAdvancedFindKeywordListStateBulk: false,
          optAdvancedFindKeywordsBulk: newOptKeywordsBulk
        }
      } else if (action.data.filter === 'FindHigh') {
        newOptKeywordsBulk = state.opAdvancedHighKeywordsBulk
        newOptKeywordsBulk = state.opAdvancedHighKeywordsBulk.map(keyword =>
          changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString()) ? { ...keyword, state: action.data.state } : keyword
        )
        return {
          ...state,
          isUpdateOptAdvancedHighKeywordListStateBulk: false,
          opAdvancedHighKeywordsBulk: newOptKeywordsBulk,
        }
      }
      break
    case UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_START:
      return {
        ...state,
        isUpdateOptAdvancedAdNegativeKeywordListStateBulk: true,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_AD_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED:
      changedNegativeKeywordIds = []
      changedNegativeKeywordIds = action.data.response.updateAMZ.filter(res => res.code === 'SUCCESS').map(res => (res.keywordId).toString())
      newOptAdvancedNegativesBulk = state.opAdvancedNegativesBulk.filter(negative =>
        !changedNegativeKeywordIds.includes((negative.keyword_id).toString())
      )
      return {
        ...state,
        isUpdateOptAdvancedAdNegativeKeywordListStateBulk: false,
        opAdvancedNegativesBulk: newOptAdvancedNegativesBulk,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_START:
      return {
        ...state,
        isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk: true,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_CAMPAIGN_NEGATIVE_KEYWORD_LIST_STATE_SUCCEED:
      changedNegativeKeywordIds = []
      changedNegativeKeywordIds = action.data.selectedKeywords.map(keyword => (keyword.keywordId).toString())
      newOptAdvancedNegativesBulk = state.opAdvancedNegativesBulk.filter(negative =>
        !changedNegativeKeywordIds.includes((negative.keyword_id).toString())
      )
      return {
        ...state,
        isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk: false,
        opAdvancedNegativesBulk: newOptAdvancedNegativesBulk,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_START:
      if (action.data.filter === 'FindMost') {
        return {
          ...state,
          isUpdateOptAdvancedMostKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindZero') {
        return {
          ...state,
          isUpdateOptAdvancedZeroKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindLow') {
        return {
          ...state,
          isUpdateOptAdvancedLowKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindKeywords') {
        return {
          ...state,
          isUpdateOptAdvancedFindKeywordListStateBulk: true,
        }
      } else if (action.data.filter === 'FindHigh') {
        return {
          ...state,
          isUpdateOptAdvancedHighKeywordListStateBulk: true,
        }
      }
      break
    case UPDATE_CAMPAIGN_OPT_ADVANCED_KEYWORD_LIST_BID_SUCCEED:
      if (action.data.campaignType === 'Sponsored Displays') {
        changedKeywordIds = action.data.response.filter(res => res.code === 'SUCCESS').map(res => (res.targetId).toString())
      } else {
        changedKeywordIds = action.data.response.filter(res => res.code === 'SUCCESS').map(res => (res.keywordId).toString())
      }
      newOptKeywordsBulk = state.optAdvancedMostKeywordsBulk
      if (action.data.filter === 'FindMost') {
        newOptKeywordsBulk = state.optAdvancedMostKeywordsBulk
      } else if (action.data.filter === 'FindZero') {
        newOptKeywordsBulk = state.optAdvancedZeroKeywordsBulk
      } else if (action.data.filter === 'FindLow') {
        newOptKeywordsBulk = state.optAdvancedLowKeywordsBulk
      } else if (action.data.filter === 'FindKeywords') {
        newOptKeywordsBulk = state.optAdvancedFindKeywordsBulk
      } else if (action.data.filter === 'FindHigh') {
        newOptKeywordsBulk = state.opAdvancedHighKeywordsBulk
      }
      if (action.data.type === 'adjustBid') {
        newOptKeywordsBulk = newOptKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            let newBid = formatValue(action.data.newAdjustBid, 'number', 2)

            if (action.data.adjustType === 'raiseBid')
              newBid = keyword.bid * (1 + parseFloat(action.data.newAdjustBid) / 100)
            else if (action.data.adjustType === 'lowerBid')
              newBid = keyword.bid * (1 - parseFloat(action.data.newAdjustBid) / 100)

            return { ...keyword, bid: formatValue(newBid, 'number', 2) }
          }
          return keyword
        })
      } else if (action.data.type === 'changeToNewBid') {
        newOptKeywordsBulk = newOptKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            return { ...keyword, bid: keyword.newbid ? keyword.newbid : 0 }
          }
          return keyword
        })
      } else if (action.data.type === 'changeToMaxBid') {
        newOptKeywordsBulk = newOptKeywordsBulk.map(keyword => {
          if (changedKeywordIds.includes((action.data.campaignType === 'Sponsored Displays' ? keyword.targetId : keyword.keywordId).toString())) {
            return {
              ...keyword,
              bid: keyword.clickorderratio && parseInt(keyword.units, 10)
                ? formatValue(((keyword.revenue / parseInt(keyword.units, 10)) * (action.data.currentAcos / 100)) / keyword.clickorderratio, 'number', 2)
                : 0,
            }
          }
          return keyword
        })
      }

      if (action.data.filter === 'FindMost') {
        return {
          ...state,
          isUpdateOptAdvancedMostKeywordListStateBulk: false,
          optAdvancedMostKeywordsBulk: newOptKeywordsBulk,
        }
      } else if (action.data.filter === 'FindZero') {
        return {
          ...state,
          isUpdateOptAdvancedZeroKeywordListStateBulk: false,
          optAdvancedZeroKeywordsBulk: newOptKeywordsBulk,
        }
      } else if (action.data.filter === 'FindLow') {
        return {
          ...state,
          isUpdateOptAdvancedLowKeywordListStateBulk: false,
          optAdvancedLowKeywordsBulk: newOptKeywordsBulk,
        }
      } else if (action.data.filter === 'FindKeywords') {
        return {
          ...state,
          isUpdateOptAdvancedFindKeywordListStateBulk: false,
          optAdvancedFindKeywordsBulk: newOptKeywordsBulk,
        }
      } else if (action.data.filter === 'FindHigh') {
        return {
          ...state,
          isUpdateOptAdvancedHighKeywordListStateBulk: false,
          opAdvancedHighKeywordsBulk: newOptKeywordsBulk,
        }
      }
      break

    case UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_START:
      return {
        ...state,
        isUpdateOptAdvancedWorstAdgStateBulk: true,
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_WORST_ADG_STATE_SUCCEED:
      changedAdgroudIds = []
      changedAdgroudIds = action.data.response[0].filter(res => res.code === 'SUCCESS').map(res => (res.adGroupId).toString())
      newOptAdvancedAdGroupsBulk = state.opAdvancedWorstAdgsBulk.map(worst_adg =>
        changedAdgroudIds.includes((worst_adg.adgroupid).toString()) ? { ...worst_adg, state: action.data.state } : worst_adg
      )
      return {
        ...state,
        isUpdateOptAdvancedWorstAdgStateBulk: false,
        opAdvancedWorstAdgsBulk: newOptAdvancedAdGroupsBulk
      }

    case CREATE_OPT_NEGATIVE_KEYWORDS_START:
      return {
        ...state,
        isCreateOptNegativeKeywords: true,
      }
    case CREATE_OPT_NEGATIVE_KEYWORDS_SUCCEED:
      return {
        ...state,
        isCreateOptNegativeKeywords: false,
      }
    case CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_START:
      return {
        ...state,
        isCreateOptCampaignNegativeKeywords: true,
      }
    case CREATE_OPT_CAMPAIGN_NEGATIVE_KEYWORDS_SUCCEED:
      return {
        ...state,
        isCreateOptCampaignNegativeKeywords: false,
      }
    case CREATE_EX_BIDDABLE_KEYWORDS_START:
      return {
        ...state,
        isCreateExBiddableKeywords: true,
      }
    case CREATE_EX_BIDDABLE_KEYWORDS_SUCCEED:
      return {
        ...state,
        isCreateExBiddableKeywords: false,
      }
    case GET_CAMPAIGNS_WITH_HISTORY_START:
      return {
        ...state,
        isLoading: true,
        campaignsWithHistory: [],
      }
    case GET_CAMPAIGNS_WITH_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        campaignsWithHistory: action.data.sort((a, b) => (a.cost < b.cost) ? 1 : -1),
      }
    case GET_CAMPAIGNS_WITH_HISTORY_FAIL:
      return {
        ...state,
        isLoading: false,
      }
    case SAVE_AP_TEMPLATE_SUCCESS:
      return {
        ...state,
        campaignsWithHistory: state.campaignsWithHistory.map((campaign) => {
          if (action.data.campaignId !== campaign.campaignid) {
            return campaign
          }
          campaign.is_ap_active = true
          return campaign
        }),
      }
    case TURN_AP_BULK_SUCCESS:
      return {
        ...state,
        campaignsWithHistory: state.campaignsWithHistory.map((campaign) => {
          if (action.data.campaignIds.indexOf(campaign.campaignid) === -1
            || campaign.is_ap_active === null) {
            return campaign
          }
          campaign.is_ap_active = action.data.state
          return campaign
        }),
      }
    case SAVE_AP_SUCCESS:
    case APPLY_TEMPLATE_BULK_SUCCESS:
      return {
        ...state,
        campaignsWithHistory: state.campaignsWithHistory.map((campaign) => {
          if (action.data.indexOf(campaign.campaignid) === -1) {
            return campaign
          }
          campaign.is_ap_active = true
          return campaign
        }),
      }
    case UPDATE_CAMPAIGN_ACOS_START:
      return {
        ...state,
        isUpdateCampaignAcos: true
      }
    case UPDATE_CAMPAIGN_ACOS_SUCCEED:
      return {
        ...state,
        isUpdateCampaignAcos: false,
        updateCampaignAcosSuccess: true
      }
    case UPDATE_CAMPAIGN_DAILYBUDGET_START:
      return {
        ...state,
        isUpdateCampaignDailyBudget: true
      }
    case UPDATE_CAMPAIGN_DAILYBUDGET_SUCCEED:
      return {
        ...state,
        isUpdateCampaignDailyBudget: false,
        updateDailyBudgetSuccess: true
      }
    case UPDATE_CAMPAIGN_STATE_START:
      return {
        ...state,
        isUpdateCampaignState: true
      }
    case UPDATE_CAMPAIGN_STATE_SUCCEED:
      return {
        ...state,
        isUpdateCampaignState: false,
      }
    case DISABLE_NOTIFICATION:
      return {
        ...state,
        updateCampaignAcosSuccess: false,
        updateDailyBudgetSuccess: false
      }
    case SET_DATE_RANGE: {
      return {
        ...state,
        startDate: action.data.startDate,
        endDate: action.data.endDate
      }
    }
    default:
      return state
  }
}

export default campaign
