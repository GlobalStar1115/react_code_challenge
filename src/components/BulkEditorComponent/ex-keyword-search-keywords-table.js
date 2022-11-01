import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TableComponent from '../CommonComponents/TableComponent'

// helper
import { formatValue } from '../../services/helper' // eslint-disable-line

const ExpansionKeywordSearchKeywordsTableComponent = (props) => {
  const store = useStore()
  const history = useHistory()

  const {
    auth: { token }, // eslint-disable-line
    campaign: { exFindKeywordsBulk, isExFindKeywordsBulkLoading },
  } = store.getState()

  // eslint-disable-next-line
  const [ keywordsData, setKeywordsData ] = useState([]) // eslint-disable-line
  const [ findKeywords, setFindKeywords ] = useState([]) // eslint-disable-line
  const [ selectedFindKeywords, setSelectedFindKeywords ] = useState([])

  useEffect(() => {
    if (!exFindKeywordsBulk || exFindKeywordsBulk.length === 0) {
      return
    }

    let newFindKeywords = exFindKeywordsBulk[0] && exFindKeywordsBulk[0].length > 0 ? exFindKeywordsBulk[0] : [] // eslint-disable-line

    newFindKeywords = newFindKeywords.length > 0 && newFindKeywords.map(keyword => ({
      ...keyword,
      ctr: formatValue(keyword.ctr, 'number', 2),
      acos: formatValue(keyword.revenue ? keyword.cost / keyword.revenue : 0, 'number', 2),
      checked: selectedFindKeywords && selectedFindKeywords.length > 0 ? selectedFindKeywords.filter(selectedKeyword => selectedKeyword.id === keyword.id).length > 0 : false,
    }))

    exFindKeywordsBulk.length > 0 && exFindKeywordsBulk.map((keyword, ind) => {
      if (ind >= 2 && keyword[0].matchtype !== null) {
        newFindKeywords = newFindKeywords.map(newKeyword=> {
          if (newKeyword['campaign id'] === keyword[0].campaignid) {
            return {
              ...newKeyword,
              matchtypes: keyword[0].matchtype,
            }
          }
          return newKeyword
        })
      }
      return ''
    })
    newFindKeywords.length > 0 ? setFindKeywords(newFindKeywords) : setFindKeywords([])
  }, [exFindKeywordsBulk, selectedFindKeywords])

  const fields = [
    { value: 'keyword', label: 'Keyword', flex: '2' },
    { value: 'campaign', label: 'Campaign name', flex: '2' },
    { value: 'matchtypes', label: 'Match Type' },
    { value: 'profit1', label: 'profit', flex: '2' },
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

  const checkFindKeywordsHandle = ( val, data ) => {
    val ? setSelectedFindKeywords( prevState => [ ...prevState, data]) : setSelectedFindKeywords( selectedFindKeywords.filter(keyword => keyword.id !== data.id))
  }
  const checkFindKeywordsAll = ( val, data ) => {
    val ? setSelectedFindKeywords(data) : setSelectedFindKeywords([])
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
    if (!selectedFindKeywords || selectedFindKeywords.length === 0) {
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
  return (
    <div className="keyword-search-keywords-table-container">
      <div className={isExFindKeywordsBulkLoading ? "keyword-search-keywords-table loading" : "keyword-search-keywords-table"}>
        { isExFindKeywordsBulkLoading && <LoaderComponent /> }
        { renderTableAction() }
        <TableComponent
          fields = { fields }
          totals = { totals }
          rows = { findKeywords }
          showColumns
          showTools
          showCheckColumn
          showSearch
          showHistory
          showFilter
          ShowColumnCustomizer
          checkHandle = { checkFindKeywordsHandle }
          checkAll = { checkFindKeywordsAll }
        />
      </div>
    </div>
  );
}
export default ExpansionKeywordSearchKeywordsTableComponent