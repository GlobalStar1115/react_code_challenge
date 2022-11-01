import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'

import { setDateRange } from '../../../../redux/actions/header'

import {
  changeKeywordBid,
  changeKeywordState,
} from '../../../../redux/actions/campaignDetail'

import {
  formatValue,
  formatCurrency,
  capitalizeFirstLetter,
  copyToClipboard,
  tableSorter,
} from '../../../../services/helper'

const columns = [
  { key: 'state', name: 'State' },
  { key: 'keyword', name: 'Keyword/Target', className: 'col-keyword' },
  { key: 'matchType', name: 'Match Type' },
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

const KeywordTable = ({ campaignType }) => {
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
      currentDetail,
      currentAcos,
      isBidDataLoading,
      isChangingKeywordBid,
      isChangingKeywordState,
      bidData,
    },
  } = store.getState()

  const [keywords, setKeywords] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [isShowAdjustBid, setIsShowAdjustBid] = useState(false)
  const [selectedAdjustBidOption, setSelectedAdjustBidOption] = useState(adjustBidOptions[0])
  const [bidValue, setBidValue] = useState(0)

  useEffect(() => {
    const extendedKeywords = (bidData || []).map((record) => {
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
        matchType: capitalizeFirstLetter(record.match_type),
        ctr,
        cpc,
        conversion,
        clickOrder,
        maxCpc,
      }
    })

    setKeywords(extendedKeywords)
  }, [currentAcos, bidData])

  const handleCopy = () => {
    const keywordTexts = keywords.filter(keyword => (
      selectedKeywords.indexOf(keyword.id) !== -1
    )).map(keyword => keyword.keyword.trim())

    copyToClipboard([...new Set(keywordTexts)].join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedKeywords.length} keyword${selectedKeywords.length > 1 ? 's' : ''}.`
    })
  }

  const handleRangeChange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleChangeState = (state) => {
    if (currentDetail && currentDetail.targeting_type === 'auto') {
      toast.show({
        title: 'Warning',
        description: 'Auto campaign cannot change keyword bid.',
      })
      return
    }

    const keywordsToChange = keywords.filter(keyword => (
      selectedKeywords.indexOf(keyword.id) !== -1
      && keyword.state !== 'archived'
      && keyword.keyword !== '(_targeting_auto_)'
    )).map(keyword => ({
      campaignId: keyword.campaign_id,
      adGroupId: keyword.adgroup_id,
      keywordId: keyword.keyword_id,
      targetId: keyword.targetId ? keyword.targetId : null,
      state,
    }))

    if (!keywordsToChange.length) {
      toast.show({
        title: 'Warning',
        description: 'Archived keywords cannot be changed.',
      })
      return
    }

    dispatch(changeKeywordState({
      campaignType,
      keywordsArr: keywordsToChange,
      state,
    }))
  }

  const handleAdjustBid = () => {
    if (bidValue === '' || isNaN(bidValue)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the valid bid value.',
      })
      return
    }

    let keywordsChanged = []
    keywords.filter(keyword => (
      selectedKeywords.indexOf(keyword.id) !== -1
      && keyword.keyword !== '(_targeting_auto_)'
    )).forEach((keyword) => {
      let newBid = parseFloat(bidValue)
      if (selectedAdjustBidOption.value === 'raiseBid') {
        newBid = parseFloat(keyword.bid || 0) * (1 + (newBid / 100))
      } else if (selectedAdjustBidOption.value === 'lowerBid') {
        newBid = parseFloat(keyword.bid || 0) * (1 - (newBid / 100))
      }

      if (newBid >= 0.02) {
        keywordsChanged.push({
          campaignId: keyword.campaign_id,
          adGroupId: keyword.adgroup_id,
          keywordId: keyword.keyword_id,
          keyword: keyword.keyword,
          oldBid: parseFloat(keyword.bid || 0),
          bid: parseFloat(newBid.toFixed(2)),
        })
      }
    })

    // Remove duplicate entries.
    keywordsChanged =  [...new Map(keywordsChanged.map(item => [item.keywordId, item])).values()]

    if (!keywordsChanged.length) {
      toast.show({
        title: 'Warning',
        description: 'The minimum bid allowed is $0.02. Please check your keywords',
      })
      return
    }

    dispatch(changeKeywordBid({
      changeToNewBid: false,
      campaignType,
      keywords: keywordsChanged,
      adjustType: selectedAdjustBidOption.value,
      newAdjustBid: bidValue,
    }))
  }

  const handleChangeToMaxBid = () => {
    if (currentDetail && currentDetail.targeting_type === 'auto') {
      toast.show({
        title: 'Warning',
        description: 'Auto campaign cannot change keyword bid.',
      })
      return
    }

    let keywordsToChange = []
    keywords.filter(keyword => selectedKeywords.indexOf(keyword.id) !== -1)
    .forEach((keyword) => {
      if (keyword.maxCpc
        && parseFloat(keyword.maxCpc) >= 0.02
        && keyword.keyword !== '(_targeting_auto_)') {
        keywordsToChange.push({
          keywordId: keyword.keyword_id,
          campaignId: keyword.campaign_id,
          adGroupId: keyword.adgroup_id,
          bid: parseFloat(parseFloat(keyword.maxCpc).toFixed(2)),
          changeToNewBid: true,
          campaignType,
        })
      }
    })
    if (!keywordsToChange.length) {
      toast.show({
        title: 'Warning',
        description: 'The minimum bid allowed is $0.02. Please check your keywords.',
      })
      return
    }

    // Remove duplicate records.
    keywordsToChange = [...new Map(keywordsToChange.map(item => [item.keywordId, item])).values()]

    dispatch(changeKeywordBid({
      changeToNewBid: true,
      campaignType,
      keywords: keywordsToChange,
    }))
  }

  const renderAction = () => {
    return (
      <>
        {
          selectedKeywords.length > 0 && !isShowAdjustBid && (
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
          selectedKeywords.length > 0 && isShowAdjustBid && (
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

  const renderKeyword = record => (
    <>
      <div className="table-col col-state">
        { record.state }
      </div>
      <div className="table-col col-keyword" title={record.keyword}>
        { record.keyword }
      </div>
      <div className="table-col">
        { record.matchType }
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

  const isLoading = isChangingKeywordBid
    || isChangingKeywordState
    || isBidDataLoading
  return (
    <>
      <div className={`table-content${isLoading ? ' loading' : ''}`}>
        { isLoading && <LoaderComponent />}
        <SortableTable
          columns={columns}
          defaultSort={['cost', 'desc']}
          sorter={tableSorter(['state', 'keyword', 'matchType'])}
          className="table-keywords"
          records={keywords}
          idField="id"
          searchFields={['keyword']}
          selectedRecords={selectedKeywords}
          paginationSelectPlacement="top"
          hasSticky
          renderRecord={renderKeyword}
          renderTopRight={renderAction}
          onChange={setSelectedKeywords}
        />
      </div>
    </>
  )
}

export default KeywordTable
