import React from 'react'

import OpKeywordAdvancedSetting from './OpKeywordAdvancedSetting'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

// Unprofitable Targets
const OpKeywordProfit = ({ field, settings, onChange, ...props }) => {
  const validateAcos = acosField => () => {
    if (settings[acosField] === ''
      || isNaN(settings[acosField])
      || parseFloat(settings[acosField]) < 0) {
      onChange(acosField, 0)
    }
  }

  return (
    <>
      <OpKeywordAdvancedSetting
        field={field}
        isOriginal
        tooltip="These are targets that are close to your target ACoS and can use some bid adjustments. The Max CPC action setting is ideal for this."
        settings={settings}
        onChange={onChange}
        {...props}
      >
        <FieldRow>
          <div className="field-wrapper">
            <div className="field-name">
              ACoS % Between (%)
            </div>
            <input
              type="number"
              className="shrinked-input"
              min="0"
              value={settings['increase_adv_percentacos_threshold']}
              onChange={(event) => { onChange('increase_adv_percentacos_threshold', event.target.value) }}
              onBlur={validateAcos('increase_adv_percentacos_threshold')}
            />
            <span className="input-desc">to</span>
            <input
              type="number"
              className="shrinked-input"
              min="0"
              value={settings['increase_adv_percentbid_byacos_threshold']}
              onChange={(event) => { onChange('increase_adv_percentbid_byacos_threshold', event.target.value) }}
              onBlur={validateAcos('increase_adv_percentbid_byacos_threshold')}
            />
            {
              parseFloat(settings['increase_adv_percentacos_threshold'])
              > parseFloat(settings['increase_adv_percentbid_byacos_threshold']) && (
                <div className="acos-warning">
                  Please enter a valid ACoS range.
                </div>
              )
            }
          </div>
          <FieldNumber
            label="With at least this many clicks"
            field="increase_adv_percentbid_byacos_click_threshold"
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
              <div className="field-wrapper">
                <div className="field-name">
                  ACoS % Between (%)
                </div>
                <input
                  type="number"
                  className="shrinked-input"
                  min="0"
                  value={settings['copy_increase_adv_percentacos_threshold']}
                  onChange={(event) => { onChange('copy_increase_adv_percentacos_threshold', event.target.value) }}
                  onBlur={validateAcos('copy_increase_adv_percentacos_threshold')}
                />
                <span className="input-desc">to</span>
                <input
                  type="number"
                  className="shrinked-input"
                  min="0"
                  value={settings['copy_increase_adv_percentbid_byacos_threshold']}
                  onChange={(event) => { onChange('copy_increase_adv_percentbid_byacos_threshold', event.target.value) }}
                  onBlur={validateAcos('copy_increase_adv_percentbid_byacos_threshold')}
                />
                {
                  parseFloat(settings['copy_increase_adv_percentacos_threshold'])
                  > parseFloat(settings['copy_increase_adv_percentbid_byacos_threshold']) && (
                    <div className="acos-warning">
                      Please enter a valid ACoS range.
                    </div>
                  )
                }
              </div>
              <FieldNumber
                label="With at least this many clicks"
                field="copy_increase_adv_percentbid_byacos_click_threshold"
                settings={settings}
                onChange={onChange}
              />
            </FieldRow>
          </OpKeywordAdvancedSetting>
        )
      }
    </>
  )
}

export default OpKeywordProfit
