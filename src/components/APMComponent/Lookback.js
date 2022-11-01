import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import FieldRow from './FieldRow'

const lookbackList = [
  { value: 14, label: 14 },
  { value: 30, label: 30 },
  { value: 60, label: 60 },
  { value: 90, label: 90 },
]

const Lookback = ({ disabled = false, field, settings, onChange }) => {
  const [useCustom, setUseCustom] = useState(false)

  useEffect(() => {
    const days = lookbackList.map(option => option.value)
    // If a custom day is saved in DB, enable an input box
    // to enter a custom day.
    if (days.indexOf(settings[field]) === -1
      && !useCustom) {
      setUseCustom(true)
    }
  }, [settings[field]]) // eslint-disable-line

  const lookback = lookbackList.find(option => (
    option.value === settings[field]
  ))

  const handleLookbackChange = (item) => {
    onChange(field, item.value)
  }

  const handleCustomCheck = (checked) => {
    if (!checked) {
      const days = lookbackList.map(option => option.value)
      if (days.indexOf(settings[field]) === -1) {
        // If a custom day entered doesn't match any of predefined values
        // and an user decides not to use a custom day, select
        // the first of predefined values by default.
        onChange(field, days[0])
      }
    }
    setUseCustom(checked)
  }

  const validateCustom = () => {
    if (settings[field] === ''
      || isNaN(settings[field])
      || parseFloat(settings[field]) < 1) {
      onChange(field, 1)
    }
  }

  return (
    <div className="lookback-wrapper">
      <FieldRow disabled={disabled}>
        <div className="field-wrapper">
          <div className="field-name">
            Lookback Period (days)
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                The amount of historical days we'll use to make optimizations.
                By default, we add 3 days to this number for better data accuracy.
                For example: If you choose 30 days, we use data from 33 days ago up until 3 days ago.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
          <Select
            options={lookbackList}
            placeholder="Choose period"
            isDisabled={useCustom}
            value={lookback}
            onChange={handleLookbackChange}
          />
        </div>
        <div className="field-wrapper">
          <div className="field-name">
            Custom Lookback Period (days)
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                Basing automation changes on less than 14 days of data is
                only recommended if you have an aggressive budget
                with high ad spend. Automation with too little data
                may cause unintended effects.
              </Tooltip>
            )}>
              <InfoSvg
                style={{
                  display: useCustom && parseInt(settings[field] || 0, 10) < 14 ? 'block' : 'none',
                }}
              />
            </Whisper>
          </div>
          <div className="check-input-container">
            <CheckboxComponent
              checked={useCustom}
              onChange={handleCustomCheck}
            />
            <input
              type="number"
              min="0"
              value={useCustom ? settings[field] : ''}
              disabled={!useCustom}
              onChange={(event) => { onChange(field, event.target.value) }}
              onBlur={validateCustom}
            />
          </div>
        </div>
      </FieldRow>
    </div>
  )
}

export default Lookback
