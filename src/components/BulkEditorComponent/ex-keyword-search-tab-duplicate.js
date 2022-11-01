import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TableComponent from '../CommonComponents/TableComponent'

import { formatValue } from '../../services/helper'

import {
  getCampaignExFindDuplicateKeywords
} from '../../redux/actions/campaign'

const ExpansionDuplicateTabComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const {
    selectedCampaigns,
    selectedSkus,
  } = props

  const {
    auth: { token },
    campaign: { isExFindDuplicateKeywordsBulkLoading, exFindDuplicateKeywordsBulk },
  } = store.getState()

  // eslint-disable-next-line
  const [ keywordsData, setKeywordsData ] = useState([])
  const [ duplicateKeywords, setDuplicateKeywords ] = useState([])
  const [ selectedDuplicateKeywords, setSelectedDuplicateKeywords ] = useState([])

  useEffect(() => {
    if (!exFindDuplicateKeywordsBulk || exFindDuplicateKeywordsBulk.length === 0) {
      return
    }
    setDuplicateKeywords(exFindDuplicateKeywordsBulk.map(keyword => ({
      ...keyword,
      ctr: formatValue(keyword.ctr, 'number', 2),
      acos: formatValue(keyword.revenue ? keyword.cost / keyword.revenue : 0, 'number', 2),
      avcpc: formatValue(keyword.avcpc, 'number', 2),
      checked: selectedDuplicateKeywords && selectedDuplicateKeywords.length > 0 ? selectedDuplicateKeywords.filter(selected_keyword => selected_keyword.id === keyword.id).length > 0 : false,
    })))
  }, [exFindDuplicateKeywordsBulk, selectedDuplicateKeywords])

  const fields = [
    { value: 'keyword', label: 'Keyword', flex: '2' },
    { value: 'match1', label: 'Match Type' },
    { value: 'profit1', label: 'Profit' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost', label: 'Ad Spend' },
    { value: 'impressions', label: 'Impress' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'ctr', label: 'CTR %' },
    { value: 'avcpc', label: 'Ave CPC' },
    { value: 'acos', label: 'ACoS %' },
    { value: 'orders', label: 'Orders.' },
  ]
  const totals = []

  // Load Search Terms with Acos, campaigns
  const handleFindDuplicateKeywords = () => {
    let campaignData = ''

    if (selectedSkus.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    campaignData = {
      user: 238,
      campaign: selectedCampaigns.map(campaign => campaign.campaignid),
      startDate: moment('2021-05-02').format('YYYY-MM-DD'),
      endDate: moment('2021-05-31').format('YYYY-MM-DD'),
      token,
      SKU: selectedSkus.map(sku => sku.sku),
    }
    dispatch(getCampaignExFindDuplicateKeywords({ campaignData, token }))
  }

  const checkHandle = ( val, data ) => {
    val ? setSelectedDuplicateKeywords( prevState => [ ...prevState, data]) : setSelectedDuplicateKeywords( selectedDuplicateKeywords.filter(keyword => keyword.id !== data.id))
  }
  const checkAll = ( val, data ) => {
    val ? setSelectedDuplicateKeywords(data) : setSelectedDuplicateKeywords([])
  }

  // Add keywords to new campaign
  const handleAddToNewCampaign = (keywords) => {
    if (!keywords || keywords.length === 0) {
      return
    }
    keywords && keywords.length > 0 && history.push({ pathname: 'campaigns/new/sp', state: { params: keywords }, })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = (keywords) => {
    if (!keywords || keywords.length ===0) {
      return
    }
  }

  const renderTableAction = () => {
    if (!selectedDuplicateKeywords || selectedDuplicateKeywords.length === 0)
      return
    return (
      <div className="ex-match-type-action">
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
    <div className="expansion-match-type">
      <button type="button" className="btn-accent btn-find-match-type" onClick={ handleFindDuplicateKeywords }>
        Continue
      </button>
      <div className={isExFindDuplicateKeywordsBulkLoading ? "match-type-container loading" : "match-type-container"}>
        { isExFindDuplicateKeywordsBulkLoading && <LoaderComponent /> }
        {renderTableAction()}
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { duplicateKeywords }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkHandle }
          checkAll = { checkAll }
        />
      </div>
      {renderKeywordContainer()}
    </div>
  );
}

export default ExpansionDuplicateTabComponent
