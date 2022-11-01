import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Select from 'react-select'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TableComponent from '../CommonComponents/TableComponent'
import ExpansionModalAddKeywordsToExsitingCampaign from './modals/ex-add-keyword-exsiting-campaign'

import { formatValue } from '../../services/helper'

import {
  getCampaignExMatchTypeSearchbyACoSmult,
} from '../../redux/actions/campaign'

import {
  MAX_KEYWORD_SELECTED,
} from '../../utils/constants/defaultValues'

const ExpansionMatchTypeComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const {
    selectedCampaigns,
    selectedSkus,
  } = props

  const {
    auth: { token },
    campaign: { isExMatchTypeBulkLoading, exMatchTypeBulk },
  } = store.getState()

  const [ matchTypes, setMatchTypes ] = useState([])
  const [ selectedMatchTypes, setSelectedMatchTypes ] = useState([])
  const [ showExistingModal, setShowExistingModal ] = useState(false)

  const acosRef = useRef()

  useEffect(() => {
    acosRef.current.value = 30
  })

  useEffect(() => {
    if (!exMatchTypeBulk || exMatchTypeBulk.length === 0) {
      return
    }
    setMatchTypes(exMatchTypeBulk.map(match_type => ({
      ...match_type,
      ctr: formatValue(match_type.ctr, 'number', 2),
      acos: formatValue(match_type.acos, 'number', 2),
      avcpc: formatValue(match_type.avcpc, 'number', 2),
      checked: selectedMatchTypes && selectedMatchTypes.length > 0 ? selectedMatchTypes.filter(selected_match_type => selected_match_type.id === match_type.id).length > 0 : false,
    })))
  }, [exMatchTypeBulk, selectedMatchTypes])

  const fields = [
    { value: 'keyword', label: 'Associated Keyword/Target', flex: '4' },
    { value: 'match1', label: 'Match Type' },
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

  const matchOptions = [
    {
      label: 'Broad Only (Test in Phrase/Exact)',
      value: 'broad',
    },
    {
      label: 'Phrase Only (Test in Broad/Exact)',
      value: 'phrase',
    },
    {
      label: 'Exact Only (Test in Broad/Phrase)',
      value: 'exact',
    },
    {
      label: 'Broad and Phrase Only (Test in Exact)',
      value: 'broad,phrase',
    },
    {
      label: 'Broad and Exact Only (Test in Phrase)',
      value: 'broad,exact',
    },
    {
      label: 'Phrase and Exact Only (Test in Broad)',
      value: 'phrase,exact',
    },
    {
      label: 'Broad, Phrase and Exact',
      value: 'broad,phrase,exact',
    },
  ]
  // Load Search Terms with Acos, campaigns
  const onFindMatchTypes = () => {
    let campaignData = ''

    if (selectedSkus.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    if (!acosRef.current.value || acosRef.current.value <= 0.1) {
      return
    }

    campaignData = {
      user: 238,
      campaign: selectedCampaigns.map(campaign => campaign.campaignid),
      startDate: moment('2021-05-02').format('YYYY-MM-DD'),
      endDate: moment('2021-05-31').format('YYYY-MM-DD'),
      acosfrom: 0,
      acosfrom1: acosRef.current.value,
      acostill: 0,
      token,
      SKU: selectedSkus.map(sku => sku.sku),
    }
    dispatch(getCampaignExMatchTypeSearchbyACoSmult({ campaignData, token }))
  }

  const checkMatchHandle = ( val, data ) => {
    val ? setSelectedMatchTypes( prevState => [ ...prevState, data]) : setSelectedMatchTypes( selectedMatchTypes.filter(match_type => match_type.id !== data.id))
  }
  const checkMatchAll = ( val, data ) => {
    val ? setSelectedMatchTypes(data) : setSelectedMatchTypes([])
  }

  // Add keywords to new campaign
  const handleAddToNewCampaign = () => {
    // FIXME: show message box: Match Types required!
    if (!selectedMatchTypes || selectedMatchTypes.length === 0) {
      return
    }
    history.push({ pathname: 'campaigns/new/sp', state: { params: selectedMatchTypes } })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = () => {
    // FIXME: show message box: Campaigns and Match Types required!
    if (!selectedMatchTypes || selectedMatchTypes.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    // FIXME: show message box: Please enter ACoS greater than 0.1
    if (!acosRef || acosRef.current.value <= 0.1) {
      return
    }
    // FIXME: show message box: Limit Exceeded. Ad groups may have a max of 1000 keywords.
    if (selectedMatchTypes.length > MAX_KEYWORD_SELECTED) {
      return
    }
    setShowExistingModal(true)
  }

  const handleHideAddToExistingModal = () => {
    setShowExistingModal(false)
  }

  const renderTableAction = () => {
    if (!selectedMatchTypes || selectedMatchTypes.length === 0) {
      return
    }
    return (
      <div className="ex-match-type-action">
        <button
          type="button"
          className="btn btn-active"
          onClick={() => { handleAddToExistingCampaign() }}
        >
          Add to Existing Campaign
        </button>
        <button
          type="button"
          className="btn btn-remove"
          onClick={() => { handleAddToNewCampaign() }}
        >
          Add to New Campaign
        </button>
      </div>
    )
  }
  const renderKeywordContainer = () => {
    return (
      <div className="keyword-container">
        <div className="container-title">Selected Keywords</div>
        <div className="container-keywords">
            <div className="keyword-box">Amazon</div>
        </div>
        <div className="container-footer">
          <button type="button" className="btn-usual">Individual Words</button>
          <button type="button" className="btn-usual">Remove Special Characters</button>
          <button type="button" className="btn-usual">Copy to Clipboard</button>
        </div>
      </div>
    )
  }
  return (
    <div className="expansion-match-type">
      <div className="match-type-header">
        <span>Acos Target Zone, %</span>
        <div className="input-container">
          <input type='number' className='acosTargetInput' ref={ acosRef } placeholder='acos target zone'/>
        </div>
      </div>
      <button type="button" className="btn-accent btn-find-match-type" onClick={ onFindMatchTypes }>
        Continue
      </button>
      <div className={isExMatchTypeBulkLoading ? "match-type-container loading" : "match-type-container"}>
        { isExMatchTypeBulkLoading && <LoaderComponent /> }
        <div className="match-type-filter">
          <Select
            options={matchOptions}
          />
        </div>
        {renderTableAction()}
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { matchTypes }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkMatchHandle }
          checkAll = { checkMatchAll }
        />
      </div>
      { renderKeywordContainer() }
      {
        showExistingModal &&
        <ExpansionModalAddKeywordsToExsitingCampaign
          pageForAdd = 'Keywords'
          onHideModal = { handleHideAddToExistingModal }
          keywords = { selectedMatchTypes.map(match => (
            {
              ...match,
              matchType: match.match1
            }
          )) }
          campaigns = { selectedCampaigns }
        />
      }
    </div>
  );
}

export default ExpansionMatchTypeComponent
