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

import {
  SAVE_AP_SUCCESS,
  SAVE_AP_TEMPLATE_SUCCESS,
  TURN_AP_BULK_SUCCESS,
  APPLY_TEMPLATE_BULK_SUCCESS,
} from '../actionTypes/ap'

export const initialState = {
  // Dashboard
  kpiData: {},
  chartData: [],
  negativeKeywords: [],
  negativeTargets: [],
  currentAcos: 40,
  currentDetail: null,
  currentAdGroups: [],
  currentLogs: [],
  isLoading: false,
  isUpdatingName: false,
  isUpdatingAcos: false,
  isUpdatingPortfolio: false,
  isUpdatingBidding: false,
  isChangingNegativeKeywordState: false,
  isChangingNegativeTargetState: false,
  // SKU OP
  skuData: [],
  isSKUDataLoading: false,
  isChangingSkuState: false,
  // ST OP
  stData: [],
  isSTDataLoading: false,
  // Keyword cleaner
  negativeKWData: [],
  isNegativeKWLoading: false,
  // Bid OP
  isBidDataLoading: false,
  isChangingKeywordBid: false,
  isChangingKeywordState: false,
  isBidTargetDataLoading: false,
  isChangingTarget: false,
  bidData: [],
  bidTargetData: [],
  // Negative word finder
  isNegativeWordDataLoading: false,
  negativeWordData: [],
  negativeTargetData: [],
  existingNegativeData: [],
  // Placement
  isPlacementDataLoading: false,
  isUpdatingPlacementBid: false,
  placementData: [],
}

