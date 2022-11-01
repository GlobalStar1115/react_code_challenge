import {
  GET_SP_SUGGESTIONS_START,
  GET_SP_SUGGESTIONS_SUCCEED,
  GET_SUGGESTED_BIDS_START,
  GET_SUGGESTED_BIDS_SUCCEED,
  CREATE_CAMPAIGN_START,
  CREATE_CAMPAIGN_FINISH,
  GET_SD_SUGGESTIONS_START,
  GET_SD_SUGGESTIONS_SUCCEED,
} from '../actionTypes/campaignCreator'

const initialState = {
  isSPSuggestionsLoading: false,
  suggestedKeywords: [],
  suggestedSPCategories: [],
  isSuggestedBidsLoading: false,
  suggestedBids: [],
  isCreating: false,
  isSDSuggestionsLoading: false,
  suggestedSDProducts: [],
  suggestedSDCategories: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SP_SUGGESTIONS_START:
      return {
        ...state,
        isSPSuggestionsLoading: true,
      }
    case GET_SP_SUGGESTIONS_SUCCEED:
      return {
        ...state,
        isSPSuggestionsLoading: false,
        suggestedKeywords: action.data.keywords,
        suggestedSPCategories: action.data.categories.filter(category => category.isTargetable),
      }
    case GET_SUGGESTED_BIDS_START:
      return {
        ...state,
        isSuggestedBidsLoading: true,
        suggestedBids: [],
      }
    case GET_SUGGESTED_BIDS_SUCCEED:
      return {
        ...state,
        isSuggestedBidsLoading: false,
        suggestedBids: action.data,
      }
    case CREATE_CAMPAIGN_START:
      return {
        ...state,
        isCreating: true,
      }
    case CREATE_CAMPAIGN_FINISH:
      return {
        ...state,
        isCreating: false,
      }
    case GET_SD_SUGGESTIONS_START:
      return {
        ...state,
        isSDSuggestionsLoading: true,
      }
    case GET_SD_SUGGESTIONS_SUCCEED:
      return {
        ...state,
        isSDSuggestionsLoading: false,
        suggestedSDProducts: action.data.products,
        suggestedSDCategories: action.data.categories,
      }
    default:
      return state
  }
}
