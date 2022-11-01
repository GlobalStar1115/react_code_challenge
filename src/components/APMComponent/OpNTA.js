/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as CloneSvg } from '../../assets/svg/clone.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import Frequency from './Frequency'
import Lookback from './Lookback'
import FieldRow from './FieldRow'
import CheckInput from './CheckInput'

/**
 * @param {bool} isOriginal `true` if a setting is an original one,
 *                          `false` if it's a cloned one.
 */
const OpNTA = ({ isOriginal = false, campaign, settings, onChange }) => {
  let isAuto = false
  let isSB = false
  if (campaign) {
    isAuto = campaign.basic[0].targeting_type === 'auto'
    isSB = campaign.basic[0].type === 'sb' || campaign.basic[0].type === 'sbv'
  }

  // For a copied setting, prefix all field names with `copy_`.
  const getFieldName = name => (
    isOriginal ? name : `copy_${name}`
  )

  // Handle clicking on 'Clone'.
  const handleClone = (event) => {
    event.preventDefault()
    onChange('copy_nta_isactive', true)
  }

  const toggleField = settings[getFieldName('nta_isactive')]

  return (
    <div className="nta-section">
      <div className="setting-header">
        <div className="checkbox-info-wrapper">
          <CheckboxComponent
            label={`Automatically negate search terms if it meets the following criteria${!isOriginal ? ' (clone)' : ''}`}
            checked={toggleField}
            onChange={(checked) => { onChange(getFieldName('nta_isactive'), checked) }}
          />
          {
            isOriginal && (
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  Negative exact match is used to negate search terms.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            )
          }
        </div>
        {
          isOriginal && !settings.copy_nta_isactive && (
            <a href="#" className="clone-button" onClick={handleClone}>
              <CloneSvg />
              Clone
            </a>
          )
        }
      </div>
      <FieldRow disabled={!toggleField}>
        <div className="field-wrapper checkbox-info-wrapper">
          <CheckboxComponent
            label="Add to campaign level"
            checked={settings[getFieldName('negative_campaignlevel_isactive')]}
            onChange={(checked) => { onChange(getFieldName('negative_campaignlevel_isactive'), checked) }}
          />
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              Campaign level negative targeting means the negated search term
              or ASIN will be negated for the entire campaign, including all ad groups.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        {
          !isSB ? (
            <div className="field-wrapper checkbox-info-wrapper">
              <CheckboxComponent
                label="Add to Ad Group level"
                checked={settings[getFieldName('negative_adgrouplevel_isactive')]}
                onChange={(checked) => { onChange(getFieldName('negative_adgrouplevel_isactive'), checked) }}
              />
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  Ad Group level negative targeting means the negated search term
                  or ASIN will be negated for the ad group that it originated from.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
          ) : (
            <div className="field-wrapper" />
          )
        }
      </FieldRow>
      {
        isAuto && (
          <FieldRow disabled={!toggleField}>
            <div className="field-wrapper checkbox-info-wrapper">
              <CheckboxComponent
                label="Add ASINS (Products) as negatives"
                checked={settings[getFieldName('add_asin_negatives_isactive')]}
                onChange={(checked) => { onChange(getFieldName('add_asin_negatives_isactive'), checked) }}
              />
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  In Automatic campaigns, ASINs (products) will appear in the search term report.
                  We'll automatically negate the ASINs that meet the criteria below.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
          </FieldRow>
        )
      }
      <FieldRow disabled={!toggleField}>
        <CheckInput
          label="Click(s) without sale"
          field={getFieldName('negative_byclick_isactive')}
          inputField={getFieldName('negative_byclick_threshold')}
          settings={settings}
          onChange={onChange}
        />
        <CheckInput
          label="Impressions without a click"
          field={getFieldName('negative_byimpression_isactive')}
          inputField={getFieldName('negative_byimpression_threshold')}
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <FieldRow disabled={!toggleField}>
        <CheckInput
          label="CTR (%) lower than"
          field={getFieldName('negative_byctr_isactive')}
          inputField={getFieldName('negative_byctr_threshold')}
          settings={settings}
          onChange={onChange}
        />
        <div className="field-wrapper">
        </div>
      </FieldRow>
      <Frequency
        disabled={!toggleField}
        field={getFieldName('nta_frequency_type')}
        weeklyField={getFieldName('nta_freq_weekly')}
        monthlyField={getFieldName('nta_freq_month_day')}
        settings={settings}
        onChange={onChange}
      />
      <Lookback
        disabled={!toggleField}
        field={getFieldName('nt_lookback')}
        settings={settings}
        onChange={onChange}
      />
    </div>
  )
}

export default OpNTA
