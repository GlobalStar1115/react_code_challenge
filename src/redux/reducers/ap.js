// Reducer for smart pilot manager.
import { APM_SHOW } from '../actionTypes/pageGlobal'
import {
  GET_AP,
  GET_AP_SUCCESS,
  GET_AP_AD_GROUP,
  GET_AP_AD_GROUP_SUCCESS,
  GET_AP_SKUS,
  GET_AP_SKUS_SUCCESS,
  GET_AP_SPSD_CAMPAIGNS,
  GET_AP_SPSD_CAMPAIGNS_SUCCESS,
  GET_AP_SB_CAMPAIGNS,
  GET_AP_SB_CAMPAIGNS_SUCCESS,
  GET_AP_TEST_RESULTS,
  GET_AP_TEST_RESULTS_SUCCESS,
  GET_AP_CAMPAIGNS_TO_APPLY,
  GET_AP_CAMPAIGNS_TO_APPLY_SUCCESS,
  SAVE_AP,
  SAVE_AP_SUCCESS,
  SAVE_AP_TEMPLATE,
  SAVE_AP_TEMPLATE_SUCCESS,
  GET_AP_TEMPLATES,
  GET_AP_TEMPLATES_SUCCESS,
  TURN_AP_BULK,
  TURN_AP_BULK_SUCCESS,
  APPLY_TEMPLATE_BULK,
  APPLY_TEMPLATE_BULK_SUCCESS,
} from '../actionTypes/ap'

import {
  getDefaultAPSettings,
  parseAPSettings,
  parseCampaignsToApply,
  categorizeAdgroups,
} from '../../services/helper'

export const initialState = {
  // TODO: Do we need to store campaign ID here?
  campaignId: null,
  campaign: null,
  // List of SKUs used in search term optimization section.
  skus: [],
  // List of SP/SD campaigns used in search term optimization section.
  spsdCampaigns: [],
  // List of SB campaigns used in search term optimization section.
  sbCampaigns: [],
  testResults: null,
  campaignsToApply: [],
  templates: [],
  isLoading: false,
  isLoadingSkus: false,
  isLoadingSPSDCampaigns: false,
  isLoadingSBCampaigns: false,
  isLoadingTestResults: false,
  isLoadingCampaignsToApply: false,
  isLoadingTemplates: false,
  isSaving: false,
  // Once loaded, no need to re-load SB campaigns.
  isSBCampaignsLoaded: false,
  // Once loaded, no need to re-load templates.
  isTemplatesLoaded: false,
  // Is in progress of turning on/off in bulk?
  isTurningBulk: false,
  // Is in progress of applying template in bulk?
  isApplyingTemplateBulk: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // FIXME: Combine APM_SHOW and GET_AP actions into one.
    case APM_SHOW:
      return {
        ...initialState,
        campaignId: action.campaignId,
      }
    case GET_AP:
      return {
        ...state,
        isLoading: true,
        campaign: null,
      }
    case GET_AP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        campaign: {
          ...action.data,
          ap: action.data.ap.length
            ? parseAPSettings(action.data.ap[0])
            : null,
          template: action.data.template ? parseAPSettings(action.data.template) : null,
          ...(categorizeAdgroups(action.data.adgroups, action.data.targetings)),
        },
      }
    case GET_AP_AD_GROUP:
      return {
        ...state,
        isLoading: true,
      }
    case GET_AP_AD_GROUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        campaign: {
          ...state.campaign,
          ap: action.data.length
            ? parseAPSettings(action.data[0])
            : getDefaultAPSettings(action.adgroupId),
        },
      }
    case GET_AP_SKUS:
      return {
        ...state,
        isLoadingSkus: true,
        skus: [],
      }
    case GET_AP_SKUS_SUCCESS:
      return {
        ...state,
        isLoadingSkus: false,
        skus: action.data,
      }
    case GET_AP_SPSD_CAMPAIGNS:
      return {
        ...state,
        isLoadingSPSDCampaigns: true,
        spsdCampaigns: [],
      }
    case GET_AP_SPSD_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        isLoadingSPSDCampaigns: false,
        spsdCampaigns: action.data,
      }
    case GET_AP_SB_CAMPAIGNS:
      return {
        ...state,
        isLoadingSBCampaigns: true,
        sbCampaigns: [],
      }
    case GET_AP_SB_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        isLoadingSBCampaigns: false,
        isSBCampaignsLoaded: true,
        sbCampaigns: action.data,
      }
    case GET_AP_TEST_RESULTS:
      return {
        ...state,
        isLoadingTestResults: true,
        testResults: null,
      }
    case GET_AP_TEST_RESULTS_SUCCESS:
      return {
        ...state,
        isLoadingTestResults: false,
        testResults: action.data,
      }
    case GET_AP_CAMPAIGNS_TO_APPLY:
      return {
        ...state,
        isLoadingCampaignsToApply: true,
        campaignsToApply: [],
      }
    case GET_AP_CAMPAIGNS_TO_APPLY_SUCCESS:
      return {
        ...state,
        isLoadingCampaignsToApply: false,
        campaignsToApply: parseCampaignsToApply(action.data),
      }
    case SAVE_AP:
    case SAVE_AP_TEMPLATE:
      return {
        ...state,
        isSaving: true,
      }
    case SAVE_AP_SUCCESS:
      return {
        ...state,
        isSaving: false,
      }
    case SAVE_AP_TEMPLATE_SUCCESS:
      const templates = [...state.templates]
      templates.push(action.data)
      templates.sort((a, b) => a.name.localeCompare(b.name))

      const newState = {
        ...state,
        isSaving: false,
        templates,
      }

      if (action.data.apData) {
        newState.campaign = {
          ...action.data.apData,
          ap: parseAPSettings(action.data.apData.ap[0]),
          template: parseAPSettings(action.data.apData.template),
          ...(categorizeAdgroups(action.data.apData.adgroups, action.data.apData.targetings)),
        }
      }

      return newState
    case GET_AP_TEMPLATES:
      return {
        ...state,
        isLoadingTemplates: true,
        templates: [],
      }
    case GET_AP_TEMPLATES_SUCCESS:
      return {
        ...state,
        isLoadingTemplates: false,
        isTemplatesLoaded: true,
        templates: action.data,
      }
    case TURN_AP_BULK:
      return {
        ...state,
        [action.data.fromAPM ? 'isSaving' : 'isTurningBulk']: true,
      }
    case TURN_AP_BULK_SUCCESS:
      return {
        ...state,
        [action.data.fromAPM ? 'isSaving' : 'isTurningBulk']: false,
      }
    case APPLY_TEMPLATE_BULK:
      return {
        ...state,
        isApplyingTemplateBulk: true,
      }
    case APPLY_TEMPLATE_BULK_SUCCESS:
      return {
        ...state,
        isApplyingTemplateBulk: false,
      }
    default:
      return state
  }
}
