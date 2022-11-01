import React, { useState } from 'react'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import AudienceModal from './AudienceModal'

const AudienceSection = ({ targetings, dailyBudget, defaultBid, onChange }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleBidChange = (event, target) => {
    onChange(targetings.map((item) => {
      if (item.id === target.id) {
        return {
          ...item,
          bid: event.target.value,
        }
      }
      return item
    }))
  }

  const handleRemove = (target) => {
    onChange(targetings.filter(item => {
      if (target.type !== item.type) {
        return true
      }
      return target.id !== item.id
    }))
  }

  const getTargetingName = (target) => {
    if (target.type === 'audience_category' || target.type === 'audience_refine') {
      return `Category: ${target.name}`
    }
    if (target.type === 'audience_product') {
      return target.name
    }
    if (target.type === 'audience') {
      return `Audiences: ${target.name}`
    }
  }

  const renderTargetings = () => {
    if (!targetings.length) {
      return (
        <div className="no-targeting-desc">
          No targeting added.
        </div>
      )
    }

    return (
      <div className="targeting-list">
        {
          targetings.map(target => (
            <div key={target.id} className="targeting-item">
              <div className="targeting-info">
                <div className="targeting-name">
                  { getTargetingName(target) }
                </div>
                {
                  target.type !== 'audience' && (
                    <div className="targeting-meta">
                      Lookback: 30 days
                    </div>
                  )
                }
                {
                  target.type === 'audience_refine' && (
                    <div className="targeting-meta">
                      Brand: { target.brandName }
                    </div>
                  )
                }
              </div>
              <div className="targeting-action">
                <div>
                  <input
                    type="number"
                    value={target.bid}
                    onChange={(event) => { handleBidChange(event, target) }}
                  />
                  {
                    parseFloat(target.bid) >= parseFloat(dailyBudget) / 2 && (
                      <div className="budget-warning">
                        Bid must be less than half the value of your budget.
                      </div>
                    )
                  }
                </div>
                <CloseSvg title="Remove" onClick={() => { handleRemove(target) }}/>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="section-title">
        <span>Audiences</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => { setOpenModal(true) }}
          >
            Customize
          </button>
          {
            targetings.length > 0 && (
              <button type="button" className="btn btn-red" onClick={() => { onChange([]) }}>
                Remove All
              </button>
            )
          }
        </div>
      </div>
      <div className="section-note">
        Reach audiences based on product detail page views, or use our prebuilt audience segments.
      </div>
      { renderTargetings() }
      <AudienceModal
        show={openModal}
        defaultBid={defaultBid}
        targetings={targetings}
        onChange={onChange}
        onClose={() => { setOpenModal(false) }}
      />
    </div>
  )
}

export default AudienceSection
