/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import FieldRow from './FieldRow'

const FREQUENCY_DAILY = 'daily'
const FREQUENCY_WEEKLY = 'weekly'
// FIXME: Make this as monthly.
const FREQUENCY_MONTHLY = 'month'

const Frequency = (props) => {
  const {
    disabled,
    field,
    weeklyField,
    monthlyField,
    settings,
    onChange,
  } = props

  const frequencyList = [
    { value: FREQUENCY_DAILY, label: 'Daily' },
    { value: FREQUENCY_WEEKLY, label: 'Weekly' },
    { value: FREQUENCY_MONTHLY, label: 'Monthly' },
  ]

  const dowList =  [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
  ]

  const monthList = []
  for (let day = 1; day <= 31; day += 1) {
    monthList.push({
      value: day,
      label: day,
    })
  }

  const weeklyValue = dowList.filter(dow => (
    (settings[weeklyField] || []).indexOf(dow.value) !== -1
  ))

  const monthlyValue = monthList.find(option => (
    option.value === parseInt(settings[monthlyField], 10)
  ))

  const handleWeeklyChange = (options) => {
    onChange(weeklyField, options.map(option => option.value))
  }

  const handleMonthlyChange = (option) => {
    onChange(monthlyField, option.value)
  }

  const renderValue = () => {
    if (settings[field] === FREQUENCY_WEEKLY) {
      return (
        <div key="weekly-value" className="field-wrapper no-label-wrapper">
          <Select
            className="select-wrapper"
            options={dowList}
            placeholder="Choose days of week."
            isMulti
            value={weeklyValue}
            onChange={handleWeeklyChange}
          />
        </div>
      )
    }

    if (settings[field] === FREQUENCY_MONTHLY) {
      return (
        <div key="monthly-value" className="field-wrapper no-label-wrapper">
          <Select
            className="select-wrapper"
            options={monthList}
            placeholder="Choose day of month."
            value={monthlyValue}
            onChange={handleMonthlyChange}
          />
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              Select which day of the month you'd like optimizations to occur.
              For example, if you choose '14,' your optimizations
              will take place on the 14th day of each month.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
      )
    }

    return (
      <div className="field-wrapper">
      </div>
    )
  }

  return (
    <FieldRow disabled={disabled}>
      <div className="field-wrapper">
        <div className="field-name">
          Frequency setting
        </div>
        <div className="frequency-list">
          {
            frequencyList.map(option => (
              <a
                href="#"
                key={option.value}
                className={`frequency-value ${option.value === settings[field] ? 'active' : ''}`}
                onClick={(event) => { event.preventDefault(); onChange(field, option.value) }}
              >
                { option.label }
              </a>
            ))
          }
        </div>
      </div>
      { renderValue() }
    </FieldRow>
  )
}

export default Frequency
