import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'

import { setDateRange } from '../../../../redux/actions/header'

import {
  getPlacementData,
  updatePlacementBid,
} from '../../../../redux/actions/campaignDetail'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'

import {
  formatValue,
  formatCurrency,
  addSpaceBetweenWord,
  tableSorter,
} from '../../../../services/helper'

const columns = [
  { key: 'placement', name: 'Placement', className: 'col-placement' },
  { key: 'campaignBiddingStrategy', name: 'Campaign Bidding Strategy', className: 'col-strategy' },
  { key: 'biddingAdjustments', name: 'Bid Adjustment', className: 'col-bid' },
  { key: 'acos', name: 'ACoS' },
  { key: 'revenue', name: 'Sales' },
  { key: 'cost', name: 'Spend' },
  { key: 'impressions', name: 'Impress' },
  { key: 'clicks', name: 'Clicks' },
  { key: 'ctr', name: 'CTR' },
  { key: 'cpc', name: 'Ave CPC' },
  { key: 'orders', name: 'Orders' },
]

const PlacementOPTab = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    header: {
      currentStartDate,
      currentEndDate,
      currencyRate,
      currencySign,
    },
    campaignDetail: {
      currentAcos,
      currentDetail,
      isPlacementDataLoading,
      placementData,
      isUpdatingPlacementBid,
    },
  } = store.getState()

  const [selectedPlacements, setSelectedPlacements] = useState([])
  const [newBidVal, setNewBidVal] = useState(0)
  const [acos, setAcos] = useState(0)

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  useEffect(() => {
    if (!currentDetail || !currentStartDate || !currentEndDate) {
      return
    }
    dispatch(getPlacementData({
      campaignId: currentDetail.campaign_id,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
    }))
  }, [currentDetail, currentStartDate, currentEndDate]) // eslint-disable-line

  const handleChangeAcos = e => {
    if (!e.target.value) {
      return
    }
    setAcos(e.target.value)
  }

  const handleSaveAcos = () => {
    dispatch(
      updateAcos({
        campaignId: currentDetail.campaign_id,
        campaignType: campaignType,
        acos,
      })
    )
  }

  const handleRangeChange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleAdjustBid = () => {
    const bidChange = parseFloat(newBidVal)
    if (newBidVal === '' || isNaN(bidChange)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter a valid bid value.',
      })
      return
    }

    const changedItem = placementData.find(p => (
      selectedPlacements.indexOf(p.placementType) !== -1
    ))

    let bidding = changedItem.bidding
    if (typeof(changedItem.bidding) === 'string') {
      try {
        bidding = JSON.parse(changedItem.bidding)
      } catch (e) {
        bidding = {}
      }
    }

    const idx = bidding.adjustments.findIndex(adjustment => adjustment.predicate === changedItem.placementType)

    if (idx !== -1) {
      bidding.adjustments[idx].percentage = bidChange || null
    } else if (bidChange) {
      bidding.adjustments.push({
        predicate: changedItem.placementType,
        percentage: bidChange,
      })
    }
    dispatch(updatePlacementBid({
      campaign: {
        campaignId: currentDetail.campaign_id,
        bidding,
      },
      placementType: changedItem.placementType,
      newBid: bidChange,
    }))
  }

  const renderAction = () => {
    return (
      <>
        {
          selectedPlacements.length === 1 && (
            <>
              <input
                type="number"
                placeholder="Enter Bid Value"
                value={newBidVal}
                onChange={(event) => { setNewBidVal(event.target.value) }}
              />
              <button
                type="button"
                className="btn btn-white"
                onClick={() => { handleAdjustBid() }}
              >
                Apply
              </button>
            </>
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

  const renderPlacement = placement => (
    <>
      <div className="table-col col-placement">
        { addSpaceBetweenWord(placement.placement, '(') }
      </div>
      <div className="table-col col-strategy">
        { placement.campaignBiddingStrategy }
      </div>
      <div className="table-col">
        { placement.biddingAdjustments }
      </div>
      <div className="table-col">
        { formatValue(placement.acos * 100, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(placement.revenue, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatCurrency(placement.cost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(placement.impressions, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(placement.clicks, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(placement.ctr * 100, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(placement.cpc, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(placement.orders, 'removeZeroDecimal') }
      </div>
    </>
  )

  if (campaignType === 'Sponsored Displays' || campaignType === 'Sponsored Brands') {
    return null
  }

  const isLoading = isPlacementDataLoading || isUpdatingPlacementBid
  const isSameAcos = currentAcos === acos

  return (
    <div className={`campaign-detail-placement-op campaign-detail-tab${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="tab-info flex justify-space-between">
        <div className="tab-title">
          Placement Optimization
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Use this section to optimize based on placement performance. <br/>Genius Bid Adjustment is coming soon!
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="acos-container">
          <span>ACOS Target (%)</span>
          <input value={acos} type="number" onChange={handleChangeAcos} />
          {
            !isSameAcos && (
              <button type="button" className="btn btn-red" onClick={handleSaveAcos}>
                Save
              </button>
            )
          }
        </div>
      </div>
      <SortableTable
        columns={columns}
        defaultSort={['cost', 'desc']}
        sorter={tableSorter(['placement', 'campaignBiddingStrategy'])}
        className="table-placements"
        records={placementData}
        idField="placementType"
        searchFields={['placement']}
        selectedRecords={selectedPlacements}
        paginationSelectPlacement="top"
        hasSticky
        renderRecord={renderPlacement}
        renderTopRight={renderAction}
        onChange={setSelectedPlacements}
      />
    </div>
  )
}

export default PlacementOPTab
