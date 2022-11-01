import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TableComponent from '../CommonComponents/TableComponent'

import { formatValue } from '../../services/helper' // eslint-disable-line

const ExpansionKeywordSearchTermssTableComponent = (props) => {
  const dispatch = useDispatch() // eslint-disable-line
  const store = useStore()
  const history = useHistory()

  const {
    auth: { token }, // eslint-disable-line
    campaign: { exFindKeywordsBulk, isExFindKeywordsBulkLoading },
  } = store.getState()

  // eslint-disable-next-line
  const [ keywordsData, setKeywordsData ] = useState([]) // eslint-disable-line
  const [ searchTerms, setSearchTerms ] = useState([]) // eslint-disable-line
  const [ selectedSearchTerms, setSelectedSearchTerms ] = useState([])

  useEffect(() => {
    if (!exFindKeywordsBulk || exFindKeywordsBulk.length === 0) {
      return
    }

    const newSearchTerms = exFindKeywordsBulk[1] ? exFindKeywordsBulk[1] : [] // eslint-disable-line
    newSearchTerms.length > 0 && setSearchTerms(newSearchTerms.map(term => ({
      ...term,
      ctr: formatValue(term.ctr, 'number', 2),
      acos: formatValue(term.revenue ? term.cost / term.revenue : 0, 'number', 2),
      checked: selectedSearchTerms && selectedSearchTerms.length > 0 ? selectedSearchTerms.filter(selectedTerm => selectedTerm.id === term.id).length > 0 : false,
    })))
  }, [exFindKeywordsBulk, selectedSearchTerms])

  const fields = [
    { value: 'search', label: 'Search Term', flex: '2' },
    { value: 'match1', label: 'Match Type' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost', label: 'Ad Spend' },
    { value: 'impressions', label: 'Impress'},
    { value: 'clicks', label: 'Clicks'},
    { value: 'ctr', label: 'CTR %' },
    { value: 'avcpc', label: 'Ave CPC' },
    { value: 'acos', label: 'ACoS %' },
    { value: 'orders', label: 'Orders.' },
  ]
  const totals = []

  const checkSearchTermsHandle = ( val, data ) => {
    val ? setSelectedSearchTerms( prevState => [ ...prevState, data]) : setSelectedSearchTerms( selectedSearchTerms.filter(term => term.id !== data.id))
  }
  const checkSearchTermsAll = ( val, data ) => {
    val ? setSelectedSearchTerms(data) : setSelectedSearchTerms([])
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
    if (!selectedSearchTerms || selectedSearchTerms.length === 0){
      return
    }

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
  return (
    <div className="keyword-search-terms-table-container">
      <div className={isExFindKeywordsBulkLoading ? "keyword-search-terms-table loading" : "keyword-search-terms-table"}>
        { isExFindKeywordsBulkLoading && <LoaderComponent /> }
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
          checkHandle = { checkSearchTermsHandle }
          checkAll = { checkSearchTermsAll }
        />
      </div>

      { renderKeywordContainer() }
    </div>
  );
}
export default ExpansionKeywordSearchTermssTableComponent