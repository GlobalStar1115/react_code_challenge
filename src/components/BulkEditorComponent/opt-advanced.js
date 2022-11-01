import React, { useState } from 'react'

// Components
import Select from 'react-select'
import OptimizationAdvancedMostKeywordComponent from './op-advanced-most-keyword'
import OptimizationAdvancedZeroKeywordComponent from './op-advanced-zero-keyword'
import OptimizationAdvancedLowKeywordComponent from './op-advanced-low-keyword'
import OptimizationAdvancedFindKeywordComponent from './op-advanced-find-keyword'
import OptimizationAdvancedHighKeywordComponent from './op-advanced-high-keyword'
import OptimizationAdvancedNegativeComponent from './op-advanced-negative'
import OptimizationAdvancedWorstAdgComponent from './op-advanced-worst-adg'
import OptimizationAdvancedAutoTargetingComponent from './op-advanced-auto-targeting'

const OptimizationAdvancedComponent = (props) => {
  const {
    setSelectOption,
    updateBulkData,
    updateBid,
    changeToNewBid,
    updateAutoTargetBid,
    campaignType,
  } = props

  const advancedBulkSelectOptionsFilter = [
    {
      label: 'Find Most Expensive Keywords/Targets',
      value: 'FindMost',
    },
    {
      label: 'Find Zero Impression Keywords/Targets',
      value: 'FindZero',
    },
    {
      label: 'Find Low Converting Keywords/Targets',
      value: 'FindLow',
    },
    {
      label: 'Find Keywords/Targets Without Sales',
      value: 'FindKeywords',
    },
    {
      label: 'Find High ACoS Keywords/Targets',
      value: 'FindHigh',
    },
    {
      label: 'Review All Negatives',
      value: 'FindAllNegative',
    },
    {
      label: 'Find Worst Performing Auto Targeting Types',
      value: 'FindWorstPerformingAutoTargeting',
    },
    {
      label: 'Find Worst Performing Ad Group by ACoS',
      value: 'FindWorstPerformingAdGroup',
    },
  ]
  const advancedBulkSelectOptions = advancedBulkSelectOptionsFilter.filter(
    (item) =>
      campaignType === 'Sponsored Displays'
        ? item.value !== 'FindWorstPerformingAutoTargeting'
        : item
  )
  const [selectedAdvancedOption, setSelectedAdvancedOption] = useState()

  const handleChangeAdvancedOption = (val) => {
    setSelectedAdvancedOption(val)
    setSelectOption(val)
  }
  return (
    <div className='optimization-advanced'>
      <Select
        options={advancedBulkSelectOptions}
        onChange={handleChangeAdvancedOption}
        value={selectedAdvancedOption}
      />

      {selectedAdvancedOption ? (
        selectedAdvancedOption.value === 'FindAllNegative' ? (
          <OptimizationAdvancedNegativeComponent
            updateBulkData={updateBulkData}
          />
        ) : selectedAdvancedOption.value ===
          'FindWorstPerformingAutoTargeting' ? (
          <OptimizationAdvancedAutoTargetingComponent
            updateBulkData={updateBulkData}
            updateAutoTargetBid={updateAutoTargetBid}
          />
        ) : selectedAdvancedOption.value === 'FindWorstPerformingAdGroup' ? (
          <OptimizationAdvancedWorstAdgComponent
            updateBulkData={updateBulkData}
          />
        ) : selectedAdvancedOption.value === 'FindMost' ? (
          <OptimizationAdvancedMostKeywordComponent
            updateBulkData={updateBulkData}
            updateBid={updateBid}
            changeToNewBid={changeToNewBid}
          />
        ) : selectedAdvancedOption.value === 'FindZero' ? (
          <OptimizationAdvancedZeroKeywordComponent
            updateBulkData={updateBulkData}
            updateBid={updateBid}
            changeToNewBid={changeToNewBid}
          />
        ) : selectedAdvancedOption.value === 'FindLow' ? (
          <OptimizationAdvancedLowKeywordComponent
            updateBulkData={updateBulkData}
            updateBid={updateBid}
            changeToNewBid={changeToNewBid}
          />
        ) : selectedAdvancedOption.value === 'FindKeywords' ? (
          <OptimizationAdvancedFindKeywordComponent
            updateBulkData={updateBulkData}
            updateBid={updateBid}
            changeToNewBid={changeToNewBid}
          />
        ) : selectedAdvancedOption.value === 'FindHigh' ? (
          <OptimizationAdvancedHighKeywordComponent
            updateBulkData={updateBulkData}
            updateBid={updateBid}
            changeToNewBid={changeToNewBid}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  )
}

export default OptimizationAdvancedComponent
