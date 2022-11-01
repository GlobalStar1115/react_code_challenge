import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'

import { setDateRange } from '../../../../redux/actions/header'

import {
  changeTarget,
} from '../../../../redux/actions/campaignDetail'

import {
  formatValue,
  formatCurrency,
  copyToClipboard,
  tableSorter,
} from '../../../../services/helper'

const columns = [
  { key: 'state', name: 'State' },
  { key: 'target_text', name: 'Automatic Targeting Defaults', className: 'col-target' },
  { key: 'bid', name: 'Current Bid' },
  { key: 'maxCpc', name: 'Genius Bid', className: 'col-genius-bid' },
  { key: 'orders', name: 'Orders' },
  { key: 'clickOrder', name: 'Clicks/Orders' },
  { key: 'acos', name: 'ACoS' },
  { key: 'revenue', name: 'Rev' },
  { key: 'cost', name: 'Spend' },
  { key: 'impressions', name: 'Impress' },
  { key: 'clicks', name: 'Clicks' },
  { key: 'ctr', name: 'CTR' },
  { key: 'cpc', name: 'Ave CPC' },
  { key: 'conversion', name: 'Conv' },
]

const adjustBidOptions = [
  { value: 'setBid', label: 'Set bid to ($)', },
  { value: 'raiseBid', label: 'Raise Bid By (%)', },
  { value: 'lowerBid', label: 'Lower Bid By (%)', },
]

