import React from 'react'

import OpKeywordAdvancedSetting from './OpKeywordAdvancedSetting'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

// Low Converting Targets
const OpKeywordConvert = ({ field, settings, onChange, ...props }) => (
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
          label="Targets"
          suffix="% Conversion or less"
          field="increase_adv_conversion_threshold"
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
              label="Targets"
              suffix="% Conversion or less"
              field="copy_increase_adv_conversion_threshold"
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

export default OpKeywordConvert
