import React, { useEffect, useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import OptimizationModalAddKeywordsToExsitingCampaign from './op-add-keyword-exsiting-campaign'

import { formatValue } from '../../services/helper'

import {
  showExistingModalAction,
  hideExistingModalAction,
} from '../../redux/actions/pageGlobal'

const OptimizationSearchTermComponent = (props) => {
  const store = useStore()
  const dispatch = useDispatch()

  const { campaign, targeting, pageGlobal } = store.getState()
  const {
    optSearchTermBulk,
    isOptSearchTermBulkLoading,
    isCreateOptNegativeKeywords,
    isCreateOptCampaignNegativeKeywords,
  } = campaign

  const {
    isCreateOptCampaignNegativeProductTargets,
    isCreateOptNegativeProductTargeting,
  } = targeting

  const { showExistingModal } = pageGlobal

  const [searchTerms, setSearchTerms] = useState([])
  const [selectedSearchTerms, setSelectedSearchTerms] = useState([])

  const [copySelected, setCopySelected] = useState(false)
  const [dataToShow, setDataToShow] = useState('')

  const handleAddToExistingCampaign = (dataToShow) => {
    dispatch(showExistingModalAction())
    setDataToShow(dataToShow)
  }

  const handleHideAddToExistingModal = () => {
    dispatch(hideExistingModalAction())
    setDataToShow('')
  }
  // End Modal

  const fields = [
    { value: 'search', label: 'Search Term', flex: '2' },
    { value: 'match1', label: 'Match Type' },
    { value: 'keyword', label: 'Associated Keyword/Target', flex: '3' },
    { value: 'campaign', label: 'Campaign', flex: '3' },
    { value: 'adgroup', label: 'Adgroup' },
    { value: 'clickorderratio', label: 'Clicks/Orders' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'impressions', label: 'Impr' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'ctr', label: 'Ctr %' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'conversionrate', label: 'Conv.%' },
    { value: 'cost', label: 'Ad Spend' },
    { value: 'acos', label: 'Acos%' },
  ]
  const totals = []

  const matchTypeOptions = [
    { label: 'Add as Negative Exact', value: 'Negative Exact' },
    { label: 'Add as Negative Phrase', value: 'Negative Phrase' },
  ]
  const [selectedMatchOption, setSelectedMatchOption] = useState(
    matchTypeOptions[0]
  )
  useEffect(() => {
    if (!optSearchTermBulk || optSearchTermBulk.length === 0) {
      return
    }
    const newSearchTerms = optSearchTermBulk.map((search_term) => {
      return {
        ...search_term,
        avcpc: search_term.avcpc
          ? formatValue(search_term.avcpc, 'number', 2)
          : 0,
        conversionrate: search_term.conversionrate
          ? formatValue(search_term.conversionrate, 'number', 2)
          : 0,
        acos: search_term.acos ? formatValue(search_term.acos, 'number', 2) : 0,
        ctr: search_term.ctr ? formatValue(search_term.ctr, 'number', 2) : 0,
        checked:
          selectedSearchTerms && selectedSearchTerms.length > 0
            ? selectedSearchTerms.filter(
                (selectedSearchTerm) => selectedSearchTerm.id === search_term.id
              ).length > 0
            : false,
      }
    })
    setSearchTerms(newSearchTerms)
  }, [optSearchTermBulk, selectedSearchTerms])

  const checkSearchTermHandle = (val, data) => {
    val
      ? setSelectedSearchTerms((prevState) => [...prevState, data])
      : setSelectedSearchTerms(
          selectedSearchTerms.filter((serachTerm) => serachTerm.id !== data.id)
        )
  }
  const checkSearchTermAll = (val, data) => {
    val ? setSelectedSearchTerms(data) : setSelectedSearchTerms([])
  }

  //handle Copy for search term
  const copiedItems = () => {
    return selectedSearchTerms.map((selectedSearchTerm) => {
      return (
        <div
          style={{ width: '500px', border: '2px solid grey' }}
          key={selectedSearchTerm.id}
        >
          {selectedSearchTerm.keyword}
        </div>
      )
    })
  }

  return (
    <div
      className={
        isCreateOptCampaignNegativeProductTargets ||
        isCreateOptCampaignNegativeKeywords ||
        isCreateOptNegativeProductTargeting ||
        isCreateOptNegativeKeywords ||
        isOptSearchTermBulkLoading
          ? 'optimization-search-term loading'
          : 'optimization-search-term'
      }
    >
      {(isCreateOptCampaignNegativeProductTargets ||
        isCreateOptCampaignNegativeKeywords ||
        isCreateOptNegativeProductTargeting ||
        isCreateOptNegativeKeywords ||
        isOptSearchTermBulkLoading) && <LoaderComponent />}
      {showExistingModal && (
        <OptimizationModalAddKeywordsToExsitingCampaign
          pageForAdd='search term'
          tableField='search term'
          dataToShow={dataToShow}
          onHideModal={handleHideAddToExistingModal}
          keywords={selectedSearchTerms}
          campaigns={props.selectedCampaigns}
          addNegativeToCampaignLevel={props.addNegativeToCampaignLevel}
          addNegativeToAdGroupsLevel={props.addNegativeToAdGroupsLevel}
          selectedMatchOption={selectedMatchOption}
        />
      )}
      {selectedSearchTerms && selectedSearchTerms.length > 0 && (
        <div className='search-term-options'>
          <span>Select Negative Match Type: </span>
          <Select
            options={matchTypeOptions}
            value={selectedMatchOption}
            onChange={setSelectedMatchOption}
          />
        </div>
      )}
      {selectedSearchTerms && selectedSearchTerms.length > 0 && (
        <div className='sku-action'>
          <button
            type='button'
            className='btn btn-active'
            onClick={() => {
              handleAddToExistingCampaign('Campaign')
            }}
          >
            Add Negative to Campaign Level
          </button>
          <button
            type='button'
            className='btn btn-remove'
            onClick={() => {
              handleAddToExistingCampaign('AdGroup')
            }}
          >
            Add Negative to AdGroup Level
          </button>
          <button
            className='btn btn-blue'
            onClick={() => {
              setCopySelected(true)
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      )}
      <TableComponent
        fields={fields}
        rows={searchTerms}
        totals={totals}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkSearchTermHandle}
        checkAll={checkSearchTermAll}
      />
      {selectedSearchTerms && selectedSearchTerms.length > 0 && copySelected && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>{copiedItems()}</div>
          <button style={{ height: '5vh' }} className='btn btn-blue'>
            Copied to clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default OptimizationSearchTermComponent
