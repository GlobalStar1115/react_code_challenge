import React, { useEffect, useRef, useState } from 'react'
import { useStore } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatValue, parseMoneyAsFloat } from '../../services/helper'

const OptimizationAdvancedHighKeywordComponent = (props) => {
  const store = useStore()

  const { updateBulkData, updateBid, changeToNewBid } = props

  const { campaign } = store.getState()
  const {
    opAdvancedHighKeywordsBulk,
    isUpdateOptAdvancedHighKeywordListStateBulk,
  } = campaign

  const adjustBidRef = useRef(null)

  const [keywordData, setKeywordData] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [isShowAdjustBid, setIsShowAdjustBid] = useState(false)

  const keywordFields = [
    { value: 'state', label: 'State' },
    { value: 'keywordtext', label: 'Keyword/Target', flex: '2' },
    { value: 'image_sm', label: 'Product Image', type: 'image' },
    { value: 'matchtype', label: 'Match', flex: '2' },
    { value: 'bid', label: 'Current Bid', flex: '2' },
    { value: 'newbid', label: 'New Bid' },
    { value: 'campain_name', label: 'Campaign' },
    { value: 'adgroup_name', label: 'Adgroup' },
    { value: 'revenue', label: 'Rev' },
    { value: 'cost', label: 'Spend' },
    { value: 'impressions', label: 'Impr' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'clickorderratio', label: 'Clicks/Orders' },
    { value: 'maxcpc', label: 'Max Cpc' },
    { value: 'conversionrate', label: 'Conv.%' },
    { value: 'acos', label: 'Acos %' },
  ]
  const totals = []

  const adjustBidOptions = [
    { value: 'setBid', label: 'Set bid to ($)' },
    { value: 'raiseBid', label: 'Raise Bid By (%)' },
    { value: 'lowerBid', label: 'Lower Bid By (%)' },
  ]

  const [selectedAdjustBidOption, setSelectedAdjustBidOption] = useState(
    adjustBidOptions[0]
  )

  useEffect(() => {
    if (
      !opAdvancedHighKeywordsBulk ||
      opAdvancedHighKeywordsBulk.length === 0
    ) {
      return
    }
    const newKeywords = opAdvancedHighKeywordsBulk.map((keyword) => {
      const units = parseInt(keyword.units, 10)
      const maxcpc =
        keyword.clickorderratio && units
          ? ((keyword.revenue / units) * (keyword.average_acos / 100)) /
            keyword.clickorderratio
          : 0
      return {
        ...keyword,
        bid: keyword.bid ? formatValue(keyword.bid, 'currency', 2) : '0',
        revenue: keyword.revenue
          ? formatValue(keyword.revenue, 'currency', 2)
          : '$0',
        cost: keyword.cost ? formatValue(keyword.cost, 'currency', 2) : '$0',
        avcpc: keyword.avcpc ? formatValue(keyword.avcpc, 'number', 2) : 0,
        clickorderratio: keyword.clickorderratio
          ? formatValue(keyword.clickorderratio, 'number', 2)
          : 0,
        conversionrate: keyword.conversionrate
          ? formatValue(keyword.conversionrate, 'number', 2)
          : 0,
        acos: keyword.acos ? formatValue(keyword.acos, 'number', 2) : 0,
        maxcpc: formatValue(maxcpc, 'number', 2),
        checked:
          selectedKeywords && selectedKeywords.length > 0
            ? selectedKeywords.filter(
                (selectedKeyword) => selectedKeyword.id === keyword.id
              ).length > 0
            : false,
      }
    })
    setKeywordData(newKeywords)
  }, [opAdvancedHighKeywordsBulk, selectedKeywords])

  const checkAdvKeyword = (val, data) => {
    val
      ? setSelectedKeywords((prevState) => [...prevState, data])
      : setSelectedKeywords(
          selectedKeywords.filter((keyword) => keyword.id !== data.id)
        )
  }

  const checkAdvKeywordAll = (val, data) => {
    val ? setSelectedKeywords(data) : setSelectedKeywords([])
  }

  const handleChangeKeywordsState = (type) => {
    updateBulkData('advanced-high-keyword', type, selectedKeywords)

    setSelectedKeywords(
      selectedKeywords.map((selectedKeyword) => ({
        ...selectedKeyword,
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

    updateBid('FindHigh', selectedAdjustBidOption, bidValue, selectedKeywords)

    let newBid = formatValue(bidValue, 'number', 2)

    setSelectedKeywords(
      selectedKeywords.map((selectedKeyword) => {
        if (selectedKeyword.keywordtext !== '(_targeting_auto_)') {
          newBid = formatValue(bidValue, 'number', 2)
          if (selectedAdjustBidOption.value === 'raiseBid') {
            newBid =
              parseMoneyAsFloat(selectedKeyword.bid, '$') *
              (1 + parseFloat(bidValue) / 100)
          } else if (selectedAdjustBidOption.value === 'lowerBid') {
            newBid =
              parseMoneyAsFloat(selectedKeyword.bid, '$') *
              (1 - parseFloat(bidValue) / 100)
          }

          return {
            ...selectedKeyword,
            bid: newBid,
          }
        } else {
          return selectedKeyword
        }
      })
    )
    setIsShowAdjustBid(false)
  }
  const handleChangeToNewBid = () => {
    changeToNewBid('FindHigh', selectedKeywords)

    setSelectedKeywords(
      selectedKeywords.map((selectedKeyword) =>
        selectedKeyword.keywordtext !== '(_targeting_auto_)' &&
        selectedKeyword.newbid !== 'n/a' &&
        selectedKeyword.newbid >= 0.02
          ? {
              ...selectedKeyword,
              bid: selectedKeyword.newbid,
            }
          : selectedKeyword
      )
    )
  }
  const handleChangeBidOption = (val) => {
    setSelectedAdjustBidOption(val)
  }
  return (
    <div
      className={
        isUpdateOptAdvancedHighKeywordListStateBulk
          ? 'optimization-advanced-keyword loading'
          : 'optimization-advanced-keyword'
      }
    >
      {isUpdateOptAdvancedHighKeywordListStateBulk && <LoaderComponent />}
      {selectedKeywords && !isShowAdjustBid && selectedKeywords.length > 0 && (
        <div className='sku-action'>
          <button
            type='button'
            className='btn btn-active'
            onClick={() => {
              handleChangeKeywordsState('enabled')
            }}
          >
            Unpause
          </button>
          <button
            type='button'
            className='btn btn-pause'
            onClick={() => {
              handleChangeKeywordsState('paused')
            }}
          >
            Pause
          </button>
          <button
            type='button'
            className='btn btn-remove'
            onClick={() => {
              handleChangeKeywordsState('archived')
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
          <button
            type='button'
            className='btn btn-new'
            onClick={handleChangeToNewBid}
          >
            Change to New Bid
          </button>
        </div>
      )}
      {isShowAdjustBid && (
        <div className='adjust-bid'>
          <div className='bid-select'>
            <Select
              options={adjustBidOptions}
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
        fields={keywordFields}
        totals={totals}
        rows={keywordData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkAdvKeyword}
        checkAll={checkAdvKeywordAll}
      />
    </div>
  )
}

export default OptimizationAdvancedHighKeywordComponent
