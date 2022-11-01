import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'rsuite'

import { getSkus } from '../../redux/actions/product'

import CustomTable from '../CommonComponents/CustomTableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatCurrency } from '../../services/helper'

const TAB_SEARCH = 'search'
const TAB_ENTER = 'enter'

const tabList = [
  { value: TAB_SEARCH, name: 'Search' },
  { value: TAB_ENTER, name: 'Enter list' },
]

const ProductModal = ({ show, productsSelected, onSelect, onClose }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { header, product } = store.getState()
  const { currencyRate, currencySign } = header
  const { skus, isLoading } = product

  const [currentTab, setCurrentTab] = useState(TAB_SEARCH)
  const [selectedIds, setSelectedIds] = useState([])
  const [asinList, setAsinList] = useState('')

  useEffect(() => {
    if (show && !isLoading && !(skus || []).length) {
      dispatch(getSkus())
    }
  }, [show]) // eslint-disable-line

  useEffect(() => {
    setSelectedIds(productsSelected.map(sku => sku.id))
  }, [productsSelected])

  const handleConfirm = () => {
    let selectedProducts = []
    if (currentTab === TAB_SEARCH) {
      selectedProducts = skus.filter(sku => selectedIds.includes(sku.id))
    } else if (currentTab === TAB_ENTER) {
      const asins = asinList.split('\n').map(asin => asin.trim().toLowerCase())
      selectedProducts = skus.filter(sku => asins.includes(sku.asin.toLowerCase()))
    }
    onSelect(selectedProducts)
  }

  const renderSku = sku => (
    <>
      <div className="table-col col-product">
        {
          sku.image !== '' ? (
            <img src={sku.image} alt={sku.name} />
          ) : (
            <span className="image-placeholder">No image</span>
          )
        }
        <div className="product-info">
          <div className="product-name" title={sku.name}>
            { sku.name }
          </div>
          <div className="product-asin-info">
            ASIN: { sku.asin } | SKU: { sku.sku }
          </div>
        </div>
      </div>
      <div className="table-col">
        { formatCurrency(sku.price, currencySign, currencyRate) }
      </div>
    </>
  )

  return (
    <Modal className={`product-modal${isLoading ? ' loading' : ''}`} backdrop="static" show={show} size="lg">
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
          currentTab === TAB_SEARCH && (
            <CustomTable
              className="table-products"
              records={skus || []}
              selectedRecords={selectedIds}
              idField="id"
              searchFields={['name', 'sku', 'asin']}
              paginationSelectPlacement="top"
              renderRecord={renderSku}
              onChange={setSelectedIds}
            >
              <div className="table-col col-product">Product</div>
              <div className="table-col">Price</div>
            </CustomTable>
          )
        }
        {
          currentTab === TAB_ENTER && (
            <textarea
              className="asin-list"
              placeholder="Enter ASINs separated by a new line."
              rows={5}
              value={asinList}
              onChange={(event) => { setAsinList(event.target.value) }}
            />
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ProductModal
