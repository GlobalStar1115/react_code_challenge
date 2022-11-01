import moment from 'moment'
import {
  GET_LIST_PORTFOLIOS_SUCCEED,
  GET_LIST_PORTFOLIOS_START,
  CREATE_PORTFOLIO_START,
  CREATE_PORTFOLIO_SUCCEED,
  CREATE_PORTFOLIO_FAILD,
  ADD_CAMPAIGN_EXISTING_PORTFOLIO_START,
  ADD_CAMPAIGN_EXISTING_PORTFOLIO_SUCCEED,
  SORT_PORTFOLIO_DATA,
  SET_DATE_RANGE
} from '../actionTypes/portfolio'

export const initialState = {
  listPortfolios: [],
  isLoading: false,
  isCreatingPortfolio: false,
  createdPortfolioResponse: '',
  createdPortfolio: [],
  isAddCampaignToExistingPortfolio: false,
  startDate: moment().subtract(29, 'day').format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
  // true: highest->lowest, false: lowest->highest
  sortDirection: true,
  sortColumnName: 'cost',
}

const portfolio = (state = initialState, action) => {
  const { sortDirection, sortColumnName } = state

	switch (action.type) {
    case SORT_PORTFOLIO_DATA:
      return {
        ...state,
        sortColumnName: action.data,
        sortDirection: (sortColumnName === action.data) ? !sortDirection : true
      }
    case GET_LIST_PORTFOLIOS_START:
      return {
        ...state,
        isLoading: true
      }
    case GET_LIST_PORTFOLIOS_SUCCEED:
      return {
        ...state,
        listPortfolios: action.data,
        isLoading: false
      }
    case CREATE_PORTFOLIO_START:
      return {
        ...state,
        isCreatingPortfolio: true,
        createdPortfolioResponse: {},
      }
    case CREATE_PORTFOLIO_SUCCEED:
      if (action.data.portfolioId) {
        return {
          ...state,
          isCreatingPortfolio: false,
          createdPortfolioResponse: {
            portfolioId: action.data.portfolioId,
            portfolioName: action.data.portfolioName,
          },
        }
      }
      return {
        ...state,
        isCreatingPortfolio: false,
        createdPortfolioResponse: action.data.text,
      }
    case CREATE_PORTFOLIO_FAILD:
      return {
        ...state,
        isCreatingPortfolio: false,
        createdPortfolioResponse: {
          error: 'Failed to create portfolio. Server error',
        }
      }
    case ADD_CAMPAIGN_EXISTING_PORTFOLIO_START:
      return {
        ...state,
        isAddCampaignToExistingPortfolio: true
      }
    case ADD_CAMPAIGN_EXISTING_PORTFOLIO_SUCCEED:
      return {
        ...state,
        isAddCampaignToExistingPortfolio: false
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

export default portfolio