const campaignDetail = (state = initialState, action) => {
  switch (action.type) {
    case GET_DETAILS_START:
      return {
        ...state,
        isLoading: true,
        isChangingNegativeKeywordState: false,
        isChangingNegativeTargetState: false,
      }
    case GET_DETAILS_SUCCEED:
      return {
        ...state,
        isLoading: false,
        kpiData: action.data.kpi,
        chartData: action.data.chart,
        negativeKeywords: action.data.negativeKeywords,
        negativeTargets: action.data.negativeTargets,
        currentAcos: action.data.acos,
        currentDetail: action.data.campaign,
        currentAdGroups: action.data.adgroups,
        currentLogs: action.data.logs,
      }
    case UPDATE_NAME_START:
      return {
        ...state,
        isUpdatingName: true,
      }
    case UPDATE_NAME_SUCCEED:
      return {
        ...state,
        isUpdatingName: false,
        currentDetail: {
          ...state.currentDetail,
          name: action.data.campaignName,
        }
      }
    case UPDATE_NAME_FAIL:
      return {
        ...state,
        isUpdatingName: false,
      }
    case UPDATE_ACOS_START:
      return {
        ...state,
        isUpdatingAcos: true,
      }
    case UPDATE_ACOS_SUCCEED:
      return {
        ...state,
        isUpdatingAcos: false,
        currentAcos: action.data,
      }
    case UPDATE_ACOS_FAIL:
      return {
        ...state,
        isUpdatingAcos: false,
      }
    case UPDATE_PORTFOLIO_START:
      return {
        ...state,
        isUpdatingPortfolio: true,
      }
    case UPDATE_PORTFOLIO_SUCCEED:
      return {
        ...state,
        isUpdatingPortfolio: false,
        currentDetail: {
          ...state.currentDetail,
          portfolio_id: action.data.portfolioId,
          portfolio_name: action.data.portfolioName,
        }
      }
    case UPDATE_PORTFOLIO_FAIL:
      return {
        ...state,
        isUpdatingPortfolio: false,
      }
    case UPDATE_BIDDING_START:
      return {
        ...state,
        isUpdatingBidding: true,
      }
    case UPDATE_BIDDING_SUCCEED:
      return {
        ...state,
        isUpdatingBidding: false,
      }
    case UPDATE_BIDDING_FAIL:
      return {
        ...state,
        isUpdatingBidding: false,
      }
    case CHANGE_NEGATIVE_KEYWORD_STATE_START:
      return {
        ...state,
        isChangingNegativeKeywordState: true,
      }
    case CHANGE_NEGATIVE_KEYWORD_STATE_SUCCEED:
      // The only operation we support for negatives now is to archive them.
      return {
        ...state,
        isChangingNegativeKeywordState: false,
        negativeKeywords: state.negativeKeywords.filter(negative =>
          !action.data.includes(parseInt(negative.keywordId, 10))
        ),
      }
    case CHANGE_NEGATIVE_TARGET_STATE_START:
      return {
        ...state,
        isChangingNegativeTargetState: true,
      }
    case CHANGE_NEGATIVE_TARGET_STATE_SUCCEED:
      // The only operation we support for negatives now is to archive them.
      return {
        ...state,
        isChangingNegativeTargetState: false,
        negativeTargets: state.negativeTargets.filter(negative =>
          !action.data.includes(parseInt(negative.target_id, 10))
        ),
      }
    case GET_SKU_DATA_START:
      return {
        ...state,
        isSKUDataLoading: true,
        skuData: [],
      }
    case GET_SKU_DATA_SUCCEED:
      return {
        ...state,
        isSKUDataLoading: false,
        skuData: action.data,
      }
    case CHANGE_SKU_STATE_START:
      return {
        ...state,
        isChangingSkuState: true,
      }
    case CHANGE_SKU_STATE_SUCCEED:
      const temp = [...state.skuData]
      temp.forEach(skus => skus.forEach(sku => {
        if (sku.adGroupId === action.data.adGroupId && sku.adId === action.data.adId) {
          sku.state = action.data.state
        }
      }))
      return {
        ...state,
        isChangingSkuState: false,
        skuData: temp,
      }
    case GET_ST_DATA_START:
      return {
        ...state,
        isSTDataLoading: true,
        stData: [],
      }
    case GET_ST_DATA_SUCCEED:
      return {
        ...state,
        isSTDataLoading: false,
        stData: action.data,
      }
    case GET_ST_DATA_FAIL:
      return {
        ...state,
        isSTDataLoading: false,
      }
    case GET_NEGATIVE_KW_DATA_START:
      return {
        ...state,
        isNegativeKWLoading: true,
        negativeKWData: [],
      }
    case GET_NEGATIVE_KW_DATA_SUCCEED:
      return {
        ...state,
        isNegativeKWLoading: false,
        negativeKWData: action.data,
      }
    case GET_NEGATIVE_KW_DATA_FAIL:
      return {
        ...state,
        isNegativeKWLoading: false,
      }
    case GET_BID_DATA_START:
      return {
        ...state,
        isBidDataLoading: true,
        isChangingKeywordState: false,
        bidData: [],
      }
    case GET_BID_DATA_SUCCEED:
      return {
        ...state,
        isBidDataLoading: false,
        bidData: action.data,
      }
    case GET_BID_DATA_FAIL:
      return {
        ...state,
        isBidDataLoading: false,
      }
    case CHANGE_KEYWORD_BID_START:
      return {
        ...state,
        isChangingKeywordBid: true,
      }
    case CHANGE_KEYWORD_BID_SUCCEED:
      let changedIdsForBid = action.data.response
        .filter(res => res.code === 'SUCCESS')
        .map(res => action.data.campaignType === 'Sponsored Displays' ? res.targetId.toString() : res.keywordId.toString())
      // FIXME: The above logic needs to be re-considered.

      let newBidDataForBid = state.bidData || []
      if (!action.data.changeToNewBid) {
        newBidDataForBid = newBidDataForBid.map((keyword) => {
          if (changedIdsForBid.includes(keyword.keyword_id.toString())) {
            let newBid = parseFloat(action.data.newAdjustBid)

            if (action.data.adjustType === 'raiseBid')
              newBid =
                keyword.bid * (1 + parseFloat(action.data.newAdjustBid) / 100)
            else if (action.data.adjustType === 'lowerBid')
              newBid =
                keyword.bid * (1 - parseFloat(action.data.newAdjustBid) / 100)

            return { ...keyword, bid: newBid }
          }
          return keyword
        })
      } else {
        newBidDataForBid = newBidDataForBid.map((keyword) => {
          if (changedIdsForBid.includes(keyword.keyword_id.toString())) {
            let maxCpc = 0
            if (parseInt(keyword.units, 10) && parseInt(keyword.clicks, 10) && parseInt(keyword.orders, 10)) {
              maxCpc = (parseFloat(keyword.revenue) / parseInt(keyword.units, 10))
                * (action.data.currentAcos / 100)
                / (parseInt(keyword.clicks, 10) / parseInt(keyword.orders, 10))
            } else if (typeof keyword.units === 'undefined' && parseInt(keyword.clicks, 10)) {
              // For SB/SBV campaigns, the number of units is not available.
              maxCpc = parseFloat(keyword.revenue) * (action.data.currentAcos / 100)  / parseInt(keyword.clicks, 10)
            }

            return {
              ...keyword,
              bid: maxCpc,
            }
          }
          return keyword
        })
      }

      return {
        ...state,
        isChangingKeywordBid: false,
        bidData: newBidDataForBid,
      }
    case CHANGE_KEYWORD_BID_FAIL:
      return {
        ...state,
        isChangingKeywordBid: false,
      }
    case CHANGE_KEYWORD_STATE_START:
      return {
        ...state,
        isChangingKeywordState: true,
      }
    case CHANGE_KEYWORD_STATE_SUCCEED:
      // FIXME: This logic needs to be re-considered.
      let changedIdsForState = []
      if (action.data.campaignType === 'Sponsored Displays') {
        changedIdsForState = action.data.response.changeStateTargeting
          .filter(res => res.code === 'SUCCESS')
          .map(res => res.targetId.toString())
      } else if (action.data.campaignType === 'Sponsored Brands'
        || action.data.campaignType === 'Sponsored Brands Video') {
        changedIdsForState = action.data.response
          .filter(res => res.code === 'SUCCESS')
          .map(res => res.keywordId.toString())
      } else {
        changedIdsForState = action.data.response.changeStateKeyword.updateAMZ
          .filter(res => res.code === 'SUCCESS')
          .map(res => res.keywordId.toString())
      }

      const newBidData = (state.bidData || []).map(keyword =>
        changedIdsForState.includes(keyword.keyword_id.toString())
        ? { ...keyword, state: action.data.state }
        : keyword
      )

      return {
        ...state,
        isChangingKeywordState: false,
        bidData: newBidData,
      }
    case GET_BID_TARGET_DATA_START:
      return {
        ...state,
        isBidTargetDataLoading: true,
        isChangingTarget: false,
        bidTargetData: [],
      }
    case GET_BID_TARGET_DATA_SUCCEED:
      return {
        ...state,
        isBidTargetDataLoading: false,
        bidTargetData: action.data,
      }
    case GET_BID_TARGET_DATA_FAIL:
      return {
        ...state,
        isBidTargetDataLoading: false,
      }
    case CHANGE_TARGET_START:
      return {
        ...state,
        isChangingTarget: true,
      }
    case CHANGE_TARGET_SUCCEED:
      let newBidTargetData = [...state.bidTargetData]
      if (action.data.targets && action.data.targets.length) {
        newBidTargetData.forEach((target) => {
          const changedTarget = action.data.targets.find(item => (
            parseInt(item.targetId, 10) === parseInt(target.targetId, 10)
          ))
          if (changedTarget) {
            if (changedTarget.state) {
              target.state = changedTarget.state
            }
            if (changedTarget.bid) {
              target.bid = changedTarget.bid
            }
          }
        })
      }
      return {
        ...state,
        isChangingTarget: false,
        bidTargetData: newBidTargetData,
      }
    case CHANGE_TARGET_FAIL:
      return {
        ...state,
        isChangingTarget: false,
      }
    case GET_NEGATIVE_WORD_DATA_START:
      return {
        ...state,
        isNegativeWordDataLoading: true,
        negativeWordData: [],
        existingNegativeData: [],
      }
    case GET_NEGATIVE_WORD_DATA_SUCCEED:
      return {
        ...state,
        isNegativeWordDataLoading: false,
        negativeWordData: action.data.searchTerms,
        existingNegativeData: action.data.negatives,
      }
    case GET_NEGATIVE_WORD_DATA_FAIL:
      return {
        ...state,
        isNegativeWordDataLoading: false,
      }
    case GET_NEGATIVE_TARGET_DATA_START:
      return {
        ...state,
        isNegativeWordDataLoading: true,
        negativeTargetData: [],
      }
    case GET_NEGATIVE_TARGET_DATA_SUCCEED:
      return {
        ...state,
        isNegativeWordDataLoading: false,
        negativeTargetData: action.data,
      }
    case GET_NEGATIVE_TARGET_DATA_FAIL:
      return {
        ...state,
        isNegativeWordDataLoading: false,
      }
    case GET_PLACEMENT_DATA_START:
      return {
        ...state,
        isPlacementDataLoading: true,
      }
    case GET_PLACEMENT_DATA_SUCCEED:
      return {
        ...state,
        isPlacementDataLoading: false,
        placementData: action.data,
      }
    case GET_PLACEMENT_DATA_FAIL:
      return {
        ...state,
        isPlacementDataLoading: false,
      }
    case UPDATE_PLACEMENT_BID_START:
      return {
        ...state,
        isUpdatingPlacementBid: true,
      }
    case UPDATE_PLACEMENT_BID_SUCCEED:
      const newPlacements = [...state.placementData]
      const idx = newPlacements.findIndex(placement => placement.placementType === action.data.placementType)
      if (idx !== -1) {
        newPlacements[idx].bidding = action.data.campaign.bidding
        newPlacements[idx].biddingAdjustments = action.data.newBid
      }
      return {
        ...state,
        isUpdatingPlacementBid: false,
        placementData: newPlacements,
      }
    case UPDATE_PLACEMENT_BID_FAIL:
      return {
        ...state,
        isUpdatingPlacementBid: false,
      }
    case SAVE_AP_TEMPLATE_SUCCESS:
      let detailAfterTemplateSave = state.currentDetail
      if (detailAfterTemplateSave) {
        if (action.data.campaignId === detailAfterTemplateSave.campaign_id) {
          detailAfterTemplateSave.is_ap_active = true
        }
      }
      return {
        ...state,
        currentDetail: detailAfterTemplateSave,
      }
    case TURN_AP_BULK_SUCCESS:
      let detailAfterBulkUpdate = state.currentDetail
      if (detailAfterBulkUpdate) {
        if (action.data.campaignIds.indexOf(detailAfterBulkUpdate.campaign_id) !== -1
          && detailAfterBulkUpdate.is_ap_active !== null) {
          detailAfterBulkUpdate.is_ap_active = action.data.state
        }
      }
      return {
        ...state,
        currentDetail: detailAfterBulkUpdate,
      }
    case SAVE_AP_SUCCESS:
    case APPLY_TEMPLATE_BULK_SUCCESS:
      let detailAfterApSave = state.currentDetail
      if (detailAfterApSave) {
        if (action.data.indexOf(detailAfterApSave.campaign_id) !== -1) {
          detailAfterApSave.is_ap_active = true
        }
      }
      return {
        ...state,
        currentDetail: detailAfterApSave,
      }
    default:
      return state
  }
}

export default campaignDetail
