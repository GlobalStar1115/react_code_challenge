import React from 'react'

import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'

const typeList = [
  {
    value: 'keyword',
    name: 'Keyword targeting',
    description: 'Choose keywords to help your products appear in shopper searches.',
  },
  {
    value: 'product',
    name: 'Product targeting',
    description: 'Choose specific products, categories, brands, or other product features to target your ads.',
  },
]

const ManualTargetingSelector = ({ manualTarget, onChange }) => (
  <div className="targeting-type-selector">
    <div className="section-title">Manual Targeting Option</div>
    <div className="section-note">
      Targeting uses keywords and products to help your ads appear in search and detail pages.
    </div>
    <div className="selector-wrapper">
      {
        typeList.map(type => (
          <div
            key={type.value}
            className={`selector${manualTarget === type.value ? ' selected' : ''}`}
            onClick={() => onChange(type.value)}
          >
            <CheckSvg />
            <div className="selector-content">
              <div className="selector-title">{ type.name }</div>
              <div className="selector-note">{ type.description }</div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
)

export default ManualTargetingSelector
