import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'
import { Modal } from 'rsuite'

import { filterKeywordWithZeroImpression } from '../../redux/actions/productDetail'

const KeywordFilterZeroComponent = ({ showFilter, onClose }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { productDetail, product } = store.getState()
  const { curProduct } = product
  const { zeroFilterModels } = productDetail
  
  const [ currentFilterId, setCurrentFilterId ] = useState({value:0, label: 'Select Filter'})
  const [ currentFilter, setCurrentFilter ] = useState({})

  const filters = zeroFilterModels.map(data=> ({value: data.id, label: data.name}))
  const matches = [
    {value: 'any', label: 'ANY'},
    {value: 'broad', label: 'BROAD'},
    {value: 'phrase', label: 'PHRASE'},
    {value: 'exact', label: 'EXACT'}
  ]

  const onCloseFilter = () => {
    onClose()
  }
  const onApplyFilter = () => {
    dispatch(filterKeywordWithZeroImpression({
      sku: curProduct['sku'],
      id: curProduct['id'],
      filter: currentFilter
    }))
    onClose()
  }
  const onFilterChange = (val) => {
    const filter = zeroFilterModels.filter(data => data.id === val.value)[0]

    for (let i in filter) {
      if (filter[i] === null || filter[i] === 'NaN') {
        filter[i] = ''
      }
    }
    setCurrentFilter(filter)
    setCurrentFilterId(val)
  }

  return (
    <Modal className="filter-modal-content" backdrop="static" show={showFilter} size="xs" onHide={onClose}>
      <Modal.Header className="modal-header">
        <span>Filter Keywords</span>
      </Modal.Header>
      <div className="modal-sub-header">
        <span>Select Filter</span>
        <Select classNamePrefix={"custom-keyword-filter"} onChange={ onFilterChange } value={currentFilterId} defaultValue={{value:0, label: 'Select Filter'}} options={filters} />
      </div>
      <div className="modal-content">
        <div className="modal-row">
          <span>Model Name</span>
          <input type="text" value={currentFilter['name']} />
        </div>
        <div className="modal-row">
          <span>Select Match Type</span>
          <Select classNamePrefix={"match-type-select"} value={{value: currentFilter['match1'], label:currentFilter['match1']}} options={matches} />
        </div>
      </div>
      <Modal.Footer className="modal-footer">
        <div className="footer-left">
        </div>
        <div className="footer-right">
          <button className="footer-btn btn-red" onClick={ onCloseFilter }>Close</button>
          <button className="footer-btn btn-blue" onClick={ onApplyFilter }>Apply</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default KeywordFilterZeroComponent
