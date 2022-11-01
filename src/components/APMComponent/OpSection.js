import React from 'react'

import Section from './Section'
import OpKeyword from './OpKeyword'
import OpNegative from './OpNegative'
import OpDayparting from './OpDayparting'
import OpTesting from './OpTesting'

const SUBSECTION_KEYWORD = 'keyword'
const SUBSECTION_NEGATIVE = 'negative'
const SUBSECTION_DAYPARTING = 'dayparting'
const SUBSECTION_TESTING = 'testing'

const OpSection = (props) => {
  const { campaign, settings } = props

  let isSD = false
  if (campaign) {
    // For Sponsored Displays, Negative Target Automation is disabled.
    isSD = campaign.basic[0].type === 'sd'
  }

  return (
    <Section>
      <OpKeyword id={SUBSECTION_KEYWORD} {...props} />
      { !isSD && <OpNegative id={SUBSECTION_NEGATIVE} {...props} /> }
      { !settings.adgroup_id && <OpDayparting id={SUBSECTION_DAYPARTING} {...props} /> }
      { !settings.adgroup_id && <OpTesting id={SUBSECTION_TESTING} {...props} /> }
    </Section>
  )
}

export default OpSection
