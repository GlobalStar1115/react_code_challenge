/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as CloneSvg } from '../../assets/svg/clone.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import Frequency from './Frequency'
import Lookback from './Lookback'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

/**
 * @param {bool} isOriginal `true` if a setting is an original one,
 *                          `false` if it's a cloned one.
 */
const OpNPT = ({ isOriginal, settings, onChange }) => {
  // For a copied setting, prefix all field names with `copy_`.
  const getFieldName = name => (
    isOriginal ? name : `copy_${name}`
  )

  // Handle clicking on 'Clone'.
  const handleClone = (event) => {
    event.preventDefault()
    onChange('copy_npt_byclick_isactive', true)
  }

  const toggleField = settings[getFieldName('npt_byclick_isactive')]

  return (
    <div className="negative-product-targeting-section">
      <div className="setting-header">
        <CheckboxComponent
          label={`Negative Product Targeting Smart Pilot${!isOriginal ? ' (clone)' : ''}`}
          labelClassName="checkbox-label"
          checked={toggleField}
          onChange={(checked) => { onChange(getFieldName('npt_byclick_isactive'), checked) }}
        />
        {
          isOriginal && (
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                For Campaigns containing a Product Targeting ad group,
                you may automate finding ASINs to add as a negative target.
                This section will only apply to ad groups within this campaign
                that are set up for Product Targeting.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          )
        }
        {
          isOriginal && !settings.copy_npt_byclick_isactive && (
            <a href="#" className="clone-button" onClick={handleClone}>
              <CloneSvg />
              Clone
            </a>
          )
        }
      </div>
      <FieldRow disabled={!toggleField}>
        <FieldNumber
          field={getFieldName('npt_byclick_threshold')}
          label="Automatically negate ASINs if it has"
          suffix="Click(s) without sale"
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <Frequency
        disabled={!toggleField}
        field={getFieldName('npt_frequency_type')}
        weeklyField={getFieldName('npt_freq_weekly')}
        monthlyField={getFieldName('npt_freq_month_day')}
        settings={settings}
        onChange={onChange}
      />
      <Lookback
        disabled={!toggleField}
        field={getFieldName('npt_lookback')}
        settings={settings}
        onChange={onChange}
      />
    </div>
  )
}

export default OpNPT
