import React from 'react'

import OpKeywordAdvancedSetting from './OpKeywordAdvancedSetting'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

// Very High ACoS Targets
const OpKeywordAcos = ({ field, settings, onChange, ...props }) => (
  <>
    <OpKeywordAdvancedSetting
      field={field}
      isOriginal
      tooltip="These are targets that have an ACoS that is very high but still have sales. You may wish to pause or lower bids."
      settings={settings}
      onChange={onChange}
      {...props}
    >
      <FieldRow>
        <FieldNumber
          label="ACoS (%)"
          suffix="or higher"
          field="increase_adv_byacos_threshold"
          settings={settings}
          onChange={onChange}
        />
        <FieldNumber
          label="With at least this many clicks"
          field="increase_adv_percentbid_click_threshold"
          settings={settings}
          onChange={onChange}
        />
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
              label="ACoS (%)"
              suffix="or higher"
              field="copy_increase_adv_byacos_threshold"
              settings={settings}
              onChange={onChange}
            />
            <FieldNumber
              label="With at least this many clicks"
              field="copy_increase_adv_percentbid_click_threshold"
              settings={settings}
              onChange={onChange}
            />
          </FieldRow>
        </OpKeywordAdvancedSetting>
      )
    }
  </>
)

export default OpKeywordAcos
