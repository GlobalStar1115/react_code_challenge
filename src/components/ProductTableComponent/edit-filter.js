import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

//--layouts & components
import EditTableFilterLayout from '../../layout/EditTableFilterLayout'

import { applyProductFilter } from '../../redux/actions/pageGlobal'

const EditProductFilterComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const { pageGlobal } = store
  const { productFilters } = pageGlobal

  const [ cogMin, setCogMin ] = useState(productFilters.cogMin)
  const [ cogMax, setCogMax ] = useState(productFilters.cogMax)
  const [ profitMarginMin, setProfitMarginMin ] = useState(productFilters.profitMarginMin)
  const [ profitMarginMax, setProfitMarginMax ] = useState(productFilters.profitMarginMax)
  const [ cpaMin, setCpaMin ] = useState(productFilters.cpaMin)
  const [ cpaMax, setCpaMax ] = useState(productFilters.cpaMax)
  const [ ordersMin, setOrdersMin ] = useState(productFilters.ordersMin)
  const [ ordersMax, setOrdersMax ] = useState(productFilters.ordersMax)
  const [ clicksMin, setClicksMin ] = useState(productFilters.clicksMin)
  const [ clicksMax, setClicksMax ] = useState(productFilters.clicksMax)
  const [ spendMin, setSpendMin ] = useState(productFilters.spendMin)
  const [ spendMax, setSpendMax ] = useState(productFilters.spendMax)
  const [ ctrMin, setCtrMin ] = useState(productFilters.ctrMin)
  const [ ctrMax, setCtrMax ] = useState(productFilters.ctrMax)
  const [ acosMin, setAcosMin ] = useState(productFilters.acosMin)
  const [ acosMax, setAcosMax ] = useState(productFilters.acosMax)
  const [ roasMin, setRoasMin ] = useState(productFilters.roasMin)
  const [ roasMax, setRoasMax ] = useState(productFilters.roasMax)
  
  const onApplyFilter = () => {
    dispatch(applyProductFilter({
      cogMin,
      cogMax,
      profitMarginMin,
      profitMarginMax,
      cpaMin,
      cpaMax,
      ordersMin,
      ordersMax,
      spendMin,
      spendMax,
      clicksMin,
      clicksMax,
      ctrMin,
      ctrMax,
      acosMin,
      acosMax,
      roasMin,
      roasMax
    }))
  }
  const onResetFilter = () => {
    setCogMin('')
    setCogMax('')
    setProfitMarginMin('')
    setProfitMarginMax('')
    setCpaMin('')
    setCpaMax('')
    setOrdersMin('')
    setOrdersMax('')
    setSpendMin('')
    setSpendMax('')
    setClicksMin('')
    setClicksMax('')
    setCtrMin('')
    setCtrMax('')
    setAcosMin('')
    setAcosMax('')
    setRoasMin('')
    setRoasMax('')
  }

  return (
    <EditTableFilterLayout applyFilter={onApplyFilter} resetFilter={onResetFilter}>
      <div className="campaign-edit-table-filter">
        <div className="filter-row">
          <span>Cost Of Goods</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={cogMin} onChange={(e)=>setCogMin(e.target.value)} />
            <input type="text" placeholder="Max" value={cogMax} onChange={(e)=>setCogMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Profit Margin</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={profitMarginMin} onChange={(e)=>setProfitMarginMin(e.target.value)} />
            <input type="text" placeholder="Max" value={profitMarginMax} onChange={(e)=>setProfitMarginMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Break Even CPA</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={cpaMin} onChange={(e)=>setCpaMin(e.target.value)} />
            <input type="text" placeholder="Max" value={cpaMax} onChange={(e)=>setCpaMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Orders</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={ordersMin} onChange={(e)=>setOrdersMin(e.target.value)} />
            <input type="text" placeholder="Max" value={ordersMax} onChange={(e)=>setOrdersMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Spend</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={spendMin} onChange={(e)=>setSpendMin(e.target.value)} />
            <input type="text" placeholder="Max" value={spendMax} onChange={(e)=>setSpendMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Clicks</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={clicksMin} onChange={(e)=>setClicksMin(e.target.value)} />
            <input type="text" placeholder="Max" value={clicksMax} onChange={(e)=>setClicksMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>CTR</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={ctrMin} onChange={(e)=>setCtrMin(e.target.value)} />
            <input type="text" placeholder="Max" value={ctrMax} onChange={(e)=>setCtrMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>ACoS</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={acosMin} onChange={(e)=>setAcosMin(e.target.value)} />
            <input type="text" placeholder="Max" value={acosMax} onChange={(e)=>setAcosMax(e.target.value)} />
          </div>
        </div>
      </div>
    </EditTableFilterLayout>
  );
}

export default EditProductFilterComponent
