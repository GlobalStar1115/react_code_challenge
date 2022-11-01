import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TableComponent from '../CommonComponents/TableComponent'

import {
  getCampaignExCategoriesByTargetBulk
} from '../../redux/actions/targeting'

import { formatValue } from '../../services/helper'

const ExpansionCategoryTargetingComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const {
    selectedCampaigns, // eslint-disable-next-line
    selectedSkus,
  } = props

  const {
    auth: { token },
    targeting: { isExCategoriesByTargetBulkLoading, exCategoriesByTargetBulk },
  } = store.getState()

  // eslint-disable-next-line
  const [ keywordsData, setKeywordsData ] = useState([])
  const [ categories, setCategories ] = useState([])
  const [ selectedCategories, setSelectedCategories ] = useState([])

  const acosRef = useRef()

  useEffect(() => {
    acosRef.current.value = 30
  })

  useEffect(() => {
    if (!exCategoriesByTargetBulk || exCategoriesByTargetBulk.length === 0) {
      return
    }
    setCategories(exCategoriesByTargetBulk.map(category => ({
      ...category,
      ctr: formatValue(category.ctr, 'number', 2),
      acos: formatValue(category.acos, 'number', 2),
      checked: selectedCategories && selectedCategories.length > 0 ? selectedCategories.filter(selected_category => selected_category.id === category.id).length > 0 : false
    })))
  }, [exCategoriesByTargetBulk, selectedCategories])

  const fields = [
    { value: 'category', label: 'Category' },
    { value: 'campaign', label: 'Campaign', flex: '2' },
    { value: 'asin', label: 'Associated Asins', flex: '2' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost', label: 'Ad Spend' },
    { value: 'impressions', label: 'Impress'},
    { value: 'clicks', label: 'Clicks'},
    { value: 'ctr', label: 'CTR %' },
    { value: 'avcpc', label: 'Ave CPC' },
    { value: 'conversionrate', label: 'Conv.%' },
    { value: 'acos', label: 'ACoS %' },
    { value: 'orders', label: 'Orders.' },
  ]
  const totals = []
  // Load Search Terms with Acos, campaigns
  const onFindAsinsByTarget = () => {
    if (selectedCampaigns.length === 0) {
      return
    }
    if (!acosRef.current.value || acosRef.current.value <= 0.1) {
      return
    }

    // FIXME use current user id, startDate and endDate
    const targetData = {
      user: 238,
      acosfrom1: acosRef.current.value,
      acostill: 0,
      campaign: selectedCampaigns.map(campaign=>campaign.campaignid),
      startDate: moment('2021-05-02').format('YYYY-MM-DD'),
      endDate: moment('2021-05-31').format('YYYY-MM-DD'),
      typeTarget: 'category',
      token,
    }
    dispatch(getCampaignExCategoriesByTargetBulk({ targetData, token}))
  }

  const checkCategoryHandle = ( val, data ) => {
    val ? setSelectedCategories( prevState => [ ...prevState, data]) : setSelectedCategories(selectedCategories.filter(category => category.id !== data.id))
  }
  const checkCategoryAll = ( val, data ) => {
    val ? setSelectedCategories(data) : setSelectedCategories([])
  }
  // Add keywords to new campaign
  const handleAddToNewCampaign = (keywords) => {
    if (!keywords || keywords.length === 0) {
      return
    }
    history.push({ pathname: 'campaigns/new/sp', state: { params: keywords }, })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = (keywords) => {
    if (!keywords || keywords.length === 0) {
      return
    }
  }

  const renderTableAction = () => {
    if (!selectedCategories || selectedCategories.length === 0) {
      return
    }
    return (
      <div className="ex-asin-action">
        <button
          type="button"
          className="btn btn-active"
          onClick={() => { handleAddToExistingCampaign('enabled') }}
        >
          Add to Existing Campaign
        </button>
        <button
          type="button"
          className="btn btn-remove"
          onClick={() => { handleAddToNewCampaign('enabled') }}
        >
          Add to New Campaign
        </button>
      </div>
    )
  }
  const renderKeywordContainer = () => {
    return (
      <div className="keyword-container">
        <div className="container-title">{} Keywords found</div>
        <div className="container-keywords">
          <div className="keyword-box">Amazon</div>
        </div>
        <div className="container-footer">
          <button type="button" className="btn-usual" onClick={() => { handleAddToNewCampaign(keywordsData) }}>Add to New Campaign</button>
          <button type="button" className="btn-usual" onClick={() => { handleAddToExistingCampaign(keywordsData) }}>Add to Exisiting Campaign</button>
          <button type="button" className="btn-usual">Copy to Clipboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="expansion-asin-targeting">
      <div className="asin-targeting-header">
        <span>Acos Target Zone, %</span>
        <div className="input-container">
          <input type="number" className="acosTargetInput" ref={ acosRef } placeholder="acos target zone"/>
        </div>
      </div>
      <button type="button" className="btn-accent btn-find-asin" onClick={ onFindAsinsByTarget }>
        Continue
      </button>
      <div className={ isExCategoriesByTargetBulkLoading ? "asin-targeting-container loading" : "asin-targeting-container" }>
        { isExCategoriesByTargetBulkLoading && <LoaderComponent /> }
        { renderTableAction() }
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { categories }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkCategoryHandle }
          checkAll = { checkCategoryAll }
        />
      </div>
      { renderKeywordContainer() }
    </div>
  );
}

export default ExpansionCategoryTargetingComponent
