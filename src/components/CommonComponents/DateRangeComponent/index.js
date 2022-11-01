import React, { useRef } from 'react'
import moment from 'moment'

import {
  DateRangePicker,
} from 'rsuite'

const DateRangeComponent = ({ disabled, placeholder = '', placement = 'bottomStart', value, onChange }) => {
  const rangeContainerRef = useRef(null)
  const startDayOfMonth = moment().startOf('month').toDate()
  const endDayOfMonth = moment().endOf('month').toDate()
  const endDayOfLastMonth = moment(startDayOfMonth).subtract(1, 'day').endOf('month').toDate()
  const startDayofLastMonth = moment(startDayOfMonth).subtract(1, 'day').startOf('month').toDate()

  const ranges = [
    {
      label: 'Last 30 Days',
      value: [moment().startOf('day').subtract(29, 'day').toDate(), moment().endOf('day').toDate()]
    },
    {
      label: 'This Month',
      value: [startDayOfMonth, endDayOfMonth]
    },
    {
      label: 'Last Month',
      value: [startDayofLastMonth, endDayOfLastMonth]
    },
    {
      label: 'Last 60 Days',
      value: [moment().startOf('day').subtract(59, 'day').toDate(), moment().endOf('day').toDate()]
    },
    {
      label: 'Last 90 Days',
      value: [moment().startOf('day').subtract(89, 'day').toDate(), moment().endOf('day').toDate()]
    },
    {
      label: 'Last 120 Days',
      value: [moment().startOf('day').subtract(119, 'day').toDate(), moment().endOf('day').toDate()]
    },
  ]

  return (
    <div className="date-range-component" ref={rangeContainerRef}>
      <DateRangePicker
        ranges={ranges}
        disabled={disabled}
        placeholder={placeholder}
        placement={placement}
        value={value ? [moment(value[0]).startOf('day').toDate(), moment(value[1]).endOf('day').toDate()] : ranges[0].value}
        onChange={onChange}
        container={rangeContainerRef.current}
      />
    </div>
  )
}

export default DateRangeComponent
