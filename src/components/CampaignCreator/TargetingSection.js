import React, { useState } from 'react'
import { useStore } from 'react-redux'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import TargetingModal from './TargetingModal'

const TargetingSection = ({ targetings, dailyBudget, isForSD, onChange }) => {
  const store = useStore()

  const { campaignCreator } = store.getState()
  const {
    isSPSuggestionsLoading,
    isSDSuggestionsLoading,
    suggestedSPCategories,
    suggestedSDCategories,
    suggestedSDProducts,
  } = campaignCreator

  const [openModal, setOpenModal] = useState(false)
  const [defaultBid, setDefaultBid] = useState(0.75)

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

  const handleDefaultBidApply = () => {
    onChange(targetings.map(item => ({
      ...item,
      bid: defaultBid,
    })))
  }

  const handleRemove = (target) => {
    onChange(targetings.filter(item => {
      if (target.type !== item.type) {
        return true
      }
      if (target.type === 'category') {
        return target.id !== item.id
      }
      return target.ASIN !== item.ASIN
    }))
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
            <div key={target.type === 'product' ? target.ASIN : `${target.id}-${target.brandId || ''}`} className="targeting-item">
              <div className="targeting-info">
                {
                  target.type !== 'product' && (
                    <div className="category-path">
                      { target.path }
                    </div>
                  )
                }
                <div className="targeting-name">
                  { target.type !== 'product' ? 'Category' : 'Product' }:&nbsp;
                  { target.name }
                </div>
                {
                  target.type === 'product' && (
                    <div className="targeting-meta">
                      ASIN: { target.ASIN }
                    </div>
                  )
                }
                {
                  target.type === 'refine' && (
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
                    !isForSD && (parseFloat(target.bid) > parseFloat(dailyBudget)) && (
                      <div className="budget-warning">
                        Exceeds daily budget.
                      </div>
                    )
                  }
                  {
                    isForSD && (parseFloat(target.bid) >= parseFloat(dailyBudget) / 2) && (
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
        <span>Products Targeting</span>
        <div>
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => { setOpenModal(true) }}
          >
            Find Categories/ASINs
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
        Help shoppers find your product by choosing categories, products,
        brands, or features related to your product.
      </div>
      <div className="default-bid-section">
        Default Bid:&nbsp;
        <input
          type="text"
          value={defaultBid}
          onChange={(event) => { setDefaultBid(event.target.value) }}
        />
        <button type="button" className="btn btn-blue" onClick={handleDefaultBidApply}>
          Apply
        </button>
      </div>
      { renderTargetings() }
      <TargetingModal
        show={openModal}
        defaultBid={defaultBid}
        targetings={targetings}
        isForSD={isForSD}
        isLoading={!isForSD ? isSPSuggestionsLoading : isSDSuggestionsLoading}
        suggestedCategories={!isForSD ? (suggestedSPCategories || []) : (suggestedSDCategories || [])}
        suggestedProducts={suggestedSDProducts}
        onChange={onChange}
        onClose={() => { setOpenModal(false) }}
      />
    </div>
  )
}

export default TargetingSection
