import React from 'react'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import Lookback from './Lookback'
import SubSection from './SubSection'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

const unitList = [
  { value: '%', label: '%' },
  { value: '$', label: '$' },
]

const ExKeyword = ({ settings, onChange, ...props }) => {
  const validate = field => () => {
    if (settings[field] === ''
      || isNaN(settings[field])
      || parseFloat(settings[field]) < 0) {
      onChange(field, 0)
    }
  }

  const unitImpression = unitList.find(unit => unit.value === settings.zero_impression_sing)

  return (
    <SubSection name="Target Bid Expansion" {...props}>
      <div className="checkbox-info-wrapper">
        <CheckboxComponent
          label="Low impression targets"
          checked={settings.increase_percentbid_byimpression_isactive}
          onChange={(checked) => { onChange('increase_percentbid_byimpression_isactive', checked) }}
        />
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            If targets have zero or low impressions over the set lookback period,
            Entourage will increase bid prices to help boost visibility
            for those targets. This feature will run daily.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
      <FieldRow disabled={!settings.increase_percentbid_byimpression_isactive}>
        <FieldNumber
          label="If target has impressions less than"
          field="increase_percentbid_byimpression_threshold"
          settings={settings}
          onChange={onChange}
        />
        <div className="field-wrapper">
        </div>
      </FieldRow>
      <FieldRow disabled={!settings.increase_percentbid_byimpression_isactive}>
        <div className="field-wrapper unit-selector">
          <div className="field-name">
            Increase bid by
          </div>
          <div className="unit-selector-inner">
            <Select
              value={unitImpression}
              options={unitList}
              placeholder="Unit"
              onChange={(selected) => { onChange('zero_impression_sing', selected.value) }}
            />
            <input
              type="number"
              min="0"
              value={settings.increase_percentbid_byimpression_amount}
              onChange={(event) => { onChange('increase_percentbid_byimpression_amount', event.target.value) }}
              onBlur={validate('increase_percentbid_byimpression_amount')}
            />
          </div>
        </div>
        <FieldNumber
          label="Max bid value"
          field="increase_percentbid_byimpression_maxmoney"
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <Lookback field="pt_day_used_auto_pilot" settings={settings} onChange={onChange} />
    </SubSection>
  )
}

export default ExKeyword
