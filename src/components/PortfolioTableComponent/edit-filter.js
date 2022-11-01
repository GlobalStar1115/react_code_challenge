import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

//--layouts & components
import EditTableFilterLayout from '../../layout/EditTableFilterLayout'

import {applyPortfolioFilter} from '../../redux/actions/pageGlobal'

const EditPortfolioFilterComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const {pageGlobal} = store
  const {portfolioFilters} = pageGlobal

  const [dailyBudgetMin, setDailyBudgetMin] = useState(portfolioFilters.dailyBudgetMin)
  const [dailyBudgetMax, setDailyBudgetMax] = useState(portfolioFilters.dailyBudgetMax)
  const [impressionsMin, setImpressionsMin] = useState(portfolioFilters.impressionsMin)
  const [impressionsMax, setImpressionsMax] = useState(portfolioFilters.impressionsMax)
  const [salesMin, setSalesMin] = useState(portfolioFilters.salesMin)
  const [salesMax, setSalesMax] = useState(portfolioFilters.salesMax)
  const [cpcMin, setCpcMin] = useState(portfolioFilters.cpcMin)
  const [cpcMax, setCpcMax] = useState(portfolioFilters.cpcMax)
  const [ordersMin, setOrdersMin] = useState(portfolioFilters.ordersMin)
  const [ordersMax, setOrdersMax] = useState(portfolioFilters.ordersMax)
  const [clicksMin, setClicksMin] = useState(portfolioFilters.clicksMin)
  const [clicksMax, setClicksMax] = useState(portfolioFilters.clicksMax)
  const [spendMin, setSpendMin] = useState(portfolioFilters.spendMin)
  const [spendMax, setSpendMax] = useState(portfolioFilters.spendMax)
  const [ctrMin, setCtrMin] = useState(portfolioFilters.ctrMin)
  const [ctrMax, setCtrMax] = useState(portfolioFilters.ctrMax)
  const [acosMin, setAcosMin] = useState(portfolioFilters.acosMin)
  const [acosMax, setAcosMax] = useState(portfolioFilters.acosMax)
  const [roasMin, setRoasMin] = useState(portfolioFilters.roasMin)
  const [roasMax, setRoasMax] = useState(portfolioFilters.roasMax)
  
  const onApplyFilter = () => {
    dispatch(applyPortfolioFilter({
      dailyBudgetMin,
      dailyBudgetMax,
      impressionsMin,
      impressionsMax,
      salesMin,
      salesMax,
      cpcMin,
      cpcMax,
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
    setDailyBudgetMin('')
    setDailyBudgetMax('')
    setImpressionsMin('')
    setImpressionsMax('')
    setSalesMin('')
    setSalesMax('')
    setCpcMin('')
    setCpcMax('')
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
          <span>Daily Budget</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={dailyBudgetMin} onChange={(e)=>setDailyBudgetMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={dailyBudgetMax} onChange={(e)=>setDailyBudgetMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Impressions</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={impressionsMin} onChange={(e)=>setImpressionsMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={impressionsMax} onChange={(e)=>setImpressionsMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Clicks</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={clicksMin} onChange={(e)=>setClicksMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={clicksMax} onChange={(e)=>setClicksMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>CTR</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={ctrMin} onChange={(e)=>setCtrMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={ctrMax} onChange={(e)=>setCtrMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Spend</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={spendMin} onChange={(e)=>setSpendMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={spendMax} onChange={(e)=>setSpendMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>CPC</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={cpcMin} onChange={(e)=>setCpcMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={cpcMax} onChange={(e)=>setCpcMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Orders</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={ordersMin} onChange={(e)=>setOrdersMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={ordersMax} onChange={(e)=>setOrdersMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Sales</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={salesMin} onChange={(e)=>setSalesMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={salesMax} onChange={(e)=>setSalesMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>ACoS</span>
          <div className="filter-row-child">
            <input type="number" min="0" placeholder="Min" value={acosMin} onChange={(e)=>setAcosMin(e.target.value)} />
            <input type="number" min="0" placeholder="Max" value={acosMax} onChange={(e)=>setAcosMax(e.target.value)} />
          </div>
        </div>
      </div>
    </EditTableFilterLayout>
  );
}

export default EditPortfolioFilterComponent
