import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'rsuite'

import {
  getBrandRecommendations,
  getProductsNegativeTargeting
} from '../../redux/actions/targeting'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import ExcludeBrandTable from './ExcludeBrandTable'
import ExcludeProductTable from './ExcludeProductTable'

const TAB_CATEGORY = 'category'
const TAB_PRODUCT = 'product'

const tabList = [
  { value: TAB_CATEGORY, name: 'Exclude Brands' },
  { value: TAB_PRODUCT, name: 'Exclude Products' },
]

const NegativeTargetingModal = ({ show, negativeTargetings, onChange, onClose }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { targeting } = store.getState()
  const {
    isNegativeTargetingBrandsLoading,
    negativeTargetingBrands,
    isNegativeTargetingProductsLoading,
    negativeTargetingProducts
  } = targeting


  const [currentTab, setCurrentTab] = useState(TAB_CATEGORY)
  const [brands, setBrands] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!negativeTargetingBrands || negativeTargetingBrands.length === 0) {
      return
    }
    setBrands(negativeTargetingBrands.map(brand => ({
      ...brand,
      isTargeted: negativeTargetings.filter(item => item.type === 'brand')
        .filter(item => item.id === brand.id).length > 0,
    })))
  }, [negativeTargetingBrands, negativeTargetings])

  useEffect(() => {
    if (!negativeTargetingProducts || negativeTargetingProducts.length === 0) {
      return
    }
    setProducts(negativeTargetingProducts.map(product => ({
      ...product,
      isTargeted: negativeTargetings.filter(item => item.type === 'product')
        .filter(item => item.ASIN === product.ASIN).length > 0
    })))
  }, [negativeTargetingProducts, negativeTargetings])

  const handleBrandSearch = (keyword) => {
    if (keyword === '') {
      return
    }
    dispatch(getBrandRecommendations({
      keyword,
    }))
  }

  const handleProductSearch = (keyword) => {
    if (keyword === '') {
      return
    }
    dispatch(getProductsNegativeTargeting({
      RelatedItemPage: 1,
      search: keyword,
    }))
  }

  const isLoading = isNegativeTargetingBrandsLoading || isNegativeTargetingProductsLoading

  return (
    <Modal className={`negative-targeting-modal${isLoading ? ' loading' : ''}`} backdrop="static" show={show} size="lg">
      <Modal.Body>
        { isLoading && <LoaderComponent /> }
        <div className="tab-list">
          {
            tabList.map(tab => (
              <button
                key={tab.value}
                type="button"
                className={currentTab === tab.value ? 'selected' : ''}
                onClick={() => { setCurrentTab(tab.value) }}
              >
                { tab.name }
              </button>
            ))
          }
        </div>
        {
          currentTab === TAB_CATEGORY && (
            <ExcludeBrandTable
              brands={brands}
              negativeTargetings={negativeTargetings}
              onSearch={handleBrandSearch}
              onChange={onChange}
            />
          )
        }
        {
          currentTab === TAB_PRODUCT && (
            <ExcludeProductTable
              products={products}
              negativeTargetings={negativeTargetings}
              onSearch={handleProductSearch}
              onChange={onChange}
            />
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default NegativeTargetingModal