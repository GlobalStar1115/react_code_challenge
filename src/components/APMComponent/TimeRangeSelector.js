import React, { useState, useEffect } from 'react'
import Select from 'react-select'

import FieldRow from './FieldRow'

const TimeRangeSelector = ({ disabled, settings, onChange }) => {
  const [startTime, setStart] = useState(0)
  const [endTime, setEnd] = useState(23)

  useEffect(() => {
    setStart(parseInt(settings.daily_off_start_hour, 10))
  }, [settings.daily_off_start_hour])

  useEffect(() => {
    setEnd(parseInt(settings.daily_off_end_hour, 10))
  }, [settings.daily_off_end_hour])

  const timeList = ['12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM',
    '04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM',
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM']

  const timeOptions = timeList.map((time, index) => ({
    value: index,
    label: time,
  }))

  const onStartChange = (time) => {
    setStart(time.value)
    onChange('daily_off_start_hour', time.value)
  }

  const onEndChange = (time) => {
    setEnd(time.value)
    onChange('daily_off_end_hour', time.value)
  }

  return (
    <FieldRow className="time-range-selector" disabled={disabled}>
      <div className="field-wrapper">
        <div className="field-name">
          Time period
        </div>
        <div className="time-selector-wrapper">
          <Select
            className="time-selector"
            options={timeOptions}
            value={timeOptions[startTime]}
            onChange={onStartChange}
          />
          <span>to</span>
          <Select
            className="time-selector"
            options={timeOptions}
            value={timeOptions[endTime]}
            onChange={onEndChange}
          />
        </div>
        {
          startTime >= endTime && (
            <div className="time-warning">
              The end time cannot be behind the start time.
            </div>
          )
        }
      </div>
    </FieldRow>
  )
}

export default TimeRangeSelector
