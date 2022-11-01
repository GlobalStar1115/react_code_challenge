import React, { useState } from 'react'

import ProductModal from './ProductModal'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

const ProductSection = ({ products, onChange }) => {
  const [openModal, setOpenModal] = useState(false)

  const handleRemove = (id) => {
    onChange(products.filter(product => product.id !== id), true)
  }

  const handleSelect = (products) => {
    setOpenModal(false)
    onChange(products, true)
  }

  const renderProducts = () => {
    if (!products.length) {
      return (
        <div className="no-product-desc">
          No product added.
        </div>
      )
    }

    return (
      <div className="product-container">
        {
          products.map((product) =>
            <div key={product.id} className="product-box">
              <CloseSvg title="Remove" onClick={() => { handleRemove(product.id) }}/>
              <img src={product.image} alt={product.name} />
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-detail">
                  <span>Price: {product.price}</span>
                  <span>ASIN: {product.asin}</span>
                  <span>SKU: {product.sku}</span>
                </div>
              </div>
            </div>
          )
        }
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="section-title">
        Products
        <button
          type="button"
          className="btn btn-blue"
          onClick={() => setOpenModal(true)}
        >
          Add Products
        </button>
      </div>
      <div className="section-note">
        Add products that you want to promote in this campaign.
      </div>
      { renderProducts() }
      <ProductModal
        show={openModal}
        productsSelected={products}
        onSelect={handleSelect}
        onClose={() => { setOpenModal(false) }}
      />
    </div>
  )
}

export default ProductSection
