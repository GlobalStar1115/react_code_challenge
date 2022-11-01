import React, { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import {
  formatValue,
  parseMoneyAsFloat
} from '../../services/helper';

const OptimizationKeywordComponent = (props) => {
  const store = useStore()

  const {
    updateBulkData,
    updateBid,
    changeToNewBid,
    changeToMaxCpc,
  } = props

  const { campaign } = store.getState()
  const {
    optKeywordsBulk,
    isOptKeywordsBulkLoading,
    isUpdateOptKeywordListStateBulk,
    isUpdateOptKeywordListBidBulk
  } = campaign

  const adjustBidRef = useRef(null)

  const [keywordData, setKeywordData] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [isShowAdjustBid, setIsShowAdjustBid] = useState(false)

  const fields = [
    { value: 'state', label: 'State' },
    { value: 'keyword', label: 'Keyword/Target', flex: '2' },
    { value: 'match1', label: 'Match' },
    { value: 'campaign_name', label: 'Campaign', flex: '2' },
    { value: 'acos', label: 'Acos%' },
    { value: 'bid', label: 'Current Bid' },
    { value: 'maxcpc', label: 'Max Cpc' },
    { value: 'clickorderratio', label: 'Clicks/Orders', flex: '2' },
    { value: 'revenue', label: 'Rev' },
    { value: 'cost', label: 'Spend' },
    { value: 'impressions', label: 'Impr' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'conversionrate', label: 'Conv.%' },
  ]
  const totals = []

  const adjustBidOptions = [
    { value: 'setBid', label: 'Set bid to ($)' },
    { value: 'raiseBid', label: 'Raise Bid By (%)' },
    { value: 'lowerBid', label: 'Lower Bid By (%)' },
  ]
  const [selectedAdjustBidOption, setSelectedAdjustBidOption] = useState(adjustBidOptions[0])
  const average_acos = 40

  useEffect(() => {
    if (!optKeywordsBulk || optKeywordsBulk.length === 0) {
      return
    }

    const newKeywords = optKeywordsBulk.map(keyword => {
      return (
        {
          ...keyword,
          clickorderratio: keyword.clickorderratio ? formatValue(keyword.clickorderratio, "number", 2) : 0,
          avcpc: keyword.avcpc ? formatValue(keyword.avcpc, "number", 2) : 0,
          conversionrate: keyword.conversionrate ? formatValue(keyword.conversionrate, "number", 2) : 0,
          acos: keyword.acos ? formatValue(keyword.acos, "number", 2) : 0,
          maxcpc: keyword.clickorderratio && parseInt(keyword.units, 10) ? formatValue(((keyword.revenue / parseInt(keyword.units, 10)) * (average_acos / 100)) / keyword.clickorderratio, 'number', 2) : 0,
          checked: selectedKeywords && selectedKeywords.length > 0 ? selectedKeywords.filter(selectedKeyword => selectedKeyword.id === keyword.id).length > 0 : false,
        }
      )
    })
    setKeywordData(newKeywords)
  }, [optKeywordsBulk, selectedKeywords])


  const checkKeywordHandle = (val, data) => {
    val ? setSelectedKeywords(prevState => [...prevState, data]) : setSelectedKeywords(selectedKeywords.filter(keyword => keyword.id !== data.id))
  }

  const checkKeywordAll = (val, data) => {
    val ? setSelectedKeywords(data) : setSelectedKeywords([])
  }

  const handleChangeKeywordsState = (type) => {
    updateBulkData('keyword', type, selectedKeywords)

    setSelectedKeywords(selectedKeywords.map((selectedKeyword) => ({
      ...selectedKeyword,
      state: type,
    })))
  }

  const handleShowAdjustBid = () => {
    setIsShowAdjustBid(true)
  }

  const handleAdjustBid = () => {

    let bidValue = parseFloat(adjustBidRef.current.value, 10)
    if (bidValue === 'n/a' || isNaN(bidValue) || parseFloat(bidValue) < 0.02)
      return

    updateBid(selectedAdjustBidOption, bidValue, selectedKeywords)

    let newBid = formatValue(bidValue, 'number', 2)

    setSelectedKeywords(selectedKeywords.map(selectedKeyword => {
      if (selectedKeyword.keywordtext !== '(_targeting_auto_)') {
        newBid = formatValue(bidValue, 'number', 2)
        if (selectedAdjustBidOption.value === 'raiseBid') {
          newBid = parseMoneyAsFloat(selectedKeyword.bid, "$") * (1 + parseFloat(bidValue) / 100)
        } else if (selectedAdjustBidOption.value === 'lowerBid') {
          newBid = parseMoneyAsFloat(selectedKeyword.bid, "$") * (1 - (parseFloat(bidValue) / 100))
        }
        return (
          {
            ...selectedKeyword,
            bid: newBid,
          }
        )
      } else {
        return selectedKeyword
      }
    }))

    setIsShowAdjustBid(false)
  }

  const handleChangeToNewBid = () => {
    changeToNewBid(selectedKeywords)

    setSelectedKeywords(selectedKeywords.map(selectedKeyword =>
      selectedKeyword.keywordtext !== '(_targeting_auto_)' && selectedKeyword.newbid !== 'n/a' && selectedKeyword.newbid >= 0.02 ?
        {
          ...selectedKeyword,
          bid: selectedKeyword.newbid,
        } : selectedKeyword
    ))
  }
  const handleChangeToMaxBid = () => {
    changeToMaxCpc(selectedKeywords)

    setSelectedKeywords(selectedKeywords.map(selectedKeyword =>
      selectedKeyword.keywordtext !== '(_targeting_auto_)' && selectedKeyword.maxcpc && selectedKeyword.maxcpc >= 0.02 ?
        {
          ...selectedKeyword,
          bid: selectedKeyword.maxcpc,
        } : selectedKeyword
    ))
  }
  const handleChangeBidOption = val => {
    setSelectedAdjustBidOption(val)
  }

  return (
    <div className={isOptKeywordsBulkLoading || isUpdateOptKeywordListStateBulk || isUpdateOptKeywordListBidBulk ? "optimization-keyword loading" : "optimization-keyword"}>
      {(isOptKeywordsBulkLoading || isUpdateOptKeywordListStateBulk || isUpdateOptKeywordListBidBulk) && <LoaderComponent />}
      {
        selectedKeywords && !isShowAdjustBid && selectedKeywords.length > 0 &&
        <div className="sku-action">
          {
            selectedKeywords.length === 1 &&
            <button
              type="button"
              className="btn btn-active"
              onClick={() => { handleChangeKeywordsState('enabled') }}
            >
              Unpause
              </button>
          }
          <button
            type="button"
            className="btn btn-pause"
            onClick={() => { handleChangeKeywordsState('paused') }}
          >
            Pause
            </button>
          <button
            type="button"
            className="btn btn-remove"
            onClick={() => { handleChangeKeywordsState('archived') }}
          >
            Archive
            </button>
          <button
            type="button"
            className="btn btn-pause"
            onClick={handleShowAdjustBid}
          >
            Adjust Bid
            </button>
          <button
            type="button"
            className="btn btn-pause"
            onClick={handleChangeToNewBid}
          >
            Change to New Bid
            </button>
          <button
            type="button"
            className="btn btn-pause"
            onClick={handleChangeToMaxBid}
          >
            Change to Max Cpc
            </button>
        </div>
      }
      {
        isShowAdjustBid &&
        <div className="adjust-bid">
          <div className="bid-select">
            <Select
              options={adjustBidOptions}
              onChange={handleChangeBidOption}
              value={selectedAdjustBidOption}
            />
          </div>
          <div className="bid-val">
            <input
              type="number"
              placeholder="Enter Bid Value"
              ref={adjustBidRef}
            />
          </div>

          <button
            type="button"
            className="btn btn-apply"
            onClick={handleAdjustBid}
          >
            Apply
            </button>
          <button
            type="button"
            className="btn btn-cancel"
            onClick={e => setIsShowAdjustBid(false)}
          >
            Cancel
            </button>
        </div>
      }
      <TableComponent
        fields={fields}
        totals={totals}
        rows={keywordData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkKeywordHandle}
        checkAll={checkKeywordAll}
      />
    </div>
  )
}

export default OptimizationKeywordComponent
