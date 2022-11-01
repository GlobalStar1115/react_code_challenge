import React from 'react'

const OpKeywordBasic = ({ details }) => {
  if (!details.basic_isactive) {
    return null
  }

  return (
    <div className="setting-subsection">
      <div className="subsection-name">
        Basic Settings
      </div>
      <div className="setting-wrapper">
        Target ACoS:
        <span className="setting-value">{ details.target_acos }</span>
      </div>
      <div className="setting-wrapper">
        Minimum Bid:
        <span className="setting-value">{ details.minimum_bid }</span>
      </div>
      <div className="setting-wrapper">
        Maximum Bid:
        <span className="setting-value">{ details.max_bid_price }</span>
      </div>
      <div className="setting-wrapper">
        Min Clicks:
        <span className="setting-value">{ details.minimum_click }</span>
      </div>
      <div className="setting-wrapper">
        Min Impressions:
        <span className="setting-value">{ details.minimum_impression }</span>
      </div>
      <div className="setting-wrapper">
        Lookback period (days):
        <span className="setting-value">{ details.day_used_auto_pilot }</span>
      </div>
    </div>
  )
}

export default OpKeywordBasic
