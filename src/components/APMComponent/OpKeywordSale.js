import React from 'react'

import OpKeywordAdvancedSetting from './OpKeywordAdvancedSetting'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

// Zero Sale Targets
const OpKeywordSale = ({ field, settings, onChange, ...props }) => (
  <>
    <OpKeywordAdvancedSetting
      field={field}
      isOriginal
      tooltip="These are targets that have clicks but zero sales over the selected lookback period. You may wish to pause or lower bids."
      settings={settings}
      onChange={onChange}
      {...props}
    >
      <FieldRow>
        <FieldNumber
          label="Clicks and no sales"
          field="zero_adv_byclick_threshold"
          settings={settings}
          onChange={onChange}
        />
        <div className="field-wrapper">
        </div>
      </FieldRow>
    </OpKeywordAdvancedSetting>
    {
      settings[`copy_${field}`] && (
        <OpKeywordAdvancedSetting
          field={field}
          settings={settings}
          onChange={onChange}
          {...props}
        >
          <FieldRow>
            <FieldNumber
              label="Clicks and no sales"
              field="copy_zero_adv_byclick_threshold"
              settings={settings}
              onChange={onChange}
            />
            <div className="field-wrapper">
            </div>
          </FieldRow>
        </OpKeywordAdvancedSetting>
      )
    }
  </>
)

export default OpKeywordSale
