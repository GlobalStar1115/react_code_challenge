import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

import Select from 'react-select'

//--layouts & components
import EditTableFilterLayout from '../../layout/EditTableFilterLayout'

import { applyCampaignFilter } from '../../redux/actions/pageGlobal'

const EditTableFilterComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const { campaign, pageGlobal } = store
  const { topCampaigns } = campaign
  const { campaignFilters } = pageGlobal

  const campaigns = topCampaigns.map(data => ({value: data.campaign_id, label: data.campaign_name}))
  const types = [
    {value: 'manual', label: 'Manual'},
    {value: 'automatic', label: 'Automatic'},
    {value: 'all', label: 'All'},
  ]

  const [ campaignName, setCampaignName ] = useState(campaignFilters.campaignName)
  const [ campaignType, setCampaignType ] = useState(campaignFilters.campaignType)
  const [ targetAcosMin, setTargetAcosMin ] = useState(campaignFilters.targetAcosMin)
  const [ targetAcosMax, setTargetAcosMax ] = useState(campaignFilters.targetAcosMax)
  const [ budgetMin, setBudgetMin ] = useState(campaignFilters.budgetMin)
  const [ budgetMax, setBudgetMax ] = useState(campaignFilters.budgetMax)
  const [ ordersMin, setOrdersMin ] = useState(campaignFilters.ordersMin)
  const [ ordersMax, setOrdersMax ] = useState(campaignFilters.ordersMax)
  const [ spendMin, setSpendMin ] = useState(campaignFilters.spendMin)
  const [ spendMax, setSpendMax ] = useState(campaignFilters.spendMax)
  const [ impressionMin, setImpressionMin ] = useState(campaignFilters.impressionMin)
  const [ impressionMax, setImpressionMax ] = useState(campaignFilters.impressionMax)
  const [ clicksMin, setClicksMin ] = useState(campaignFilters.clicksMin)
  const [ clicksMax, setClicksMax ] = useState(campaignFilters.clicksMax)

  const onApplyFilter = () => {
    dispatch(applyCampaignFilter({
      campaignName,
      campaignType,
      targetAcosMin,
      targetAcosMax,
      budgetMin,
      budgetMax,
      ordersMax,
      spendMin,
      spendMax,
      impressionMin,
      impressionMax,
      clicksMin,
      clicksMax
    }))
  }
  const onResetFilter = () => {
    setCampaignName('')
    setCampaignType('')
    setTargetAcosMin('')
    setTargetAcosMax('')
    setBudgetMin('')
    setBudgetMax('')
    setOrdersMin('')
    setOrdersMax('')
    setSpendMin('')
    setSpendMax('')
    setImpressionMin('')
    setImpressionMax('')
    setClicksMin('')
    setClicksMax('')
  }

  return (
    <EditTableFilterLayout applyFilter={onApplyFilter} resetFilter={onResetFilter}>
      <div className="campaign-edit-table-filter">
        <div className="filter-row">
          <span>Name</span>
          <Select classNamePrefix={"campaign-filter"} options={campaigns} value={campaignName} onChange={(data)=>setCampaignName({value: data.value, label: data.label})} />
        </div>
        <div className="filter-row">
          <span>Type</span>
          <Select classNamePrefix={"campaign-type-filter"} options={types} value={campaignType} onChange={(data)=>setCampaignType({value: data.value, label: data.label})} />
        </div>
        <div className="filter-row">
          <span>ACoS Target Zone</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={targetAcosMin} onChange={(e)=>setTargetAcosMin(e.target.value)} />
            <input type="text" placeholder="Max" value={targetAcosMax} onChange={(e)=>setTargetAcosMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Daily Budget</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={budgetMin} onChange={(e)=>setBudgetMin(e.target.value)} />
            <input type="text" placeholder="Max" value={budgetMax} onChange={(e)=>setBudgetMax(e.target.value)} />
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
          <span>Impressions</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={impressionMin} onChange={(e)=>setImpressionMin(e.target.value)} />
            <input type="text" placeholder="Max" value={impressionMax} onChange={(e)=>setImpressionMax(e.target.value)} />
          </div>
        </div>
        <div className="filter-row">
          <span>Clicks</span>
          <div className="filter-row-child">
            <input type="text" placeholder="Min" value={clicksMin} onChange={(e)=>setClicksMin(e.target.value)} />
            <input type="text" placeholder="Max" value={clicksMax} onChange={(e)=>setClicksMax(e.target.value)} />
          </div>
        </div>
      </div>
    </EditTableFilterLayout>
  );
}

export default EditTableFilterComponent
