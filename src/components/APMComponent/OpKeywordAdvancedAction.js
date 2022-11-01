import React from 'react'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import FieldNumber from './FieldNumber'

const OpKeywordAdvancedAction = (props) => {
  const {
    actionField,
    actionValueField,
    settings,
    onChange,
  } = props

  // FIXME: Store integer constants, not strings.
  const actionList = [
    { value: 'Pause Keyword/Target', label: 'Pause Keyword/Target' },
    { value: 'Lower Bid By %', label: 'Lower Bid By %' },
    { value: 'Lower Bid By $', label: 'Lower Bid By $' },
    { value: 'Lower Bid to Max CPC', label: 'Change to Apply Genius Bid' },
  ]

  const action = actionList.find(option => (
    option.value === settings[actionField]
  ))

  const handleActionChange = (item) => {
    onChange(actionField, item.value)
  }

  return (
    <>
      <div className="field-wrapper">
        <div className="field-name">
          Action
          {
            settings[actionField] === 'Lower Bid to Max CPC' && (
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  Genius Bid takes into account your historical performance,
                  ACoS targets, Costs of Goods, and more.<br />
                  Genius Bid suggestions could be higher or lower than your current bid price
                  based on the ACoS targets you set.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            )
          }
        </div>
        <Select
          options={actionList}
          placeholder="Choose action"
          value={action}
          onChange={handleActionChange}
        />
      </div>
      {
        (settings[actionField] === 'Lower Bid By %' || settings[actionField] === 'Lower Bid By $')
        ? (
          <FieldNumber
            field={actionValueField}
            settings={settings}
            onChange={onChange}
          />
        ) : (
          <div className="field-wrapper">
          </div>
        )
      }
    </>
  )
}

export default OpKeywordAdvancedAction
