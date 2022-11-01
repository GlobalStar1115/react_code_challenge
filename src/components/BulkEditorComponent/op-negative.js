import React, { useEffect, useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import OptimizationModalAddKeywordsToExsitingCampaign from './op-add-keyword-exsiting-campaign'

import { formatValue } from '../../services/helper';

import {
  showExistingModalAction,
  hideExistingModalAction,
} from '../../redux/actions/pageGlobal'

const OptimizationNegativeComponent = (props) => {
  const store = useStore()
  const dispatch = useDispatch()

  const { campaign, pageGlobal } = store.getState()
  const {
    optNegativeBulk,
    isOptNegativeBulkLoading,
  } = campaign

  const { selectedCampaigns } = props

  const { showExistingModal } = pageGlobal

  const [negativeData, setNegativeData] = useState([])
  const [selectedNegatives, setSelectedNegatives] = useState([])
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
    { value: 'Campaign', label: 'Campaign', flex: '2' },
    { value: 'Search', label: 'Search Word', flex: '2' },
    { value: 'image_sm', label: 'Product Image', type: 'image' },
    { value: 'Adgroup', label: 'AdGroup', flex: '2' },
    { value: 'Clicks', label: 'Unprofitable Clicks', flex: '2' },
    { value: 'Ctr', label: 'Ctr %' },
    { value: 'Impressions', label: 'Impressions' },
    { value: 'Revenue', label: 'Revenue' },
    { value: 'ADSpend', label: 'Wasted Ad Spend' },
    { value: 'yearlyAdSpend', label: 'Approximate Yearly Saving', flex: '2' },
  ]
  const totals = []

  const matchTypeOptions = [
    { label: 'Add as Negative Exact', value: 'Negative Exact' },
    { label: 'Add as Negative Phrase', value: 'Negative Phrase' },
  ]
  const [selectedMatchOption, setSelectedMatchOption] = useState(matchTypeOptions[0])

  useEffect(() => {
    if (!optNegativeBulk || optNegativeBulk.length === 0) {
      return
    }
    const newNegatives = optNegativeBulk.map(negative => {
      return (
        {
          ...negative,
          Ctr: negative.Impressions ? formatValue(negative.Clicks / negative.Impressions * 100, "number", 2) : 0,
          Revenue: negative.Revenue ? formatValue(negative.Revenue, "currency", 2) : '$0',
          ADSpend: negative.ADSpend ? formatValue(negative.ADSpend, "currency", 2) : '$0',
          yearlyAdSpend: negative.yearlyAdSpend ? formatValue(negative.yearlyAdSpend, "currency", 2) : '$0',
          checked: selectedNegatives && selectedNegatives.length > 0 ? selectedNegatives.filter(selectedNegative => selectedNegative.id === negative.id).length > 0 : false,
        }
      )
    })
    setNegativeData(newNegatives)
  }, [optNegativeBulk, selectedNegatives])


  const checkNegativeHandle = (val, data) => {
    val ? setSelectedNegatives(prevState => [...prevState, data]) : setSelectedNegatives(selectedNegatives.filter(negative => negative.id !== data.id))
  }
  const checkNegativeAll = (val, data) => {
    val ? setSelectedNegatives(data) : setSelectedNegatives([])
  }

   //handle Copy for search term
   const copiedItems = () => {
    return selectedNegatives.map((selectedNegative) => {
      return (
        <div
          style={{ width: 'auto', border: '2px solid grey' }}
          key={selectedNegative.id}
        >
          {selectedNegative.Campaign}
        </div>
      )
    })
  }

  return (
    <div className={isOptNegativeBulkLoading ? "optimization-negative loading" : "optimization-negative"}>
      {isOptNegativeBulkLoading && <LoaderComponent />}
      {showExistingModal && (
        <OptimizationModalAddKeywordsToExsitingCampaign
          pageForAdd='search term'
          tableField='negative'
          dataToShow={dataToShow}
          onHideModal={handleHideAddToExistingModal}
          keywords={selectedNegatives}
          campaigns={selectedCampaigns}
          addNegativeToCampaignLevel={props.addNegativeToCampaignLevel}
          addNegativeToAdGroupsLevel={props.addNegativeToAdGroupsLevel}
          selectedMatchOption={selectedMatchOption}
        />
      )}
      {
        selectedNegatives && selectedNegatives.length > 0 &&
        <div
          className="search-term-options"
        >
          <span>Select Negative Match Type: </span>
          <Select
            options={matchTypeOptions}
            value={selectedMatchOption}
            onChange={setSelectedMatchOption}
          />
        </div>
      }
      {
        selectedNegatives && selectedNegatives.length > 0 &&
        <div className="sku-action">
          <button
            type="button"
            className="btn btn-active"
            onClick={() => { handleAddToExistingCampaign('NegativeCampaign') }}
          >
            Add Negative to Campaign Level
          </button>
          <button
            type="button"
            className="btn btn-remove"
            onClick={() => { handleAddToExistingCampaign('NegativeAdGroup') }}
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
      }
      <TableComponent
        fields={fields}
        totals={totals}
        rows={negativeData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkNegativeHandle}
        checkAll={checkNegativeAll}
      />
      {selectedNegatives && selectedNegatives.length > 0 && copySelected && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div>{copiedItems()}</div>
          <button style={{ height: '3vh' }} className='btn btn-blue'>
            Copied to clipboard
          </button>
        </div>
      )}
    </div>
  )
}

export default OptimizationNegativeComponent
