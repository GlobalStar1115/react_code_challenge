import React, { useState, useEffect } from 'react'
import { useStore } from 'react-redux'
// common components
import TableComponent from '../../../CommonComponents/TableComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'
// components
import ModalAddNegatives from '../../modals/ModalAddNegatives'
// helper
import { formatValue } from '../../../../services/helper'

const CampaignKeywordsCleanerSalesTable = ({ campaignType, currentAdGroupId, selectedKeyword }) => {
  const store = useStore()
  const {
    header,
    campaign,
    campaignDetail: { isNegativeKWLoading, negativeKWData },
  } = store.getState()
  // header
  const {
    currentStartDate,
    currentEndDate,
  } = header

  const {
    dashboardKeywordCleanerRelatedTerms,
    isDashboardKeywordCleanerRelatedTermsLoading,
    loadDashboardKeywordCleanerRelatedTermsResponse,
  } = campaign
  // state
  const [ searchText, setSearchText ] = useState('')
  const [ terms, setTerms ] = useState([])
  const [ selectedSearchTerms, setSelectedSearchTerms ] = useState([])
  const [ showAddToCampaignModal, setShowAddToCampaignModal ] = useState(false)
  // table fields
  const fields = [
    { value: 'term', label: 'Search Term', sort: true, dataType: 'string', },
    { value: "clicks", label: 'Clicks', sort: true, dataType: 'number', },
    { value: 'cost', label: 'Ad Spend', sort: true, dataType: 'number', primarySort: true, },
  ]
  // check keword for keyword
  const handleCheckTerm = (val, data) => {
    if (val) {
      setSelectedSearchTerms([
        ...selectedSearchTerms,
        { ...data }
      ])
    } else {
      setSelectedSearchTerms([...selectedSearchTerms.filter(
        searchTerm => searchTerm.term !== data.term
      )])
    }
  }
  const handleCheckAllTerms = (val, data) => {
    setSelectedSearchTerms([])
    if (val) {
      setSelectedSearchTerms([...data])
    }
  }
  const handleChangeSearchText = (text) => {
    setSearchText(text)
    if (!text) {
      setSearchText('')
    }
  }
  const handleAddNegativesToCampaign = () => {
    if (selectedSearchTerms.length === 0) {
      toast.show({
        title: 'Warning',
        description: 'Please select search terms.',
      })
    }
    setShowAddToCampaignModal(true)
  }
  useEffect(() => {
    if (!selectedKeyword || Object.keys(selectedKeyword).length === 0) {
      setTerms([])
      return
    }
    if (isDashboardKeywordCleanerRelatedTermsLoading) {
      setTerms([])
      return
    }
    if (loadDashboardKeywordCleanerRelatedTermsResponse && loadDashboardKeywordCleanerRelatedTermsResponse !== '') {
      setTerms([])
      return
    }
    if (!dashboardKeywordCleanerRelatedTerms || dashboardKeywordCleanerRelatedTerms.length === 0) {
      setTerms([])
      return
    }
    if (!dashboardKeywordCleanerRelatedTerms.termsWithoutSales || dashboardKeywordCleanerRelatedTerms.termsWithoutSales.length === 0) {
      setTerms([])
      return
    }
    let tmpTerms = [...dashboardKeywordCleanerRelatedTerms.termsWithoutSales]

    if (!isNegativeKWLoading) {
      if (negativeKWData && negativeKWData.length > 0) {
        tmpTerms = tmpTerms.filter(term => !negativeKWData.find(keyword => keyword.keywordText === term.term))
      }
    }
    tmpTerms = tmpTerms.filter(term => term.term.toLowerCase().search(searchText.toLowerCase()) !== -1)
    tmpTerms = tmpTerms.map(term => ({
      ...term,
      clicks: formatValue(term.clicks, 'removeZeroDecimal'),
      checked: selectedSearchTerms && selectedSearchTerms.length > 0 ? selectedSearchTerms.filter(selectedTerm => selectedTerm.term === term.term).length > 0 : false,
    }))
    setTerms(tmpTerms)
  }, [
    selectedKeyword,
    selectedSearchTerms,
    isDashboardKeywordCleanerRelatedTermsLoading,
    dashboardKeywordCleanerRelatedTerms,
    loadDashboardKeywordCleanerRelatedTermsResponse,
    isNegativeKWLoading,
    negativeKWData,
    searchText,
  ])

  const selectedSTs = selectedSearchTerms.map(st => ({
    ...st,
    search: st.term,
  }))

  const isLoading = isDashboardKeywordCleanerRelatedTermsLoading || isNegativeKWLoading
  return (
    <div className="table-container">
      <div className="table-title">
        <h5>Search terms without sales</h5>
      </div>
      <div className="table-action">
        {
          selectedSearchTerms.length > 0 && (
            <button
              type="button"
              className="btn btn-green"
              onClick={() => { handleAddNegativesToCampaign() }}
            >
              Add Negatives to Campaign
            </button>
          )
        }
      </div>
      <div className={isLoading ? "table-content loading" : "table-content"}>
        { isLoading && <LoaderComponent /> }
        <TableComponent
          fields={fields}
          rows={terms}
          showColumns
          showTools
          showCheckColumn
          showSearch
          checkHandle={handleCheckTerm}
          checkAll={handleCheckAllTerms}
          onChangeSearchText={handleChangeSearchText}
          startDate={currentStartDate}
          endDate={currentEndDate}
        />
      </div>
      <ModalAddNegatives
        terms={selectedSTs}
        modalType="keyword-cleaner"
        campaignType={campaignType}
        showModal={showAddToCampaignModal && selectedSearchTerms && selectedSearchTerms.length > 0}
        currentAdGroupId={currentAdGroupId}
        onClose={() => { setShowAddToCampaignModal(false) }}
      />
    </div>
  )
}
export default CampaignKeywordsCleanerSalesTable