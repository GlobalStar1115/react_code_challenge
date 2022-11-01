import React, { useState } from 'react'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import NegativeTargetingModal from './NegativeTargetingModal'

const NegativeTargetingSection = ({ negativeTargetings, onChange }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleRemove = (product) => {
    onChange(negativeTargetings.filter(item => JSON.stringify(item) !== JSON.stringify(product)))
  }

  const renderNegativeTargetings = () => {
    if (!negativeTargetings.length) {
      return (
        <div className="no-product-desc">
          No negative product added.
        </div>
      )
    }

    return (
      <div className="targeting-list">
        {
          negativeTargetings.map(target => (
            <div key={target.type === 'product' ? target.ASIN : target.id} className="targeting-item">
              <div className="targeting-info">
                <div className="targeting-name">
                  { target.type === 'product' ? 'Product' : 'Brand' }:&nbsp;
                  { target.name }
                </div>
                {
                  target.type === 'product' && (
                    <div className="targeting-meta">
                      ASIN: { target.ASIN }
                    </div>
                  )
                }
              </div>
              <div className="targeting-action">
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
        <span>Optional: Negative Products</span>
        <div>
          <button type="button" className="btn btn-blue" onClick={() => setOpenModal(true)}>
            Exclude by Category/Brand
          </button>
          {
            negativeTargetings.length > 0 && (
              <button type="button" className="btn btn-red" onClick={() => { onChange([]) }}>
                Remove All
              </button>
            )
          }
        </div>
      </div>
      <div className="section-note">
        Negative product targeting prevents your ads from displaying when a shopper's search
        matches your negative product selections. This helps exclude irrelevant searches,
        reducing your advertising cost.
      </div>
      { renderNegativeTargetings() }
      <NegativeTargetingModal
        show={openModal}
        negativeTargetings={negativeTargetings}
        onChange={onChange}
        onClose={() => { setOpenModal(false) }}
      />
    </div>
  )
}

export default NegativeTargetingSection
