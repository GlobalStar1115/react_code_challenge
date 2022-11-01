import React from 'react'

import Section from './Section'
import ExKeyword from './ExKeyword'
import ExST from './ExST'
import ExProduct from './ExProduct'

const SUBSECTION_KEYWORD = 'keyword'
const SUBSECTION_ST = 'st'
const SUBSECTION_PRODUCT = 'product'

const ExSection = (props) => {
  const { campaign } = props

  let isSB = false
  let isSD = false
  let hasKeywordAdgroups = true
  let hasProductAdgroups = true
  if (campaign) {
    isSB = campaign.basic[0].type === 'sb' || campaign.basic[0].type === 'sbv'
    // For Sponsored Displays, Search Term Expansion is disabled.
    isSD = campaign.basic[0].type === 'sd'

    hasKeywordAdgroups = campaign.keywordAdgroups.length !== 0
    hasProductAdgroups = campaign.productAdgroups.length !== 0
  }

  return (
    <Section>
      <ExKeyword id={SUBSECTION_KEYWORD} {...props} />
      { !isSD && (isSB || hasKeywordAdgroups) && <ExST id={SUBSECTION_ST} {...props} /> }
      { (isSB || hasProductAdgroups) && <ExProduct id={SUBSECTION_PRODUCT} {...props} /> }
    </Section>
  )
}

export default ExSection
