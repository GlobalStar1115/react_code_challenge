import React from 'react'

import SubSection from './SubSection'
import OpKeywordBasic from './OpKeywordBasic'
import OpKeywordAdvanced from './OpKeywordAdvanced'
import OpKeywordIgnore from './OpKeywordIgnore'

const OpKeyword = ({ settings, onChange, ...props }) => {
  const { campaign } = props

  let isAutoSP = false
  if (campaign) {
    // For auto targeting Sponsored Products, Advanced settings are disabled.
    isAutoSP = campaign.basic[0].type === 'sp'
      && campaign.basic[0].targeting_type === 'auto'
  }

  return (
    <SubSection name="Target Bid Optimization" {...props}>
      <OpKeywordBasic campaign={campaign} settings={settings} onChange={onChange} />
      { !isAutoSP && <OpKeywordAdvanced settings={settings} onChange={onChange} /> }
      { !isAutoSP && <OpKeywordIgnore field="ignore_keywords" settings={settings} onChange={onChange} /> }
    </SubSection>
  )
}

export default OpKeyword
