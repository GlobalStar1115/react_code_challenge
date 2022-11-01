import React from 'react'

const FREQUENCY_DAILY = 'daily'
const FREQUENCY_WEEKLY = 'weekly'
// FIXME: Make this as monthly.
const FREQUENCY_MONTHLY = 'month'

const frequenceTypeLabels = {
  [FREQUENCY_DAILY]: 'Daily',
  [FREQUENCY_WEEKLY]: 'Weekly',
  [FREQUENCY_MONTHLY]: 'Monthly',
}

const dowList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Frequency = ({ details, prefix }) => {
  const frequency = details[`${prefix}frequency_type`]
  let label = frequenceTypeLabels[frequency]
  if (frequency === FREQUENCY_WEEKLY) {
    try {
      if (details[`${prefix}freq_weekly`]) {
        const weekly = JSON.parse(details[`${prefix}freq_weekly`])
        const dowSelected = []
        weekly.forEach((dow) => {
          if (dow !== null) {
            dowSelected.push(dowList[dow])
          }
        })
        if (dowSelected.length) {
          label = `${label} (${dowSelected.join(', ')})`
        }
      }
    } catch (e) {
      //
    }
  } else if (frequency === FREQUENCY_MONTHLY && details[`${prefix}freq_month_day`]) {
    label = `${label} (${details[`${prefix}freq_month_day`]})`
  }
  return (
    <span>{ label }</span>
  )
}

export default Frequency
