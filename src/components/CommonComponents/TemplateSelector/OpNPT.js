import React from 'react'

import Frequency from './Frequency'

const OpNPT = ({ details, clone }) => {
  const prefix = clone ? 'copy_' : ''

  if (!details[`${prefix}npt_byclick_isactive`]) {
    return null
  }

  return (
    <div className="setting-section">
      <div className="section-name">
        Negative Product Targeting
      </div>
      <div className="setting-wrapper">
        Click(s) without sale:
        <span className="setting-value">
          { details[`${prefix}npt_byclick_threshold`] }
        </span>
      </div>
      <div className="setting-wrapper">
        Frequency:
        <span className="setting-value">
          <Frequency details={details} prefix={`${prefix}npt_`} />
        </span>
      </div>
      <div className="setting-wrapper">
        Lookback Period (days):
        <span className="setting-value">
          { details[`${prefix}npt_lookback`] }
        </span>
      </div>
    </div>
  )
}

export default OpNPT
