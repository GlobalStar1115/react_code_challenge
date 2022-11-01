import React from 'react'
import Select from 'react-select'

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

const SDBidSection = ({ info, dailyBudget, opList, onChange }) => (
  <div className="section-container">
    <div className="section-title">Bidding</div>
    <div className="section-note">
      We'll optimize your bid for the metric you want to focus on.
    </div>
    <div className="field-row">
      <div className="field-wrapper">
        <div className="field-name">
          Bid optimization
        </div>
        <Select
          options={opList}
          components={{ Option }}
          value={info.bidOp}
          onChange={(option) => { onChange('bidOp', option) }}
        />
      </div>
      <div className="field-wrapper">
        <div className="field-name">
          Default bid
        </div>
        <input
          type="number"
          value={info.defaultBid}
          onChange={(event) => { onChange('defaultBid', event.target.value) }}
        />
        {
          parseFloat(info.defaultBid) >= parseFloat(dailyBudget) / 2 && (
            <div className="bid-warning">
              Bid must be less than half the value of your budget.
            </div>
          )
        }
      </div>
    </div>
  </div>
)

export default SDBidSection
