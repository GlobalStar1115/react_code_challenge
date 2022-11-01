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

export const applyCampaignFilter = (data) => {
  return {
    type: APPLY_CAMPAIGN_FILTER,
    data
  }
}

export const applyProductFilter = (data) => {
  return {
    type: APPLY_PRODUCT_FILTER,
    data
  }
}

export const applyPortfolioFilter = (data) => {
  return {
    type: APPLY_PORTFOLIO_FILTER,
    data
  }
}

export const applyPortfolioColumnChanges = (data) => {
  return {
    type: APPLY_PORTFOLIO_COLUMN_CHANGES,
    data
  }
}

export const applyProductColumnChanges = (data) => {
  return {
    type: APPLY_PRODUCT_COLUMN_CHANGES,
    data
  }
}

export const applyAllCampaignColumnChanges = (data) => {
  return {
    type: APPLY_ALL_CAMPAIGN_COLUMN_CHANGES,
    data
  }
}

export const applyCampaignColumnChanges = (data) => {
  return {
    type: APPLY_CAMPAIGN_COLUMN_CHANGES,
    data
  }
}

export const showColumnEditorAction = () => {
  return {
    type: COLUMN_EDITOR_SHOW
  }
}

export const hideColumnEditorAction = () => {
  return {
    type: COLUMN_EDITOR_HIDE
  }
}

export const showTableFilterAction = () => {
  return {
    type: TABLE_FILTER_SHOW
  }
}

export const hideTableFilterAction = () => {
  return {
    type: TABLE_FILTER_HIDE
  }
}

// Show smart pilot manager.
export const showAPMAction = (campaignId) => {
  return {
    type: APM_SHOW,
    campaignId,
  }
}

// Hide smart pilot manager.
export const hideAPMAction = () => {
  return {
    type: APM_HIDE,
  }
}

//show add to new portfolio
export const showANPAction = (campaigns) => {
  return {
    type: ANP_SHOW,
    campaigns
  }
}

// Hide add to new portfolio.
export const hideANPAction = () => {
  return {
    type: ANP_HIDE,
  }
}

//show add to new portfolio
export const showAEPAction = (campaigns) => {
  return {
    type: AEP_SHOW,
    campaigns
  }
}

// Hide add to new portfolio.
export const hideAEPAction = () => {
  return {
    type: AEP_HIDE,
  }
}

// show add Search Term to Exisining Camapign.
export const showExistingModalAction = () => {
  return {
    type: EMP_SHOW,
  }
}

// show add Search Term to Exisining Camapign.
export const hideExistingModalAction = () => {
  return {
    type: EMP_HIDE,
  }
}

export const toggleCoinPane = () => {
  return {
    type: COIN_PANE_TOGGLE,
  }
}

export const toggleNotificationPane = () => {
  return {
    type: NOTIFICATION_PANE_TOGGLE,
  }
}