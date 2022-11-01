import React from 'react'

const ExKeyword = ({ details }) => {
  if (!details.increase_percentbid_byimpression_isactive) {
    return null
  }

  return (
    <div className="setting-section">
      <div className="section-name">
        Target Bid Expansion
      </div>
      <div className="setting-subsection">
        <div className="subsection-name">
          Low impression targets
        </div>
        <div className="setting-wrapper">
          If target has impressions less than:
          <span className="setting-value">
            { details.increase_percentbid_byimpression_threshold }
          </span>
        </div>
        <div className="setting-wrapper">
          Increase bid by:
          <span className="setting-value">
            { details.increase_percentbid_byimpression_amount }
            { details.zero_impression_sing }
          </span>
        </div>
        <div className="setting-wrapper">
          Max bid value:
          <span className="setting-value">
            { details.increase_percentbid_byimpression_maxmoney }
          </span>
        </div>
        <div className="setting-wrapper">
          Lookback Period (days):
          <span className="setting-value">
            { details.pt_day_used_auto_pilot }
          </span>
        </div>
      </div>
    </div>
  )
}

export default ExKeyword
