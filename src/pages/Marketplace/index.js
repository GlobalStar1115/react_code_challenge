import React, { useEffect, useRef, useState } from 'react'

import MainLayout from '../../layout/MainLayout'
import ProductSelector from './ProductSelector'
import CoachingInfo from './CoachingInfo'
import OpInfo from './OpInfo'

const PRODUCT_COACH = 'coach'
const PRODUCT_OP = 'op'

const MarketplacePage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [needScroll, setNeedScroll] = useState(false)
  const infoRef = useRef(null)

  useEffect(() => {
    if (selectedProduct && needScroll && infoRef.current) {
      infoRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedProduct, needScroll])

  const handleSelect = (product, scrollToBottom = false) => {
    setSelectedProduct(product)
    setNeedScroll(scrollToBottom)
  }

  return (
    <MainLayout>
      <div className="marketplace-page">
        <div className="page-header">
          <div className="page-title">Marketplace</div>
        </div>
        <div className="page-content">
          <ProductSelector
            selectedProduct={selectedProduct}
            onSelect={handleSelect}
          />
          {
            selectedProduct === PRODUCT_COACH && (
              <CoachingInfo ref={infoRef} />
            )
          }
          {
            selectedProduct === PRODUCT_OP && (
              <OpInfo ref={infoRef} />
            )
          }
        </div>
      </div>
    </MainLayout>
  )
}

export default MarketplacePage
