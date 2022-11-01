import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import TableComponent from '../CommonComponents/TableComponent'

//--actions
import {
  getCampaignExAsinsByTargetBulk
} from '../../redux/actions/targeting'

// helper
import { formatValue } from '../../services/helper'

const ExpansionAsinTargetingComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const {
    selectedCampaigns,
  } = props

  const {
    auth: { token },
    targeting: { isExAsinsByTargetBulkLoading, exAsinsByTargetBulk },
  } = store.getState()

  // eslint-disable-next-line
  const [ keywordsData, setKeywordsData ] = useState([])
  const [ asins, setAsins ] = useState([])
  const [ selectedAsins, setSelectedAsins ] = useState([])
  const [ isNewAsinsOnly, setIsNewAsinsOnly ] = useState(true)

  const acosRef = useRef()

  useEffect(() => {
    acosRef.current.value = 30
  })

  useEffect(() => {
    if (!exAsinsByTargetBulk || exAsinsByTargetBulk.length === 0) {
      return
    }

    setAsins(exAsinsByTargetBulk.map(asin => ({
      ...asin,
      productName: asin.title.substring(0, 25),
      tooltip: asin.title,
      ctr: formatValue(asin.ctr, 'number', 2),
      acos: formatValue(asin.acos, 'number', 2),
      checked: setSelectedAsins && setSelectedAsins.length > 0 ? setSelectedAsins.filter(selected_asin => selected_asin.id === asin.id).length > 0 : false,
    })))
  }, [exAsinsByTargetBulk, setSelectedAsins])

  const fields = [
    { value: 'image', label: '', type: 'image' },
    { value: 'productName', label: 'Product', flex: '2' },
    { value: 'asin', label: 'Asin' },
    { value: 'campaign', label: 'Campaign' },
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
  const handleFindAsinsByTarget = () => {
    if (selectedCampaigns.length === 0) {
      return
    }
    if (!acosRef.current.value || acosRef.current.value <= 0.1) {
      return
    }

    const targetData = {
      user: 238,
      acosfrom1: acosRef.current.value,
      acostill: 0,
      campaign: selectedCampaigns.map(campaign => campaign.campaignid),
      startDate: moment('2021-05-02').format('YYYY-MM-DD'),
      endDate: moment('2021-05-31').format('YYYY-MM-DD'),
      typeTarget: 'asin',
      token,
    }

    dispatch(getCampaignExAsinsByTargetBulk({ targetData, token }))
  }

  const checkAsinHandle = (val, data) => {
    val ? setSelectedAsins(prevState => [ ...prevState, data]) : setSelectedAsins(selectedAsins.filter(asin => asin.id !== data.id))
  }

  const checkAsinAll = (val, data) => {
    val ? setSelectedAsins(data) : setSelectedAsins([])
  }

  const onChangeNewAsinsOnly = (val) => {
    setIsNewAsinsOnly(val)
  }

  // Add keywords to new campaign
  const handleAddToNewCampaign = (keywords) => {
    if (!keywords || keywords.length === 0) {
      return
    }
    history.push({ pathname: 'campaigns/new/sp', state: { params: keywords } })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = (keywords) => {
    if (!keywords || keywords.length === 0) {
      return
    }
  }

  const renderTableAction = () => {
    if (!selectedAsins || selectedAsins.length === 0)
      return
    return (
      <div className="ex-asin-action">
        <button
          type="button"
          className="btn btn-usual btn-active"
          onClick={() => { handleAddToExistingCampaign('enabled') }}
        >
          Add to Existing Campaign
        </button>
        <button
          type="button"
          className="btn btn-usual btn-remove"
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
  const tableData = isNewAsinsOnly ? asins.filter(asin => asin.asin) : asins
  return (
    <div className="expansion-asin-targeting">
      <div className="asin-targeting-header">
        <span>Acos Target Zone, %</span>
        <div className="input-container">
          <input type='number' className='acosTargetInput' ref={ acosRef } placeholder='acos target zone'/>
        </div>
      </div>
      <button type="button" className="btn-accent btn-find-asin" onClick={ handleFindAsinsByTarget }>
        Continue
      </button>
      <div className={ isExAsinsByTargetBulkLoading ? "asin-targeting-container loading" : "asin-targeting-container" }>
        { isExAsinsByTargetBulkLoading && <LoaderComponent /> }
        <div className="asin-filter">
          <CheckboxComponent
            label='New Asins Only'
            checked={ isNewAsinsOnly }
            onChange={ onChangeNewAsinsOnly }
          />
        </div>
        { renderTableAction() }
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { tableData }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkAsinHandle }
          checkAll = { checkAsinAll }
        />
      </div>
      { renderKeywordContainer() }
    </div>
  );
}

export default ExpansionAsinTargetingComponent
