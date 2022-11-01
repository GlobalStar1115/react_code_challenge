import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import Lookback from './Lookback'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'

const OpKeywordBasic = ({ campaign, settings, onChange }) => {
  let isAutoSP = false
  if (campaign) {
    // For auto targeting Sponsored Products, Advanced settings are disabled.
    isAutoSP = campaign.basic[0].type === 'sp'
      && campaign.basic[0].targeting_type === 'auto'
  }

  return (
    <div>
      {
        !isAutoSP && (
          <label className="container-label">
            Basic Settings
          </label>
        )
      }
      <div className="checkbox-info-wrapper">
        <CheckboxComponent
          label="We'll update individual target bids daily"
          checked={settings.basic_isactive}
          onChange={(checked) => { onChange('basic_isactive', checked) }}
        />
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            Set Target ACoS along with the minimum and maximum bid allowed.<br />
            Our system will automatically adjust (raise or lower bids)
            for each individual target to meet your Target ACoS.<br />
            You can also adjust the minimum click and impression thresholds
            that must be hit over the lookback period before our system takes action.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
      <FieldRow disabled={!settings.basic_isactive}>
        <FieldNumber
          label="Target ACoS"
          settings={settings}
          field="target_acos"
          tooltip="Bids will update daily and target this ACoS."
          onChange={onChange}
        />
        <FieldNumber
          label="Minimum Bid"
          settings={settings}
          field="minimum_bid"
          tooltip="The lowest possible bid price the smart pilot will drop the bid to for individual targets in this campaign/ad group."
          onChange={onChange}
        />
        <FieldNumber
          label="Maximum Bid"
          settings={settings}
          field="max_bid_price"
          tooltip="The highest possible bid price the smart pilot will raise the bid to for individual targets in this campaign/ad group."
          onChange={onChange}
        />
      </FieldRow>
      <FieldRow disabled={!settings.basic_isactive}>
        <FieldNumber
          label="Min Clicks"
          settings={settings}
          field="minimum_click"
          tooltip="The minimum number of clicks that an individual target must have  during the lookback period before the smart pilot takes action."
          onChange={onChange}
        />
        <FieldNumber
          label="Min Impressions"
          settings={settings}
          field="minimum_impression"
          tooltip="The minimum number of impressions that an individual target must have during the lookback period before the smart pilot takes action."
          onChange={onChange}
        />
        <div className="field-wrapper">
        </div>
      </FieldRow>
      <Lookback field="day_used_auto_pilot" settings={settings} onChange={onChange} />
    </div>
  )
}

export default OpKeywordBasic
