import React from 'react'
import moment from 'moment'

import DateRangeComponent from '../CommonComponents/DateRangeComponent'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'

const CheckDateRange = (props) => {
  const { label, field, startField, endField, settings, onChange } = props

  const handleRangeChange = (range) => {
    const newStart = new Date(moment(range[0]).format('YYYY-MM-DD 00:00 Z'))
    const newEnd = new Date(moment(range[1]).format('YYYY-MM-DD 00:00 Z'))

    onChange(startField, newStart)
    onChange(endField, newEnd)
  }

  return (
    <div className="check-date-range-container">
      <CheckboxComponent
        label={label}
        checked={settings[field]}
        onChange={(checked) => { onChange(field, checked) }}
      />
      <DateRangeComponent
        disabled={!settings[field]}
        placeholder="Choose date range"
        value={[settings[startField], settings[endField]]}
        onChange={handleRangeChange}
      />
    </div>
  )
}

export default CheckDateRange
