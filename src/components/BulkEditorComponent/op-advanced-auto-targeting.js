import React, { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatValue, parseMoneyAsFloat } from '../../services/helper'

const OptimizationAdvancedAutoTargetingComponent = (props) => {
  const store = useStore()

  const { updateBulkData, updateAutoTargetBid } = props

  const { targeting } = store.getState()

  const {
    optAdvancedAutoTargetingBulk,
    isOptAdvancedAutoTargetingBulkLoading,
    isUpdateOptAdvancedTargetAutoListBulk,
  } = targeting

  const adjustBidRef = useRef(null)

  const [autoTargetingData, setAutoTargetingData] = useState([])
  const [selectedAutoTargets, setSelectedAutoTargets] = useState([])
  const [isShowAdjustBid, setIsShowAdjustBid] = useState(false)

  const auto_targeting_fields = [
    { value: 'state', label: 'State' },
    { value: 'targetText', label: 'Automatic Targeting Defaults', flex: '2' },
    { value: 'campaignName', label: 'Campaign', flex: '3' },
    { value: 'adgroupName', label: 'Adgroup', flex: '2' },
    { value: 'bid', label: 'Targeting Bid' },
    { value: 'revenue', label: 'Rev' },
    { value: 'cost', label: 'Spend' },
    { value: 'impressions', label: 'Impress' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'clickorderratio', label: 'Clicks/Orders', flex: '2' },
    { value: 'acos', label: 'Acos %' },
  ]

  const totals = []

  const adjust_bid_options = [
    { value: 'setBid', label: 'Set bid to ($)' },
    { value: 'raiseBid', label: 'Raise Bid By (%)' },
    { value: 'lowerBid', label: 'Lower Bid By (%)' },
  ]
  const [selectedAdjustBidOption, setSelectedAdjustBidOption] = useState(
    adjust_bid_options[0]
  )

  useEffect(() => {
    if (
      !optAdvancedAutoTargetingBulk ||
      optAdvancedAutoTargetingBulk.length === 0
    ) {
      return
    }
    setAutoTargetingData(
      optAdvancedAutoTargetingBulk.map((autoTargeting) => ({
        ...autoTargeting,
        avcpc: autoTargeting.avcpc
          ? formatValue(autoTargeting.avcpc, 'number', 2)
          : 0,
        checked:
          selectedAutoTargets && selectedAutoTargets.length > 0
            ? selectedAutoTargets.filter(
                (selectedAutoTarget) =>
                  selectedAutoTarget.id === autoTargeting.id
              ).length > 0
            : false,
      }))
    )
  }, [optAdvancedAutoTargetingBulk, selectedAutoTargets])

  const checkAdvAutoTarget = (val, data) => {
    val
      ? setSelectedAutoTargets((prevState) => [...prevState, data])
      : setSelectedAutoTargets(
          selectedAutoTargets.filter((autoTarget) => autoTarget.id !== data.id)
        )
  }

  const checkAdvAutoTargetAll = (val, data) => {
    val ? setSelectedAutoTargets(data) : setSelectedAutoTargets([])
  }

  const handleChangeAutoTargetsState = (type) => {
    updateBulkData('advanced-autotarget', type, selectedAutoTargets)

    setSelectedAutoTargets(
      selectedAutoTargets.map((selectedAutoTarget) => ({
        ...selectedAutoTarget,
        state: type,
      }))
    )
  }

  const handleShowAdjustBid = () => {
    setIsShowAdjustBid(true)
  }

  const handleAdjustBid = () => {
    const bidValue = parseFloat(adjustBidRef.current.value, 10)
    if (bidValue === 'n/a' || isNaN(bidValue) || parseFloat(bidValue) < 0.02) {
      return
    }

    updateAutoTargetBid(selectedAdjustBidOption, bidValue, selectedAutoTargets)

    let newBid = formatValue(bidValue, 'number', 2)

    setSelectedAutoTargets(
      selectedAutoTargets.map((selectedAutoTarget) => {
        newBid = formatValue(bidValue, 'number', 2)
        if (selectedAdjustBidOption.value === 'raiseBid') {
          newBid =
            parseMoneyAsFloat(selectedAutoTarget.bid, '$') *
            (1 + parseFloat(bidValue) / 100)
        } else if (selectedAdjustBidOption.value === 'lowerBid') {
          newBid =
            parseMoneyAsFloat(selectedAutoTarget.bid, '$') *
            (1 - parseFloat(bidValue) / 100)
        }
        return {
          ...selectedAutoTarget,
          bid: formatValue(newBid, 'number', 2),
        }
      })
    )

    setIsShowAdjustBid(false)
  }
  const handleChangeBidOption = (val) => {
    setSelectedAdjustBidOption(val)
  }

  return (
    <div
      className={
        isUpdateOptAdvancedTargetAutoListBulk ||
        isOptAdvancedAutoTargetingBulkLoading
          ? 'optimization-advanced-auto-targeting loading'
          : 'optimization-advanced-auto-targeting'
      }
    >
      {(isUpdateOptAdvancedTargetAutoListBulk ||
        isOptAdvancedAutoTargetingBulkLoading) && <LoaderComponent />}
      {selectedAutoTargets &&
        !isShowAdjustBid &&
        selectedAutoTargets.length > 0 && (
          <div className='sku-action'>
            {selectedAutoTargets.length === 1 && (
              <button
                type='button'
                className='btn btn-active'
                onClick={() => {
                  handleChangeAutoTargetsState('enabled')
                }}
              >
                Unpause
              </button>
            )}
            <button
              type='button'
              className='btn btn-pause'
              onClick={() => {
                handleChangeAutoTargetsState('paused')
              }}
            >
              Pause
            </button>
            <button
              type='button'
              className='btn btn-remove'
              onClick={() => {
                handleChangeAutoTargetsState('archived')
              }}
            >
              Archive
            </button>
            <button
              type='button'
              className='btn btn-adjust'
              onClick={handleShowAdjustBid}
            >
              Adjust Bid
            </button>
          </div>
        )}
      {isShowAdjustBid && (
        <div className='adjust-bid'>
          <div className='bid-select'>
            <Select
              options={adjust_bid_options}
              onChange={handleChangeBidOption}
              value={selectedAdjustBidOption}
            />
          </div>
          <div className='bid-val'>
            <input
              type='number'
              placeholder='Enter Bid Value'
              ref={adjustBidRef}
            />
          </div>

          <button
            type='button'
            className='btn btn-apply'
            onClick={handleAdjustBid}
          >
            Apply
          </button>
          <button
            type='button'
            className='btn btn-cancel'
            onClick={() => {
              setIsShowAdjustBid(false)
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <TableComponent
        fields={auto_targeting_fields}
        totals={totals}
        rows={autoTargetingData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkAdvAutoTarget}
        checkAll={checkAdvAutoTargetAll}
      />
    </div>
  )
}

export default OptimizationAdvancedAutoTargetingComponent
