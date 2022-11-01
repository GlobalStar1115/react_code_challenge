import React from 'react'

import Frequency from './Frequency'

const settings = [
  {
    setting: 'zero_adv_byclick_isactive',
    name: 'Zero Sale Targets',
    fields: [
      { field: 'zero_adv_byclick_threshold', name: 'Clicks and no sales' },
    ],
    prefix: 'adv_byclick_',
  },
  {
    setting: 'copy_zero_adv_byclick_isactive',
    name: 'Zero Sale Targets (clone)',
    fields: [
      { field: 'copy_zero_adv_byclick_threshold', name: 'Clicks and no sales' },
    ],
    prefix: 'copy_adv_byclick_',
  },
  {
    setting: 'unprofitable_adv_isactive',
    name: 'Very High ACoS Targets',
    fields: [
      { field: 'increase_adv_byacos_threshold', name: 'ACoS' },
      { field: 'increase_adv_percentbid_click_threshold', name: 'With at least this many clicks' },
    ],
    prefix: 'adv_unprofitable_',
  },
  {
    setting: 'copy_unprofitable_adv_isactive',
    name: 'Very High ACoS Targets (clone)',
    fields: [
      { field: 'copy_increase_adv_byacos_threshold', name: 'ACoS' },
      { field: 'copy_increase_adv_percentbid_click_threshold', name: 'With at least this many clicks' },
    ],
    prefix: 'copy_adv_unprofitable_',
  },
  {
    setting: 'unprofitable_adv_targets_isactive',
    name: 'Unprofitable Targets',
    fields: [
      { field: 'increase_adv_percentacos_threshold', name: 'ACoS from' },
      { field: 'increase_adv_percentbid_byacos_threshold', name: 'to' },
      { field: 'increase_adv_percentbid_byacos_click_threshold', name: 'With at least this many clicks' },
    ],
    prefix: 'adv_unprofitable_targets_',
  },
  {
    setting: 'copy_unprofitable_adv_targets_isactive',
    name: 'Unprofitable Targets (clone)',
    fields: [
      { field: 'copy_increase_adv_percentacos_threshold', name: 'ACoS from' },
      { field: 'copy_increase_adv_percentbid_byacos_threshold', name: 'to' },
      { field: 'copy_increase_adv_percentbid_byacos_click_threshold', name: 'With at least this many clicks' },
    ],
    prefix: 'copy_adv_unprofitable_targets_',
  },
  {
    setting: 'low_adv_byctr_isactive',
    name: 'Low CTR Targets',
    fields: [
      { field: 'increase_adv_byimpression_min', name: 'Minimum impressions to trigger' },
      { field: 'increase_adv_ctr_byimpression_threshold', name: 'CTR targets' },
    ],
    prefix: 'adv_byimpression_',
  },
  {
    setting: 'copy_low_adv_byctr_isactive',
    name: 'Low CTR Targets (clone)',
    fields: [
      { field: 'copy_increase_adv_byimpression_min', name: 'Minimum impressions to trigger' },
      { field: 'copy_increase_adv_ctr_byimpression_threshold', name: 'CTR targets' },
    ],
    prefix: 'copy_adv_byimpression_',
  },
  {
    setting: 'low_adv_converting_isactive',
    name: 'Low Converting Targets',
    fields: [
      { field: 'increase_adv_conversion_threshold', name: 'Conversion or less' },
    ],
    prefix: 'adv_lowconverting_',
  },
  {
    setting: 'copy_low_adv_converting_isactive',
    name: 'Low Converting Targets (clone)',
    fields: [
      { field: 'copy_increase_adv_conversion_threshold', name: 'Conversion or less' },
    ],
    prefix: 'copy_adv_lowconverting_',
  },
]

const OpKeywordAdvanced = ({ details }) => {
  const renderAdvSetting = ({ setting, name, fields, prefix }) => {
    if (!details[setting]) {
      return null
    }

    const action = details[`${prefix}automated_rule`]

    return (
      <div key={setting} className="setting-subsection">
        <div className="subsection-name">
          { name }
        </div>
        {
          fields.map(field => (
            <div key={field.field} className="setting-wrapper">
              { field.name }:
              <span className="setting-value">{ details[field.field] }</span>
            </div>
          ))
        }
        <div className="setting-wrapper">
          Frequency:
          <span className="setting-value">
            <Frequency details={details} prefix={prefix} />
          </span>
        </div>
        <div className="setting-wrapper">
          Lookback Period (days):
          <span className="setting-value">
            { details[`${prefix}lookback_period`] }
          </span>
        </div>
        {
          action !== null && action !== '' && action !== 'undefined' && (
            <div className="setting-wrapper">
              Action:
              <span className="setting-value">
                { action }
                {
                  (action === 'Lower Bid By %' || action === 'Lower Bid By $') && (
                    `: ${details[`${prefix}automated_rule_value`]}`
                  )
                }
              </span>
            </div>
          )
        }
      </div>
    )
  }

  return settings.map(renderAdvSetting)
}

export default OpKeywordAdvanced
