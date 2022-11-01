import React from 'react'

import SubSection from './SubSection'
import OpNTA from './OpNTA'
import OpNPT from './OpNPT'

const OpNegative = ({ campaign, settings, onChange, ...props }) => {
  let isAuto = false
  let hasProductAdgroups = true
  if (campaign) {
    isAuto = campaign.basic[0].targeting_type === 'auto'
    hasProductAdgroups = campaign.productAdgroups.length !== 0
  }

  return (
    <SubSection name="Negative Target Automation" {...props}>
      <OpNTA
        isOriginal
        campaign={campaign}
        settings={settings}
        onChange={onChange}
      />
      {
        settings.copy_nta_isactive && (
          <OpNTA
            campaign={campaign}
            settings={settings}
            onChange={onChange}
          />
        )
      }
      {
        !isAuto && hasProductAdgroups && (
          <OpNPT
            isOriginal
            settings={settings}
            onChange={onChange}
          />
        )
      }
      {
        !isAuto && hasProductAdgroups && settings.copy_npt_byclick_isactive && (
          <OpNPT
            settings={settings}
            onChange={onChange}
          />
        )
      }
    </SubSection>
  )
}

export default OpNegative
