import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

const OptimizationAdvancedNegativeComponent = (props) => {
  const store = useStore()

  const { campaign } = store.getState()
  const {
    opAdvancedNegativesBulk,
    isOptAdvancedNegativesBulkLoading,
    isUpdateOptAdvancedAdNegativeKeywordListStateBulk,
    isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk,
  } = campaign

  const { updateBulkData } = props

  const [negativeData, setNegativeData] = useState([])
  const [selectedNegatives, setSelectedNegatives] = useState([])

  const negativeFields = [
    { value: 'state', label: 'State' },
    { value: 'keyword_text', label: 'Keyword', flex: '2' },
    { value: 'image_sm', label: 'Product Image', type: 'image' },
    { value: 'match_type', label: 'Match', flex: '2' },
    { value: 'campain_name', label: 'Campaign' },
    { value: 'adgroup_name', label: 'Adgroup' },
  ]
  const totals = []

  useEffect(() => {
    if (!opAdvancedNegativesBulk || opAdvancedNegativesBulk.length === 0) {
      return
    }
    setNegativeData(
      opAdvancedNegativesBulk.map((negative) => ({
        ...negative,
        checked:
          selectedNegatives && selectedNegatives.length > 0
            ? selectedNegatives.filter(
                (selectedNegative) => selectedNegative.id === negative.id
              ).length > 0
            : false,
      }))
    )
  }, [opAdvancedNegativesBulk, selectedNegatives])

  const checkNegativeHandle = (val, data) => {
    val
      ? setSelectedNegatives((prevState) => [...prevState, data])
      : setSelectedNegatives(
          selectedNegatives.filter((negative) => negative.id !== data.id)
        )
  }

  const checkNegativeAll = (val, data) => {
    val ? setSelectedNegatives(data) : setSelectedNegatives([])
  }

  const handleChangeNegativeState = (type) => {
    updateBulkData('advanced-negative', type, selectedNegatives)

    setSelectedNegatives(
      selectedNegatives.map((negative) => ({
        ...negative,
        state: type,
      }))
    )
  }

  return (
    <div
      className={
        isUpdateOptAdvancedAdNegativeKeywordListStateBulk ||
        isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk ||
        isOptAdvancedNegativesBulkLoading
          ? 'optimization-advanced-negative loading'
          : 'optimization-advanced-negative'
      }
    >
      {(isUpdateOptAdvancedAdNegativeKeywordListStateBulk ||
        isUpdateOptAdvancedCampaignNegativeKeywordListStateBulk ||
        isOptAdvancedNegativesBulkLoading) && <LoaderComponent />}
      {selectedNegatives && selectedNegatives.length > 0 && (
        <div className='sku-action'>
          <button
            type='button'
            className='btn btn-active'
            onClick={() => {
              handleChangeNegativeState('enabled')
            }}
          >
            Deselect
          </button>
          <button
            type='button'
            className='btn btn-pause'
            onClick={() => {
              handleChangeNegativeState('paused')
            }}
          >
            Remove
          </button>
          <button
            type='button'
            className='btn btn-remove'
            onClick={() => {
              handleChangeNegativeState('archived')
            }}
          >
            Archive
          </button>
        </div>
      )}
      <TableComponent
        fields={negativeFields}
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
    </div>
  )
}

export default OptimizationAdvancedNegativeComponent
