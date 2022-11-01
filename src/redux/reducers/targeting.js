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

import {
  formatValue,
} from '../../services/helper.js'

export const initialState = {
  // campaign dashboard
  // keyword cleaner tab
  isCreatingNegativeTargets: false,
  isCreatingAdgroupNegativeTargets: false,
  // bulk editor
  // optimization
  isOptAdvancedAutoTargetingBulkLoading: false,
  isCreateOptNegativeProductTargeting: false,
  isUpdateOptAdvancedTargetAutoListBulk: false,
  isCreateOptCampaignNegativeProductTargets: false,
  // expansion
  isExAsinsByTargetBulkLoading: false,
  isExCategoriesByTargetBulkLoading: false,
  isAllCategoriesLoading: false,
  isSearchedProductsLoading: false,
  isNegativeTargetingBrandsLoading: false,
  isNegativeTargetingProductsLoading: false,
  isRefineBrandsLoading: false,
  // campaign dashboard
  // bulk editor
  // optimization
  opt_advanced_auto_targeting_bulk: [],
  exAsinsByTargetBulk: [],
  // expansion
  ex_categories_by_target_bulk: [],
  targetingAllCategories: [],
  targetingSearchedProducts: [],
  negativeTargetingBrands: [],
  negativeTargetingProducts: [],
  refineBrands: [],
}
const targeting = (state = initialState, action) => {
  let changedTargetIds = []
  let newOptAdvancedAutoTargetsBulk = []
  switch (action.type) {
    case GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_START:
      return {
        ...state,
        isOptAdvancedAutoTargetingBulkLoading: true
      }
    case GET_CAMPAIGN_OPT_ADVANCED_AUTO_TARGETING_BULK_SUCCEED:
      return {
        ...state,
        isOptAdvancedAutoTargetingBulkLoading: false,
        opt_advanced_auto_targeting_bulk: action.data
      }
    case GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_START:
      return {
        ...state,
        isExAsinsByTargetBulkLoading: true
      }
    case GET_CAMPAIGN_EX_ASINS_BY_TARGET_BULK_SUCCEED:
      return {
        ...state,
        isExAsinsByTargetBulkLoading: false,
        exAsinsByTargetBulk: action.data
      }
    case GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_START:
      return {
        ...state,
        isExCategoriesByTargetBulkLoading: true
      }
    case GET_CAMPAIGN_EX_CATEGORIES_BY_TARGET_BULK_SUCCEED:
      return {
        ...state,
        isExCategoriesByTargetBulkLoading: false,
        ex_categories_by_target_bulk: action.data
      }
    case CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_START:
      return {
        ...state,
        isCreateOptNegativeProductTargeting: true
      }
    case GET_ALL_CATEGORIES_START:
      return {
        ...state,
        isAllCategoriesLoading: true
      }
    case GET_ALL_CATEGORIES_SUCCEED:
      return {
        ...state,
        isAllCategoriesLoading: false,
        targetingAllCategories: action.data
      }
    case GET_ALL_CATEGORIES_FAILED:
      return {
        ...state,
        isAllCategoriesLoading: false,
        targetingAllCategories: []
      }
    case GET_PRODUCTS_BY_SEARCH_TEXT_START:
      return {
        ...state,
        isSearchedProductsLoading: true
      }
    case GET_PRODUCTS_BY_SEARCH_TEXT_SUCCEED:
      return {
        ...state,
        isSearchedProductsLoading: false,
        targetingSearchedProducts: action.data.Item
          ? action.data.Item.map(product => Object.assign(product, {
            name: product.ItemAttributes.Title,
          }))
          : []
      }
    case GET_BRAND_RECOMMENDATION_START:
      return {
        ...state,
        isNegativeTargetingBrandsLoading: true
      }
    case GET_BRAND_RECOMMENDATION_SUCCEED:
      return {
        ...state,
        isNegativeTargetingBrandsLoading: false,
        negativeTargetingBrands: action.data
      }
    case GET_REFINE_BRANDS_START:
      return {
        ...state,
        isRefineBrandsLoading: true
      }
    case GET_REFINE_BRANDS_SUCCEED:
      return {
        ...state,
        isRefineBrandsLoading: false,
        refineBrands: action.data
      }
    case GET_PRODUCTS_NEGATIVE_TARGETING_START:
      return {
        ...state,
        isNegativeTargetingProductsLoading: true
      }
    case GET_PRODUCTS_NEGATIVE_TARGETING_SUCCEED:
      return {
        ...state,
        isNegativeTargetingProductsLoading: false,
        negativeTargetingProducts: action.data.Item
          ? action.data.Item.map(product => ({
            ...product,
            name: product.ItemAttributes.Title,
          }))
          : []
      }
    case CREATE_OPT_NEGATIVE_PRODUCT_TARGETING_SUCCEED:
      return {
        ...state,
        isCreateOptNegativeProductTargeting: false
      }

    case UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_START:
      return {
        ...state,
        isUpdateOptAdvancedTargetAutoListBulk: true
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_STATE_SUCCEED:
      changedTargetIds = []
      changedTargetIds = action.data.response.filter(res=>res.code === "SUCCESS").map(res=>(res.targetId).toString())
      newOptAdvancedAutoTargetsBulk = state.opt_advanced_auto_targeting_bulk.map(auto_target =>
        changedTargetIds.includes((auto_target.targetId).toString()) ? { ...auto_target, state: action.data.state} : auto_target
      )

      return {
        ...state,
        isUpdateOptAdvancedTargetAutoListBulk: false,
        opt_advanced_auto_targeting_bulk: newOptAdvancedAutoTargetsBulk
      }
    case UPDATE_CAMPAIGN_OPT_ADVANCED_TARGET_AUTO_LIST_BID_SUCCEED:
      changedTargetIds = []
      changedTargetIds = action.data.response.filter(res=>res.code === "SUCCESS").map(res=>(res.targetId).toString())
      newOptAdvancedAutoTargetsBulk = state.opt_advanced_auto_targeting_bulk.map(auto_target =>
        changedTargetIds.includes((auto_target.targetId).toString()) ? { ...auto_target, state: action.data.state} : auto_target
      )

      newOptAdvancedAutoTargetsBulk = state.opt_advanced_auto_targeting_bulk.map(auto_target => {
        if (changedTargetIds.includes((auto_target.targetId).toString()) ) {
          let newBid = formatValue(action.data.newAdjustBid, 'number', 2)

          if (action.data.adjustType === 'raiseBid')
            newBid = auto_target.bid * (1 + parseFloat(action.data.newAdjustBid) / 100)
          else if (action.data.adjustType === 'lowerBid')
            newBid = auto_target.bid * (1 - parseFloat(action.data.newAdjustBid) / 100)

          return {...auto_target, bid: formatValue(newBid, 'number', 2)}
        } else
          return auto_target
      })
      return {
        ...state,
        isUpdateOptAdvancedTargetAutoListBulk: false,
        opt_advanced_auto_targeting_bulk: newOptAdvancedAutoTargetsBulk
      }
    case CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_START:
      return {
        ...state,
        isCreateOptCampaignNegativeProductTargets: true
      }
    case CREATE_OPT_CAMPAIGN_NEGATIVE_PRODUCTS_TARGETS_SUCCEED:
      return {
        ...state,
        isCreateOptCampaignNegativeProductTargets: false
      }
    case CREATE_NEGATIVE_TARGETS_START:
      return {
        ...state,
        isCreatingNegativeTargets: true,
      }
    case CREATE_NEGATIVE_TARGETS_SUCCEED:
      return {
        ...state,
        isCreatingNegativeTargets: false,
      }
    case CREATE_NEGATIVE_TARGETS_FAIL:
      return {
        ...state,
        isCreatingNegativeTargets: false,
      }
    case CREATE_ADGROUP_NEGATIVE_TARGETS_START:
      return {
        ...state,
        isCreatingAdgroupNegativeTargets: true,
      }
    case CREATE_ADGROUP_NEGATIVE_TARGETS_SUCCEED:
      return {
        ...state,
        isCreatingAdgroupNegativeTargets: false,
      }
    case CREATE_ADGROUP_NEGATIVE_TARGETS_FAIL:
      return {
        ...state,
        isCreatingAdgroupNegativeTargets: false,
      }
    default:
      return state
  }
}
export default targeting