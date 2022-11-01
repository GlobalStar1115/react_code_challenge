import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import OpKeywordSale from './OpKeywordSale'
import OpKeywordCtr from './OpKeywordCtr'
import OpKeywordConvert from './OpKeywordConvert'
import OpKeywordAcos from './OpKeywordAcos'
import OpKeywordProfit from './OpKeywordProfit'

const OpKeywordAdvanced = props => (
  <div className="keyword-advanced-container">
    <label className="container-label">
      Advanced Settings
      <Whisper placement="left" trigger="hover" speaker={(
        <Tooltip>
          Advanced settings allow you to create custom lookback periods
          and frequency settings for a variety of useful optimization strategies.
          You can also create a clone of each setting, allowing you
          to run multiple optimizations over different lookback periods.
          Advanced settings will override basic settings.
        </Tooltip>
      )}>
        <InfoSvg />
      </Whisper>
    </label>
    <OpKeywordSale
      name="Zero Sale Targets"
      field="zero_adv_byclick_isactive"
      frequencyField="adv_byclick_frequency_type"
      frequencyWeeklyValueField="adv_byclick_freq_weekly"
      frequencyMonthlyValueField="adv_byclick_freq_month_day"
      lookbackField="adv_byclick_lookback_period"
      actionField="adv_byclick_automated_rule"
      actionValueField="adv_byclick_automated_rule_value"
      {...props}
    />
    <OpKeywordAcos
      name="Very High ACoS Targets"
      field="unprofitable_adv_isactive"
      frequencyField="adv_unprofitable_frequency_type"
      frequencyWeeklyValueField="adv_unprofitable_freq_weekly"
      frequencyMonthlyValueField="adv_unprofitable_freq_month_day"
      lookbackField="adv_unprofitable_lookback_period"
      actionField="adv_unprofitable_automated_rule"
      actionValueField="adv_unprofitable_automated_rule_value"
      {...props}
    />
    <OpKeywordProfit
      name="Unprofitable Targets"
      field="unprofitable_adv_targets_isactive"
      frequencyField="adv_unprofitable_targets_frequency_type"
      frequencyWeeklyValueField="adv_unprofitable_targets_freq_weekly"
      frequencyMonthlyValueField="adv_unprofitable_targets_freq_month_day"
      lookbackField="adv_unprofitable_targets_lookback_period"
      actionField="adv_unprofitable_targets_automated_rule"
      actionValueField="adv_unprofitable_targets_automated_rule_value"
      {...props}
    />
    <OpKeywordCtr
      name="Low CTR Targets"
      field="low_adv_byctr_isactive"
      frequencyField="adv_byimpression_frequency_type"
      frequencyWeeklyValueField="adv_byimpression_freq_weekly"
      frequencyMonthlyValueField="adv_byimpression_freq_month_day"
      lookbackField="adv_byimpression_lookback_period"
      actionField="adv_byimpression_automated_rule"
      actionValueField="adv_byimpression_automated_rule_value"
      {...props}
    />
    <OpKeywordConvert
      name="Low Converting Targets"
      field="low_adv_converting_isactive"
      frequencyField="adv_lowconverting_frequency_type"
      frequencyWeeklyValueField="adv_lowconverting_freq_weekly"
      frequencyMonthlyValueField="adv_lowconverting_freq_month_day"
      lookbackField="adv_lowconverting_lookback_period"
      actionField="adv_lowconverting_automated_rule"
      actionValueField="adv_lowconverting_automated_rule_value"
      {...props}
    />
  </div>
)

export default OpKeywordAdvanced
