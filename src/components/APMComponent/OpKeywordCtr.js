import React from 'react'

import OpKeywordAdvancedSetting from './OpKeywordAdvancedSetting'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

// Low CTR Targets
const OpKeywordCtr = ({ field, settings, onChange, ...props }) => (
  <>
    <OpKeywordAdvancedSetting
      field={field}
      isOriginal
      settings={settings}
      onChange={onChange}
      {...props}
    >
      <FieldRow>
        <FieldNumber
          label="Minimum impressions to trigger"
          field="increase_adv_byimpression_min"
          settings={settings}
          onChange={onChange}
        />
        <FieldNumber
          label="CTR targets (%)"
          suffix="or less"
          field="increase_adv_ctr_byimpression_threshold"
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
              label="Minimum impressions to trigger"
              field="copy_increase_adv_byimpression_min"
              settings={settings}
              onChange={onChange}
            />
            <FieldNumber
              label="CTR targets (%)"
              suffix="or less"
              field="copy_increase_adv_ctr_byimpression_threshold"
              settings={settings}
              onChange={onChange}
            />
          </FieldRow>
        </OpKeywordAdvancedSetting>
      )
    }
  </>
)

export default OpKeywordCtr
