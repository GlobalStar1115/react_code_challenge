import React, { useState } from 'react'

import CustomTable from '../CommonComponents/CustomTableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

const TAB_SUGGESTED = 'suggested'
const TAB_SEARCH = 'search'
const TAB_ENTER = 'enter'

const ProductTable = ({ isLoading, products, targetings, defaultBid, isForSD,
  suggestedProducts, onSearch, onSearchAsins, onTarget }) => {
  const [currentTab, setCurrentTab] = useState(!isForSD ? TAB_SEARCH : TAB_SUGGESTED)
  const [asinList, setAsinList] = useState('')
  const [isAsinsSearching, setAsinsSearching] = useState(false)

  const tabList = [
    { value: TAB_SEARCH, name: 'Search' },
    { value: TAB_ENTER, name: 'Enter list' },
  ]

  if (isForSD) {
    tabList.unshift({
      value: TAB_SUGGESTED,
      name: 'Suggested',
    })
  }

  const handleTarget = (product) => {
    const duplicate = targetings
      .filter(category => category.type === 'product')
      .find(category => category.ASIN === product.ASIN)

    if (duplicate) {
      return
    }

    onTarget(prevTargetings => ([
      {
        ...product,
        name: product.name || product.ItemAttributes.Title,
        isTargeted: true,
        type: 'product',
        bid: defaultBid,
      },
      ...prevTargetings,
    ]))
  }

  const handleAsinsTarget = async () => {
    const asins = asinList.split('\n').map(asin => asin.trim().toUpperCase()).join(',')
    setAsinsSearching(true)
    const response = await onSearchAsins(asins)
    setAsinsSearching(false)

    response.Item.forEach((product) => {
      handleTarget(product)
    })
  }

  const renderProduct = (product) => {
    const isExisting = targetings.filter(item => item.type === 'product')
      .find(item => item.ASIN === product.ASIN)

    return (
      <>
        <div className="table-col col-product">
          <img src={product.SmallImage.URL} alt={product.name} />
          <div className="product-info">
            <div className="product-name" title={product.name}>
              { product.name }
            </div>
            <div className="product-asin-info">
              ASIN: { product.ASIN }
            </div>
          </div>
        </div>
        <div className="table-col">
          {
            isExisting ? (
            <button type="button" className="btn btn-blue disabled">Targeted</button>
            ) : (
            <button type="button" className="btn btn-blue" onClick={() => { handleTarget(product) }}>
              Target
            </button>
            )
          }
        </div>
      </>
    )
  }

  return (
    <div className={`product-tab-container${(isLoading || isAsinsSearching) ? ' loading' : ''}`}>
      { (isLoading || isAsinsSearching) && <LoaderComponent/> }
      <div className="sub-tab-list">
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
        currentTab === TAB_SUGGESTED && (
          <CustomTable
            className="table-products"
            records={suggestedProducts}
            noCheckBox
            idField="ASIN"
            searchFields={['name', 'ASIN']}
            paginationSelectPlacement="top"
            renderRecord={renderProduct}
          >
            <div className="table-col col-product">Product</div>
            <div className="table-col">
            </div>
          </CustomTable>
        )
      }
      {
        currentTab === TAB_SEARCH && (
          <CustomTable
            className="table-products"
            records={products}
            noCheckBox
            idField="ASIN"
            searchFields={['name', 'ASIN']}
            paginationSelectPlacement="top"
            renderRecord={renderProduct}
            onSearch={onSearch}
          >
            <div className="table-col col-product">Product</div>
            <div className="table-col">
            </div>
          </CustomTable>
        )
      }
      {
        currentTab === TAB_ENTER && (
          <>
            <textarea
              className="asin-list"
              placeholder="Enter ASINs separated by a new line."
              rows={5}
              value={asinList}
              onChange={(event) => { setAsinList(event.target.value) }}
            />
            <button
              type="button"
              className="btn btn-blue"
              disabled={asinList === ''}
              onClick={handleAsinsTarget}
            >
              Target
            </button>
          </>
        )
      }
    </div>
  )
}

export default ProductTable
