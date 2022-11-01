import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import TableComponent from '../CommonComponents/TableComponent'
import ExpansionModalAddKeywordsToExsitingCampaign from './modals/ex-add-keyword-exsiting-campaign'

import {
  getCampaignExSearchTermSearchbyACoSmult,
  getCampaignExSearchTermRemoveKeywords,
} from '../../redux/actions/campaign'

import { formatValue } from '../../services/helper'

import {
  MAX_KEYWORD_SELECTED,
} from '../../utils/constants/defaultValues'

const ExpansionSearchTermComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const {
    selectedCampaigns,
    selectedSkus,
  } = props

  const {
    auth: { token },
    campaign: { isExSearchTermBulkLoading, exSearchTermBulk },
  } = store.getState()

  const [ searchTerms, setSearchTerms ] = useState([])
  const [ selectedSearchTerms, setSelectedSearchTerms ] = useState([])
  const [ isNewKeywordsOnly, setIsNewKeywordsOnly ] = useState(true)
  const [ isRemoveAsin, setIsRemoveAsin ] = useState(true)
  const [ showExistingModal, setShowExistingModal ] = useState(false)

  const acosRef = useRef()

  useEffect(() => {
    acosRef.current.value = 30
  })

  useEffect(() => {
    if (!exSearchTermBulk || exSearchTermBulk.length === 0) {
      return
    }
    setSearchTerms(exSearchTermBulk.map(searchTerm => ({
      ...searchTerm,
      ctr: formatValue(searchTerm.ctr, 'number', 2),
      acos: formatValue(searchTerm.acos, 'number', 2),
      checked: selectedSearchTerms && selectedSearchTerms.length > 0 ? selectedSearchTerms.filter(selectedSearchTerm => selectedSearchTerm.id === searchTerm.id).length > 0 : false,
    })))
  }, [exSearchTermBulk, selectedSearchTerms])

  const fields = [
    { value: 'search', label: 'Search Term', flex: '3' },
    { value: 'image_sm', label: 'Product Image', flex: '2', type: 'image' },
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
  // Load Search Terms with Acos, campaigns
  const handleFindSearchTerms = () => {
    let campaignData = ''
    if (selectedSkus.length === 0 || selectedCampaigns.length === 0) {
      return
    }

    if (isNewKeywordsOnly) {
      campaignData = {
        user: 238,
        campaign: selectedCampaigns.map(campaign => campaign.campaignid),
        startDate: moment('2021-05-02').format('YYYY-MM-DD'),
        endDate: moment('2021-05-31').format('YYYY-MM-DD'),
        acosfrom: 0,
        acostill: acosRef.current.value,
        token,
        SKU: selectedSkus.map(sku => sku.sku),
      }
      dispatch(getCampaignExSearchTermRemoveKeywords({ campaignData, token }))
    } else {
      campaignData = {
        user: 238,
        campaign: selectedCampaigns.map(campaign => campaign.campaignid),
        startDate: moment('2021-05-02').format('YYYY-MM-DD'),
        endDate: moment('2021-05-31').format('YYYY-MM-DD'),
        acosfrom: 0,
        acosfrom1: acosRef.current.value,
        acostill: 0.001,
        token,
        SKU: selectedSkus.map(sku => sku.sku),
      }
      dispatch(getCampaignExSearchTermSearchbyACoSmult({ campaignData, token }))
    }
  }

  const checkSearchTermHandle = ( val, data ) => {
    val ? setSelectedSearchTerms( prevState => [ ...prevState, data]) : setSelectedSearchTerms( selectedSearchTerms.filter(searchTerm => searchTerm.id !== data.id))
  }
  const checkSearchTermAll = ( val, data ) => {
    val ? setSelectedSearchTerms(data) : setSelectedSearchTerms([])
  }

  const handleChangeNewKeywordsOnly = ( val ) => {
    setIsNewKeywordsOnly(val)
  }
  const handleChangeRemoveAsion = ( val ) => {
    setIsRemoveAsin(val)
  }

  // Add keywords to new campaign
  const handleAddToNewCampaign = () => {
    // FIXME: show message box: Search Terms required!
    if (!selectedSearchTerms || selectedSearchTerms.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    history.push({ pathname: 'campaigns/new/sp', state: { params: selectedSearchTerms } })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = () => {
    // FIXME: show message box: Campaign and Search Terms required!
    if (!selectedSearchTerms || selectedSearchTerms.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    const searchTermsForAddToExistingCampaign = selectedSearchTerms.filter(searchTerm => searchTerm.search !== '(_targeting_auto_)')
    // FIXME: show message box: Limit Exceeded. Ad groups may have a max of 1000 keywords.
    if (searchTermsForAddToExistingCampaign.length > MAX_KEYWORD_SELECTED) {
      return
    }
    setShowExistingModal(true)
  }

  const handleHideAddToExistingModal = () => {
    setShowExistingModal(false)
  }

  const renderTableAction = () => {
    if (!selectedSearchTerms || selectedSearchTerms.length === 0) {
      return
    }

    return (
      <div className="ex-search-term-action">
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
          <button type="button" className="btn-usual">Clear Text Box</button>
          <button type="button" className="btn-usual">Copy to Clipboard</button>
        </div>
      </div>
    )
  }
  return (
    <div className="expansion-search-term">
      <div className="search-term-header">
        <span>Acos Target Zone, %</span>
        <div className="input-container">
          <input type="number" className="acosTargetInput" ref={ acosRef } placeholder="acos target zone"/>
        </div>
      </div>
      <button type="button" className="btn-accent btn-find-search-term" onClick={ handleFindSearchTerms }>
        Continue
      </button>
      <div className={isExSearchTermBulkLoading ? "search-term-container loading" : "search-term-container"}>
        { isExSearchTermBulkLoading && <LoaderComponent /> }
        <div className="search-term-filter">
          <CheckboxComponent
            label='Remove Asin'
            checked={ isRemoveAsin }
            onChange={ handleChangeRemoveAsion }
          />
          <CheckboxComponent
            label='New Keywords Only'
            checked={ isNewKeywordsOnly }
            onChange={ handleChangeNewKeywordsOnly }
          />
        </div>
        { renderTableAction() }
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { searchTerms }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkSearchTermHandle }
          checkAll = { checkSearchTermAll }
        />
      </div>
      { renderKeywordContainer() }
      {
        showExistingModal &&
        <ExpansionModalAddKeywordsToExsitingCampaign
          pageForAdd = 'Search Terms'
          onHideModal = { handleHideAddToExistingModal }
          keywords = { selectedSearchTerms }
          campaigns = { selectedCampaigns }
        />
      }
    </div>
  );
}

export default ExpansionSearchTermComponent
