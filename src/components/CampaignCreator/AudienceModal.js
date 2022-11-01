import React, { useState } from 'react'
import { useStore } from 'react-redux'
import { Modal, Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import LoaderComponent from '../CommonComponents/LoaderComponent'

import CategoryTable from './CategoryTable'
import CategoryTree from './CategoryTree'
import AudienceTree from './AudienceTree'

const TAB_VIEWS = 'views'
const TAB_AUDIENCES = 'audiences'
const SUB_TAB_CATEGORY = 'category'
const SUB_TAB_PRODUCT = 'product'

const tabList = [
  {
    value: TAB_VIEWS,
    name: 'Views remarketing',
    description: 'Reach custom-built audiences who viewed product detail pages '
      + 'matching criteria you choose.',
  },
  {
    value: TAB_AUDIENCES,
    name: 'Amazon audiences',
    description: 'Reach relevant audiences using our exclusive, '
      + 'prebuilt segments: Lifestyle, Interests, Life events, and In-market.',
  },
]

const subTabList = [
  { value: SUB_TAB_CATEGORY, name: 'Categories' },
  { value: SUB_TAB_PRODUCT, name: 'Products' },
]

const viewProductList = [
  { label: 'Advertised products', value: 'exactProduct' },
  { label: 'Similar to advertised products', value: 'similarProduct' },
]

const AudienceModal = ({ show, defaultBid, targetings, onChange, onClose }) => {
  const store = useStore()

  const { campaignCreator, targeting } = store.getState()
  const { isSDSuggestionsLoading, suggestedSDCategories } = campaignCreator
  const {
    isAllCategoriesLoading,
    targetingAllCategories,
  } = targeting

  const [currentTab, setCurrentTab] = useState(TAB_VIEWS)
  const [currentSubTab, setCurrentSubTab] = useState(SUB_TAB_CATEGORY)

  const handleCategoryTarget = (category) => {
    const duplicate = targetings.find(existingCategory => (
      existingCategory.id === category.id
      && (existingCategory.type === 'audience_category'
        || existingCategory.type === 'audience_refine')
    ))

    if (duplicate) {
      return
    }

    onChange([
      {
        ...category,
        name: category.name || category.na,
        type: 'audience_category',
        bid: defaultBid,
      },
      ...targetings,
    ])
  }

  const handleCategoryTargetAll = () => {
    const existingIds = targetings
      .filter(category => (category.type === 'audience_category' || category.type === 'audience_refine'))
      .map(category => category.id)

    const newTargetings = [...targetings]
    suggestedSDCategories.forEach((category) => {
      if (!existingIds.includes(category.id)) {
        newTargetings.push({
          ...category,
          type: 'audience_category',
          bid: defaultBid,
        })
      }
    })

    onChange(newTargetings)
  }

  const handleCategoryRefine = (category, payload) => {
    const duplicate = targetings.find(existingCategory => (
      existingCategory.id === category.id
      && (existingCategory.type === 'audience_category' || existingCategory.type === 'audience_refine')
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
        type: 'audience_refine',
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
      && (existingCategory.type === 'audience_category' || existingCategory.type === 'audience_refine')
    ))

    if (duplicate) {
      return
    }

    const newCategory = {
      ...category,
      name: category.na,
      type: 'audience_category',
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

  const handleProductTarget = (viewProduct) => {
    onChange([
      {
        id: viewProduct.value,
        name: viewProduct.label,
        type: 'audience_product',
        bid: defaultBid,
      },
      ...targetings,
    ])
  }

  const handleAudienceTarget = (audience) => {
    onChange([
      {
        id: audience.value,
        name: audience.label,
        type: 'audience',
        bid: defaultBid,
      },
      ...targetings,
    ])
  }

  const renderViewsTab = () => {
    if (currentTab !== TAB_VIEWS) {
      return null
    }

    if (currentSubTab === SUB_TAB_CATEGORY) {
      return (
        <div className="category-tab-container">
          <CategoryTable
            actionLabel="Add"
            isLoading={isSDSuggestionsLoading}
            categories={suggestedSDCategories || []}
            targetings={targetings}
            onTarget={handleCategoryTarget}
            onTargetAll={handleCategoryTargetAll}
            onRefine={handleCategoryRefine}
            />
          <CategoryTree
            actionLabel="Add"
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

    return (
      <div className="views-product-container">
        {
          viewProductList.map((viewProduct) => {
            const isExisting = targetings.find(targeting => (
              targeting.id === viewProduct.value
            ))

            return (
              <div key={viewProduct.value} className="view-item">
                <div className="item-label">{ viewProduct.label }</div>
                {
                  isExisting ? (
                    <button type="button" className="btn btn-blue disabled">
                      Added
                    </button>
                  ) : (
                    <button type="button" className="btn btn-blue" onClick={() => { handleProductTarget(viewProduct) }}>
                      Add
                    </button>
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderAudiencesTab = () => {
    if (currentTab !== TAB_AUDIENCES) {
      return null
    }

    return (
      <AudienceTree
        targetings={targetings}
        onTarget={handleAudienceTarget}
      />
    )
  }

  return (
    <Modal className={`audience-modal${isSDSuggestionsLoading ? ' loading' : ''}`} backdrop="static" show={show} size="lg">
      <Modal.Body>
        { isSDSuggestionsLoading && <LoaderComponent /> }
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
                {
                  tab.description && (
                    <Whisper placement="right" trigger="hover" speaker={(
                      <Tooltip>
                        { tab.description }
                      </Tooltip>
                    )}>
                      <InfoSvg />
                    </Whisper>
                  )
                }
              </button>
            ))
          }
        </div>
        {
          currentTab === TAB_VIEWS && (
            <div className="sub-tab-list">
              {
                subTabList.map(tab => (
                  <button
                    key={tab.value}
                    type="button"
                    className={currentSubTab === tab.value ? 'selected' : ''}
                    onClick={() => { setCurrentSubTab(tab.value) }}
                  >
                    { tab.name }
                  </button>
                ))
              }
            </div>
          )
        }
        { renderViewsTab() }
        { renderAudiencesTab() }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default AudienceModal