const TargetTable = ({ campaignType, campaignId, adgroupId }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    header: {
      currentStartDate,
      currentEndDate,
      currencySign,
      currencyRate,
    },
    campaignDetail: {
      currentAcos,
      isBidTargetDataLoading,
      isChangingTarget,
      bidTargetData,
    },
  } = store.getState()

  const [targets, setTargets] = useState([])
  const [selectedTargets, setSelectedTargets] = useState([])
  const [isShowAdjustBid, setIsShowAdjustBid] = useState(false)
  const [selectedAdjustBidOption, setSelectedAdjustBidOption] = useState(adjustBidOptions[0])
  const [bidValue, setBidValue] = useState(0)

  useEffect(() => {
    const extendedTargets = (bidTargetData || []).filter(record => (
      record.state !== 'archived'
    )).map((record) => {
      let ctr = 0
      let cpc = 0
      let conversion = 0
      let clickOrder = 0
      let maxCpc
      if (parseInt(record.impressions, 10)) {
        ctr = parseInt(record.clicks, 10) / parseInt(record.impressions, 10) * 100
      }
      if (parseInt(record.clicks, 10)) {
        cpc = parseFloat(record.cost) / parseInt(record.clicks, 10)
        conversion = parseInt(record.orders, 10) / parseInt(record.clicks, 10) * 100
      }
      if (parseInt(record.orders, 10)) {
        clickOrder = parseInt(record.clicks, 10) / parseInt(record.orders, 10)
      }
      if (parseInt(record.clicks, 10) >= 3) {
        if (parseInt(record.units, 10) && clickOrder) {
          maxCpc = (parseFloat(record.revenue) / parseInt(record.units, 10))
            * (currentAcos / 100)
            / clickOrder
        } else if (typeof record.units === 'undefined' && parseInt(record.clicks, 10)) {
          // For SB/SBV campaigns, the number of units is not available.
          maxCpc = parseFloat(record.revenue) * (currentAcos / 100)  / parseInt(record.clicks, 10)
        }
      }

      return {
        ...record,
        ctr,
        cpc,
        conversion,
        clickOrder,
        maxCpc,
      }
    })

    setTargets(extendedTargets)
  }, [currentAcos, bidTargetData])

  const callChangeTarget = (targets) => {
    const payload = {}
    if (campaignType === 'Sponsored Brands'
      || campaignType === 'Sponsored Brands Video') {
        payload.campaignId = Number(campaignId)
        payload.adGroupId = Number(adgroupId)
    }

    dispatch(changeTarget(targets.map(target => ({
      ...target,
      ...payload,
    })), campaignType))
  }

  const handleCopy = () => {
    const targetTexts = targets.filter(target => (
      selectedTargets.indexOf(target.id) !== -1
    )).map(keyword => keyword.target_text.trim())

    copyToClipboard([...new Set(targetTexts)].join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedTargets.length} target${selectedTargets.length > 1 ? 's' : ''}.`
    })
  }

  const handleRangeChange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleChangeState = (state) => {
    const targetsToChange = targets.filter(target => selectedTargets.indexOf(target.id) !== -1)
    callChangeTarget(targetsToChange.map(target => ({
      targetId: parseInt(target.targetId, 10),
      state,
    })))
  }

  const handleAdjustBid = () => {
    if (bidValue === '' || isNaN(bidValue)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the valid bid value.',
      })
      return
    }

    let targetsToChange = []
    targets.filter(target => (
      selectedTargets.indexOf(target.id) !== -1
    )).forEach((target) => {
      let newBid = parseFloat(bidValue)
      if (selectedAdjustBidOption.value === 'raiseBid') {
        newBid = parseFloat(target.bid || 0) * (1 + (newBid / 100))
      } else if (selectedAdjustBidOption.value === 'lowerBid') {
        newBid = parseFloat(target.bid || 0) * (1 - (newBid / 100))
      }

      if (newBid >= 0.02) {
        targetsToChange.push({
          targetId: parseInt(target.targetId, 10),
          bid: parseFloat(newBid.toFixed(2)),
        })
      }
    })

    if (!targetsToChange.length){
      toast.show({
        title: 'Warning',
        description: 'The minimum bid allowed is $0.02. Please check your targets',
      })
      return
    }

    callChangeTarget(targetsToChange)
  }

  const handleChangeToMaxBid = () => {
    const targetsToChange = []
    targets.filter(target => selectedTargets.indexOf(target.id) !== -1)
    .forEach((target) => {
      if (target.maxCpc
        && parseFloat(target.maxCpc) >= 0.02) {
        targetsToChange.push({
          targetId: parseInt(target.targetId, 10),
          bid: parseFloat(parseFloat(target.maxCpc).toFixed(2)),
        })
      }
    })

    if (!targetsToChange.length) {
      toast.show({
        title: 'Warning',
        description: 'The minimum bid allowed is $0.02. Please check your targets.',
      })
      return
    }

    callChangeTarget(targetsToChange, campaignType)
  }

  const renderAction = () => {
    return (
      <>
        {
          selectedTargets.length > 0 && !isShowAdjustBid && (
            <>
              <button type="button" className="btn btn-white" onClick={() => { handleChangeState('enabled') }}>
                Enable
              </button>
              <button type="button" className="btn btn-white" onClick={() => { handleChangeState('paused') }}>
                Pause
              </button>
              <button type="button" className="btn btn-white" onClick={() => { setIsShowAdjustBid(true) }}>
                Adjust Bid
              </button>
              <button type="button" className="btn btn-white" onClick={handleChangeToMaxBid}>
                Change to Genius Bid
              </button>
              <button type="button" className="btn btn-white" onClick={() => { handleCopy() }}>
                Copy to Clipboard
              </button>
            </>
          )
        }
        {
          selectedTargets.length > 0 && isShowAdjustBid && (
            <div className="adjust-bid-section">
              <Select
                className="adjust-option-selector"
                value={selectedAdjustBidOption}
                options={adjustBidOptions}
                onChange={setSelectedAdjustBidOption}
              />
              <input
                type="number"
                placeholder="Enter Bid Value"
                value={bidValue}
                onChange={(event) => { setBidValue(event.target.value) }}
              />
              <button
                type="button"
                className="btn btn-blue"
                onClick={handleAdjustBid}
              >
                Apply
              </button>
              <button
                type="button"
                className="btn btn-white"
                onClick={() => { setIsShowAdjustBid(false) }}
              >
                Cancel
              </button>
            </div>
          )
        }
        <DateRangeComponent
          placement="bottomEnd"
          value={[currentStartDate, currentEndDate]}
          onChange={handleRangeChange}
        />
      </>
    )
  }

  const renderTarget = record => (
    <>
      <div className="table-col col-state">
        { record.state }
      </div>
      <div className="table-col col-target" title={record.target_text}>
        { record.target_text }
      </div>
      <div className="table-col">
        { formatCurrency(record.bid, currencySign, currencyRate) }
      </div>
      <div className="table-col col-genius-bid">
        {
          typeof record.maxCpc !== 'undefined'
          ? formatCurrency(record.maxCpc, currencySign, currencyRate)
          : 'N/A'
        }
      </div>
      <div className="table-col">
        { formatValue(record.orders, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(record.clickOrder, 'number', 1) }
      </div>
      <div className="table-col">
        { formatValue(record.acos, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(record.revenue, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatCurrency(record.cost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(record.impressions, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(record.clicks, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(record.ctr, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(record.cpc, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(record.conversion, 'percent') }
      </div>
    </>
  )

  const isLoading = isBidTargetDataLoading || isChangingTarget
  return (
    <>
      <div className={`table-content${isLoading ? ' loading' : ''}`}>
        { isLoading && <LoaderComponent /> }
        <SortableTable
          columns={columns}
          defaultSort={['cost', 'desc']}
          sorter={tableSorter(['state', 'target_text'])}
          className="table-targets"
          records={targets}
          idField="id"
          searchFields={['target_text']}
          selectedRecords={selectedTargets}
          paginationSelectPlacement="top"
          hasSticky
          renderRecord={renderTarget}
          renderTopRight={renderAction}
          onChange={setSelectedTargets}
        />
      </div>
    </>
  )
}

export default TargetTable
