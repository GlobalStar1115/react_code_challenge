import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'
import { Modal } from 'rsuite'

import { filterTargetAcosKeywords } from '../../redux/actions/productDetail'

const KeywordFilterAboveComponent = ({ showFilter, onClose }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { productDetail, product } = store.getState()
  const { aboveFilterModels } = productDetail
  const { curProduct } = product

  const filters = aboveFilterModels.map(data=> ({value: data.id, label: data.name}))
  const matches = [
    {value: 'any', label: 'ANY'},
    {value: 'broad', label: 'BROAD'},
    {value: 'phrase', label: 'PHRASE'},
    {value: 'exact', label: 'EXACT'}
  ]

  const [ currentFilterId, setCurrentFilterId ] = useState({value:0, label: 'Select Filter'})
  const [ currentFilter, setCurrentFilter ] = useState({})

  const onCloseFilter = () => {
    onClose()
  }
  const onApplyFilter = () => {
    dispatch(filterTargetAcosKeywords({
      sku: curProduct['sku'],
      id: curProduct['id'],
      filter: currentFilter
    }))
    onClose()
  }

  const onFilterChange = (val) => {
    const filter = aboveFilterModels.filter(data => data.id === val.value)[0]

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
          <span>Profit</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['profitfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, profitfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['profitto']} onChange={(e)=>setCurrentFilter({...currentFilter, profitto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Gross Revenue</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['revenuefrom']} onChange={(e)=>setCurrentFilter({...currentFilter, revenuefrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['revenueto']} onChange={(e)=>setCurrentFilter({...currentFilter, revenueto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Ad Spend</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['adspendfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, adspendfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['adspendto']} onChange={(e)=>setCurrentFilter({...currentFilter, adspendto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>ACoS</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['acosfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, acosfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['acosto']} onChange={(e)=>setCurrentFilter({...currentFilter, acosto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Impressions</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['impressionsfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, impressionsfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['impressionsto']} onChange={(e)=>setCurrentFilter({...currentFilter, impressionsto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Clicks</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['clicksfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, clicksfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['clicksto']} onChange={(e)=>setCurrentFilter({...currentFilter, clicksto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>CTR%</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['ctrfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, ctrfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['ctrto']} onChange={(e)=>setCurrentFilter({...currentFilter, ctrto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Ave Cost Per Click</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['avecpcfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, avecpcfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['avecpcto']} onChange={(e)=>setCurrentFilter({...currentFilter, avecpcto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Orders</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['ordersfrom']} onChange={(e)=>setCurrentFilter({...currentFilter, ordersfrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['ordersto']} onChange={(e)=>setCurrentFilter({...currentFilter, ordersto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Conversion %</span>
          <div className="modal-colspan-3">
            <input type="text" value={currentFilter['conversionratefrom']} onChange={(e)=>setCurrentFilter({...currentFilter, conversionratefrom: e.target.value})} />
            <span>to</span>
            <input type="text" value={currentFilter['conversionrateto']} onChange={(e)=>setCurrentFilter({...currentFilter, conversionrateto: e.target.value})} />
          </div>
        </div>
        <div className="modal-row">
          <span>Model Name</span>
          <input type="text" value={currentFilter['name']} onChange={(e)=>setCurrentFilter({...currentFilter, name: e.target.value})} />
        </div>
        <div className="modal-row">
          <span>Select Match Type</span>
          <Select classNamePrefix={"match-type-select"} value={{value: currentFilter['match1'], label:currentFilter['match1']}} options={matches} />
        </div>
      </div>
      <Modal.Footer className="modal-footer">
        <div className="footer-left">
          <button className="footer-btn">Save Filter</button>
          <button className="footer-btn">Save As New Filter</button>
        </div>
        <div className="footer-right">
          <button className="footer-btn btn-red" onClick={ onCloseFilter }>Close</button>
          <button className="footer-btn btn-blue" onClick={ onApplyFilter }>Apply</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default KeywordFilterAboveComponent
