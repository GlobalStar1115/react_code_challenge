import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import SubSection from './SubSection'
import TimeRangeSelector from './TimeRangeSelector'
import CheckDateRange from './CheckDateRange'
import CheckTwoInput from './CheckTwoInput'

// FIXME: Use a current currency symbol for labels like `Increase per day ($)`.
const OpDayparting = ({ settings, onChange, ...props }) => {
  const dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const onDaySelect = (day) => {
    const days = [...settings.weekly_off_dates]
    const found = days.indexOf(day)
    if (found !== -1) {
      days.splice(found, 1)
    } else {
      days.push(day)
    }
    onChange('weekly_off_dates', days)
  }

  const onCheckChange = (field, value) => {
    onChange(field, value)

    // Two checkboxes are exclusive.
    if ((field === 'increase_constantbudget_season_isactive') && value) {
      onChange('increase_percentbudget_season_isactive', false)
    } else if ((field === 'increase_percentbudget_season_isactive') && value) {
      onChange('increase_constantbudget_season_isactive', false)
    }
  }

  return (
    <SubSection name="Dayparting/Seasonality" {...props}>
      <div className="subsection-desc">
        Entourage uses your local time zone.
      </div>
      <CheckboxComponent
        label="Turn ad off during a certain time of the day:"
        checked={settings.daily_off_isactive}
        onChange={(checked) => { onChange('daily_off_isactive', checked) }}
      />
      <div className={`day-list ${!settings.daily_off_isactive ? 'disabled' : ''}`}>
        {
          dayList.map((day, index) => (
            <button
              key={index}
              className={settings.weekly_off_dates.indexOf(index) !== -1 ? 'selected' : ''}
              onClick={() => { onDaySelect(index) }}
            >
              { day }
            </button>
          ))
        }
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            Days in green have dayparting restrictions applied.
            Ads will run at standard times for unselected (gray) days.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
      <TimeRangeSelector
        disabled={!settings.daily_off_isactive}
        settings={settings}
        onChange={onChange}
      />
      <CheckDateRange
        label="Turn ad off during a certain period of the year:"
        field="season_off_isactive"
        startField="season_off_start_date"
        endField="season_off_end_date"
        settings={settings}
        onChange={onChange}
      />
      <CheckDateRange
        label="Increase daily budget during certain times of the year:"
        field="season_budget_isactive"
        startField="season_budget_start_date"
        endField="season_budget_end_date"
        settings={settings}
        onChange={onChange}
      />
      <CheckTwoInput
        disabled={!settings.season_budget_isactive}
        label1="Increase per day ($)"
        label2="Max ($)"
        field="increase_constantbudget_season_isactive"
        inputField1="increase_constantbudget_season_amount"
        inputField2="increase_constantbudget_season_maxmoney"
        settings={settings}
        onChange={onCheckChange}
      />
      <CheckTwoInput
        disabled={!settings.season_budget_isactive}
        label1="Increase per day (%)"
        label2="Max ($)"
        field="increase_percentbudget_season_isactive"
        inputField1="increase_percentbudget_season_amount"
        inputField2="increase_percentbudget_season_maxmoney"
        settings={settings}
        onChange={onCheckChange}
      />
    </SubSection>
  )
}

export default OpDayparting
