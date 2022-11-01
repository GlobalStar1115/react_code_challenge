import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'rsuite'

import LoaderComponent from '../CommonComponents/LoaderComponent'

import CategoryTable from './CategoryTable'
import CategoryTree from './CategoryTree'
import ProductTable from './ProductTable'

import { getProductsBySearchText } from '../../redux/actions/targeting'

const TAB_CATEGORY = 'category'
const TAB_PRODUCT = 'product'

const tabList = [
  { value: TAB_CATEGORY, name: 'Category' },
  { value: TAB_PRODUCT, name: 'Product' },
]

const TargetingModal = ({ show, defaultBid, targetings, isForSD, isLoading, suggestedCategories,
  suggestedProducts, onChange, onClose }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const { targeting } = store.getState()
  const {
    isAllCategoriesLoading,
    targetingAllCategories,
    isSearchedProductsLoading,
    targetingSearchedProducts,
  } = targeting

  const [currentTab, setCurrentTab] = useState(TAB_CATEGORY)

  const handleProductSearch = (keyword) => {
    if (keyword === '') {
      return
    }
    dispatch(getProductsBySearchText({
      search: keyword,
    }))
  }

  const handleAsinsSearch = async asins => (
    dispatch(getProductsBySearchText({
      asins,
    }, true))
  )

  const handleCategoryTarget = (category) => {
    const duplicate = targetings.find(existingCategory => (
      existingCategory.id === category.id
      && (existingCategory.type === 'category' || existingCategory.type === 'refine')
    ))

    if (duplicate) {
      return
    }

    onChange([
      {
        ...category,
        name: category.name || category.na,
        type: 'category',
        bid: defaultBid,
      },
      ...targetings,
    ])
  }

  const handleCategoryTargetAll = () => {
    const existingIds = targetings
      .filter(category => (category.type === 'category' || category.type === 'refine'))
      .map(category => category.id)

    const newTargetings = [...targetings]
    suggestedCategories.forEach((category) => {
      if (!existingIds.includes(category.id)) {
        newTargetings.push({
          ...category,
          type: 'category',
          bid: defaultBid,
        })
      }
    })

    onChange(newTargetings)
  }

  // FIXME: When refining already targeted category, overwrite it.
  const handleCategoryRefine = (category, payload) => {
    const duplicate = targetings.find(existingCategory => (
      existingCategory.id === category.id
      && (existingCategory.type === 'category' || existingCategory.type === 'refine')
      && (
        (!existingCategory.brandId && !payload.brandId)
        || (existingCategory.brandId === payload.brandId)
      )
    ))

    if (duplicate) {
      return
    }

    onChange(prevTargetings => ([
      {
        ...category,
        type: 'refine',
        bid: defaultBid,
        name: category.name || category.na,
        ...payload,
      },
      ...prevTargetings,
    ]))
  }

  const handleCategoryTargetTree = (category, parentCategory = null, expandedNodes) => {
    const duplicate = targetings.find(existingCategory => (
      existingCategory.id === category.id
      && (existingCategory.type === 'category' || existingCategory.type === 'refine')
    ))

    if (duplicate) {
      return
    }

    const newCategory = {
      ...category,
      name: category.na,
      type: 'category',
      bid: defaultBid,
      parentId: parentCategory ? parentCategory.id : null,
    }

    if (parentCategory) {
      newCategory.path = expandedNodes[parentCategory.id] && expandedNodes[parentCategory.id].path
        ? expandedNodes[parentCategory.id].path
        : category.na
    }

    onChange([ newCategory, ...targetings ])
  }

  const renderCategoryTab = () => {
    if (currentTab !== TAB_CATEGORY) {
      return null
    }

    return (
      <div className="category-tab-container">
        <CategoryTable
          isLoading={isLoading}
          categories={suggestedCategories}
          targetings={targetings}
          onTarget={handleCategoryTarget}
          onTargetAll={handleCategoryTargetAll}
          onRefine={handleCategoryRefine}
        />
        <CategoryTree
          isLoading={isAllCategoriesLoading}
          categories={targetingAllCategories || []}
          targetings={targetings}
          onTarget={handleCategoryTargetTree}
          onTargetSearch={handleCategoryTarget}
          onRefine={handleCategoryRefine}
        />
      </div>
    )
  }

  const renderProductTab = () => {
    if (currentTab !== TAB_PRODUCT) {
      return null
    }

    return (
      <ProductTable
        isLoading={isSearchedProductsLoading}
        products={targetingSearchedProducts || []}
        targetings={targetings}
        defaultBid={defaultBid}
        isForSD={isForSD}
        suggestedProducts={suggestedProducts}
        onSearch={handleProductSearch}
        onSearchAsins={handleAsinsSearch}
        onTarget={onChange}
      />
    )
  }

  return (
    <Modal className={`product-targeting-modal${isLoading ? ' loading' : ''}`} backdrop="static" show={show} size="lg">
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
        { renderCategoryTab() }
        { renderProductTab() }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default TargetingModal