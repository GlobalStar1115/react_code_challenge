import { defaultCampaignTableColumns, defaultProductTableColumns, defaultPortfolioTableColumns } from '../../utils/constants/defaultValues'
import { GET_ALL_ACCOUNT_START } from '../actionTypes/header'
import {
  COLUMN_EDITOR_SHOW,
  COLUMN_EDITOR_HIDE,
  TABLE_FILTER_SHOW,
  TABLE_FILTER_HIDE,
  APM_SHOW,
  APM_HIDE,
  APPLY_CAMPAIGN_COLUMN_CHANGES,
  APPLY_ALL_CAMPAIGN_COLUMN_CHANGES,
  APPLY_PRODUCT_COLUMN_CHANGES,
  APPLY_PORTFOLIO_COLUMN_CHANGES,
  APPLY_CAMPAIGN_FILTER,
  APPLY_PRODUCT_FILTER,
  APPLY_PORTFOLIO_FILTER,
  ANP_SHOW,
  ANP_HIDE,
  AEP_SHOW,
  AEP_HIDE,
  EMP_SHOW,
  EMP_HIDE,
  COIN_PANE_TOGGLE,
  NOTIFICATION_PANE_TOGGLE,
} from '../actionTypes/pageGlobal'

export const initialState = {
  showColumnEditor: false,
  showTableFilter: false,
  showAPM: false,
  campaignTableColumns: defaultCampaignTableColumns,
  productTableColumns: defaultProductTableColumns,
  portfolioTableColumns: defaultPortfolioTableColumns,
  campaignFilters: {},
  productFilters: {},
  portfolioFilters: {},
  showANP: false,
  showAEP: false,
  showExistingModal: false,
  showCoinPane: false,
  showNotificationPane: false,
}

const pageGlobal = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ACCOUNT_START:
      return {
        ...state,
        showColumnEditor: false,
        showTableFilter: false,
        showAPM: false,
        campaignFilters: {},
        productFilters: {},
        portfolioFilters: {},
        showANP: false,
        showAEP: false,
        showExistingModal: false,
        showCoinPane: false,
        showNotificationPane: false,
      }
    case COLUMN_EDITOR_SHOW:
      return {
        ...state,
        showColumnEditor: true
      }
    case COLUMN_EDITOR_HIDE:
      return {
        ...state,
        listPortfolios: action.data,
        showColumnEditor: false
      }
    case TABLE_FILTER_SHOW:
      return {
        ...state,
        showTableFilter: true
      }
    case TABLE_FILTER_HIDE:
      return {
        ...state,
        listPortfolios: action.data,
        showTableFilter: false
      }
    case APM_SHOW:
      return {
        ...state,
        showAPM: true,
      }
    case APM_HIDE:
      return {
        ...state,
        showAPM: false,
      }
    case APPLY_CAMPAIGN_COLUMN_CHANGES:
      return {
        ...state,
        showColumnEditor: false,
        campaignTableColumns: action.data
      }
    case APPLY_ALL_CAMPAIGN_COLUMN_CHANGES:
      return {
        ...state,
        showColumnEditor: false,
        campaignTableColumns: action.data
      }
    case APPLY_PRODUCT_COLUMN_CHANGES:
      return {
        ...state,
        showColumnEditor: false,
        productTableColumns: action.data
      }
    case APPLY_PORTFOLIO_COLUMN_CHANGES:
      return {
        ...state,
        showColumnEditor: false,
        portfolioTableColumns: action.data
      }
    case APPLY_CAMPAIGN_FILTER:
      return {
        ...state,
        showTableFilter: false,
        campaignFilters: action.data
      }
    case APPLY_PRODUCT_FILTER:
      return {
        ...state,
        showTableFilter: false,
        productFilters: action.data
      }
    case APPLY_PORTFOLIO_FILTER:
      return {
        ...state,
        showTableFilter: false,
        portfolioFilters: action.data
      }
    case ANP_SHOW:
      return {
        ...state,
        showANP: true,
      }
    case ANP_HIDE:
      return {
        ...state,
        showANP: false,
      }
    case AEP_SHOW:
      return {
        ...state,
        showAEP: true,
      }
    case AEP_HIDE:
      return {
        ...state,
        showAEP: false,
      }
    case EMP_SHOW:
      return {
        ...state,
        showExistingModal: true,
      }
    case EMP_HIDE:
      return {
        ...state,
        showExistingModal: false,
      }
    case COIN_PANE_TOGGLE:
      return {
        ...state,
        showCoinPane: !state.showCoinPane,
      }
    case NOTIFICATION_PANE_TOGGLE:
      return {
        ...state,
        showNotificationPane: !state.showNotificationPane,
      }
    default:
      return state
  }
}

export default pageGlobal
