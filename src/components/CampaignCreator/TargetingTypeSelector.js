import React from 'react'

import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'

const TargetingTypeSelector = ({ targetList, target, onChange }) => (
  <div className="targeting-type-selector">
    <div className="section-title">Targeting</div>
    <div className="selector-wrapper">
      {
        targetList.map(targetInfo => (
          <div
            key={targetInfo.value}
            className={`selector${target === targetInfo.value ? ' selected' : ''}`}
            onClick={() => onChange(targetInfo.value)}
          >
            <CheckSvg />
            <div className="selector-content">
              <div className="selector-title">{ targetInfo.name }</div>
              <div className="selector-note">{ targetInfo.description }</div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
)

export default TargetingTypeSelector
