import React from 'react'

import Frequency from './Frequency'

const OpNTA = ({ details, clone }) => {
  const prefix = clone ? 'copy_' : ''

  if (!details[`${prefix}nta_isactive`]) {
    return null
  }

  return (
    <div className="setting-section">
      <div className="section-name">
        Negative Target Automation
      </div>
      <div className="setting-wrapper">
        Add ASINS (Products) as negatives:
        <span className="setting-value">
          { details[`${prefix}add_asin_negatives_isactive`] ? 'On' : 'Off' }
        </span>
      </div>
      <div className="setting-wrapper">
        Add to campaign level:
        <span className="setting-value">
          { details[`${prefix}negative_campaignlevel_isactive`] ? 'On' : 'Off' }
        </span>
      </div>
      <div className="setting-wrapper">
        Add to Ad Group level:
        <span className="setting-value">
          { details[`${prefix}negative_adgrouplevel_isactive`] ? 'On' : 'Off' }
        </span>
      </div>
      {
        details[`${prefix}negative_byclick_isactive`] && (
          <div className="setting-wrapper">
            Click(s) without sale:
            <span className="setting-value">
              { details[`${prefix}negative_byclick_threshold`] }
            </span>
          </div>
        )
      }
      {
        details[`${prefix}negative_byimpression_isactive`] && (
          <div className="setting-wrapper">
            Impressions without a click:
            <span className="setting-value">
              { details[`${prefix}negative_byimpression_threshold`] }
            </span>
          </div>
        )
      }
      {
        details[`${prefix}negative_byctr_isactive`] && (
          <div className="setting-wrapper">
            CTR lower than:
            <span className="setting-value">
              { details[`${prefix}negative_byctr_threshold`] }
            </span>
          </div>
        )
      }
      <div className="setting-wrapper">
        Frequency:
        <span className="setting-value">
          <Frequency details={details} prefix={`${prefix}nta_`} />
        </span>
      </div>
      <div className="setting-wrapper">
        Lookback Period (days):
        <span className="setting-value">
          { details[`${prefix}nt_lookback`] }
        </span>
      </div>
    </div>
  )
}

export default OpNTA
