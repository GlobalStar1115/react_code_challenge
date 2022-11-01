import React from 'react'
import { Tooltip, Whisper } from 'rsuite'
import Select from 'react-select'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const Option = (props) => {
  const { innerRef, innerProps, getStyles, data } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles('option', props)}
      className="strategy-option"
    >
      { data.label }
      <div className="strategy-desc">
        { data.description }
      </div>
    </div>
  )
}

const SPBidSection = ({ info, strategyList, onChange }) => {
  const handlePlacementBidChange = (name, value) => {
    if (value !== '' && isNaN(value)) {
      return
    }

    const valueAsNumber = parseInt(value || 0, 10)
    if (valueAsNumber < 0 || valueAsNumber > 900) {
      return
    }

    onChange(name, value)
  }

  return (
    <div className="section-container">
      <div className="section-title">Bidding</div>
      <div className="section-note">
        In addition to your bidding strategy, you can increase bids by up to 900%.
      </div>
      <div className="field-row">
        <div className="field-wrapper">
          <div className="field-name">
            Campaign bidding strategy
            <Whisper placement="right" trigger="hover" speaker={(
              <Tooltip>
                Choose how you want to pay for clicks on your ads.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
          <Select
            options={strategyList}
            components={{ Option }}
            value={info.strategy}
            onChange={(option) => { onChange('strategy', option) }}
          />
        </div>
        <div className="field-wrapper" />
      </div>
      <div className="field-row">
        <div className="field-wrapper">
          <div className="field-name">
            Default bid
          </div>
          <input
            type="number"
            value={info.defaultBid}
            onChange={(event) => { onChange('defaultBid', event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <div className="field-name">
            Adjust bids by placement
            <Whisper placement="right" trigger="hover" speaker={(
              <Tooltip>
                Apply different bids by placement by entering a percentage increase
                to your default bid. These adjustments will apply on all bids in the campaign.
                Based on your bidding strategy, your bids can change further.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
          <div className="input-wrapper">
            <span className="input-prefix">Top of search (first page)</span>
            <input
              type="number"
              className="shrinked-input"
              value={info.topSearchBid}
              onChange={(event) => { handlePlacementBidChange('topSearchBid', event.target.value) }}
            />
            <span className="input-suffix">%</span>
          </div>
          <div className="input-wrapper">
            <span className="input-prefix">Product pages</span>
            <input
              type="number"
              className="shrinked-input"
              value={info.productPagesBid}
              onChange={(event) => { handlePlacementBidChange('productPagesBid', event.target.value) }}
            />
            <span className="input-suffix">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SPBidSection
