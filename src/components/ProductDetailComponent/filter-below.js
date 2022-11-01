import React from 'react'
import { useStore } from 'react-redux'
import Select from 'react-select'
//--assets

//--actions

const KeywordFilterBelowComponent = () => {
  const store = useStore()
  const { productDetail } = store.getState()
  const { belowFilterModels } = productDetail
  const filters = belowFilterModels.map(data=> ({value: data.id, label: data.name}))
  const matchs = [
    {value: 'any', label: 'ANY'},
    {value: 'broad', label: 'BROAD'},
    {value: 'phrase', label: 'PHRASE'},
    {value: 'exact', label: 'EXACT'}
  ]

  const onCloseFilter = () => {

  }

  return (
    <div className="filter-modal-content">
      <div className="modal-header">
        <span>Filter Keywords</span>
      </div>
      <div className="modal-sub-header">
        <span>Select Filter</span>
        <Select classNamePrefix={"custom-keyword-filter"} defaultValue={{value:0, label: 'Select Filter'}} options={filters} />
      </div>
      <div className="modal-content">
        <div className="modal-row">
          <span>Profit</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Gross Revenue</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Ad Spend</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>ACoS</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Impressions</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Clicks</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>CTR%</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Ave Cost Per Click</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Orders</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Conversion %</span>
          <div className="modal-colspan-3">
            <input type="text" />
            <span>to</span>
            <input type="text" />
          </div>
        </div>
        <div className="modal-row">
          <span>Model Name</span>
          <input type="text" />
        </div>
        <div className="modal-row">
          <span>Select Match Type</span>
          <Select classNamePrefix={"match-type-select"} defaultValue={{value:'NAN', label: 'Match Type'}} options={matchs} />
        </div>
      </div>
      <div className="modal-footer">
        <div className="footer-left">
          <div className="footer-btn">Save Filter</div>
          <div className="footer-btn">Save As New Filter</div>
        </div>
        <div className="footer-right">
          <div className="footer-btn btn-red" onClick={ onCloseFilter }>Close</div>
          <div className="footer-btn btn-blue">Apply</div>
        </div>
      </div>
    </div>
  );
}

export default KeywordFilterBelowComponent
