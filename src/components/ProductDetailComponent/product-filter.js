import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from "react-router-dom"
import moment from 'moment'

import {
  getProductById,
} from '../../redux/actions/product'

const ProductFilterComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()
  const { onClose } = props
  const { product, header } = store.getState()
  const { allSkusWithProfit } = product
  const {
    currentStartDate,
    currentEndDate,
    currentUserId
  } = header

  const [ searchKey, setSearchKey ] = useState('')

  const handleProductDetail = (id, sku) => {
    dispatch(
      getProductById({
        id,
        sku,
        startDate: currentStartDate ? moment(currentStartDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
        endDate: currentEndDate ? moment(currentEndDate).format('YYYY-MM-DD') : moment().subtract(1, 'months').format('YYYY-MM-DD'),
        userId: currentUserId,
      })
    )
    history.push(`/dashboard/product/${id}/${sku}`)
    onClose()
  }
  const result = allSkusWithProfit.filter(product => product['product-name'].toLowerCase().includes(searchKey) || product['sku'].toLowerCase().includes(searchKey))
  const filterElements = result.map(product =>
    (
      <div className="filter-row" onClick={ ()=>handleProductDetail(product['id'], product['sku']) }>
        <img alt={product['product-name']} src={product['image_sm']} />
        <span>{product['product-name']}</span>
      </div>
    )
  )

  return (
    <div className="product-filter-component">
      <input type="text" className="product-filter-search" value={ searchKey } onChange={ (e)=>setSearchKey(e.target.value) } placeholder="Search by name or SKU to find product" />
      <div className="filter-content">
        { filterElements }
      </div>
    </div>
  );
}

export default ProductFilterComponent
