/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as CloneSvg } from '../../assets/svg/clone.svg'
import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import FieldRow from './FieldRow'
import Frequency from './Frequency'
import OpKeywordAdvancedAction from './OpKeywordAdvancedAction'

const OpKeywordAdvancedSetting = (props) => {
  const {
    name,
    field,
    frequencyField,
    frequencyWeeklyValueField,
    frequencyMonthlyValueField,
    lookbackField,
    actionField,
    actionValueField,
    tooltip = null,
    settings,
    // `true` if a setting is an original one,
    // `false` if it's a cloned one.
    isOriginal = false,
    onChange,
    children,
  } = props

  const lookbackList = [
    { value: 7, label: 7 },
    { value: 14, label: 14 },
    { value: 30, label: 30 },
    { value: 60, label: 60 },
    { value: 90, label: 90 },
  ]

  // For a copied setting, prefix all field names with `copy_`.
  const getFieldName = name => (
    isOriginal ? name : `copy_${name}`
  )

  const lookback = lookbackList.find(option => (
    option.value === settings[getFieldName(lookbackField)]
  ))

  // Handle clicking on 'Clone'.
  const handleClone = (event) => {
    event.preventDefault()
    onChange(`copy_${field}`, true)
  }

  const handleLookbackChange = (item) => {
    onChange(getFieldName(lookbackField), item.value)
  }

  return (
    <div className="keyword-advanced-setting">
      <div className="setting-header">
        <CheckboxComponent
          label={isOriginal ? name : `${name} (clone)`}
          labelClassName="checkbox-label"
          checked={settings[getFieldName(field)]}
          onChange={(checked) => { onChange(getFieldName(field), checked) }}
        />
        {
          isOriginal && tooltip !== null && (
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                { tooltip }
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          )
        }
        {
          isOriginal && !settings[`copy_${field}`] && (
            <a href="#" className="clone-button" onClick={handleClone}>
              <CloneSvg />
              Clone
            </a>
          )
        }
      </div>
      <div className="setting-body">
        <Frequency
          disabled={!settings[getFieldName(field)]}
          field={getFieldName(frequencyField)}
          weeklyField={getFieldName(frequencyWeeklyValueField)}
          monthlyField={getFieldName(frequencyMonthlyValueField)}
          settings={settings}
          onChange={onChange}
        />
        {
          React.Children.map(children, child => (
            React.cloneElement(child, {
              disabled: !settings[getFieldName(field)],
            })
          ))
        }
        <FieldRow disabled={!settings[getFieldName(field)]}>
          <div className="field-wrapper">
            <div className="field-name">
              Lookback Period (days)
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  The amount of historical days we'll use to make optimizations.
                  By default, we add 3 days to this number for better data accuracy.
                  For example: If you choose 30 days, we use data from 33 days ago
                  up until 3 days ago.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
            <Select
              options={lookbackList}
              placeholder="Choose period"
              value={lookback}
              onChange={handleLookbackChange}
            />
          </div>
          <OpKeywordAdvancedAction
            actionField={getFieldName(actionField)}
            actionValueField={getFieldName(actionValueField)}
            settings={settings}
            onChange={onChange}
          />
        </FieldRow>
      </div>
    </div>
  )
}

export default OpKeywordAdvancedSetting
