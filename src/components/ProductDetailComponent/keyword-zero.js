import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Select from 'react-select'
import { Toggle, Radio, Tooltip, Whisper } from 'rsuite'

import KeywordFilterZeroComponent from './filter-zero'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

import {
  enableKeywordOrganicRankTracking,
  disableKeywordOrganicRankTracking
} from '../../redux/actions/productDetail'

import ImgLock from '../../assets/img/lock.png'

const ProductKeywordZeroComponent = ({isExtensionInstalled}) => {
  const store = useStore().getState()
  const dispatch = useDispatch()
  const {header, productDetail} = store
  const {zeroImprKeywords} = productDetail
  const {currencyRate, currencySign} = header

  const [showFilter, setShowFilter] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [matchType, setMatchType] = useState({value:'all', label: 'All'})

  const options = [
    {value: 'active', label: 'Active'},
    {value: 'active-paused', label: 'Active or Paused'},
    {value: 'paused', label: 'Paused'},
    {value: 'archived', label: 'Archived'},
    {value: 'all', label: 'All'},
  ]

  const onShowFilter = () => {
    setShowFilter(true)
  }
  const onHideFilter = () => {
    setShowFilter(false)
  }
  const onMatchTypeChange = (value) => {
    setMatchType(value)
  }

  const onOrganicRankClick = (keyword) => {
    if (keyword['auto_organic_rank_checking']) {
      dispatch(disableKeywordOrganicRankTracking({
        keyword: keyword['keyword']
      }))
    } else {
      dispatch(enableKeywordOrganicRankTracking({
        keyword: keyword['keyword']
      }))
    }
  }

  const rowElements = zeroImprKeywords.map((keyword) => {
    if (!keyword['keyword'].toLowerCase().includes(searchKey.toLowerCase())) {
      return null
    }
    if (matchType['value'] === 'active') {
      if (keyword['state'] !== 'active') {
        return null
      }
    } else if (matchType['value'] === 'paused') {
      if (keyword['state'] !== 'paused') {
        return null
      }
    } else if (matchType['value'] === 'active-paused') {
      if (keyword['state'] !== 'active' && keyword['state'] !== 'paused') {
        return null
      }
    }
    
    return (
      <div className="table-row">
        <div className="table-col">{keyword['keyword']}</div>
        <div className="table-col">{keyword['ad_group_name']}</div>
        <div className="table-col min-width-300">{keyword['campaign_name']}</div>
        <div className="table-col">{keyword['match1']}</div>
        <div className="table-col">{keyword['keyword_bid']}</div>
        <div className="table-col">{formatCurrency(keyword['avcpc'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatCurrency(keyword['max_cpc'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatCurrency(keyword['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatCurrency(keyword['cost'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue(keyword['acos'], 'number', 2)}</div>
        <div className="table-col">{formatValue(keyword['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue(keyword['clicks'], 'number', 0)}</div>
        <div className="table-col">
          {isExtensionInstalled ? 
            <Toggle checked={keyword['auto_organic_rank_checking'] ? true:false} onChange={()=>onOrganicRankClick(keyword)} />
            :
            <Whisper
              trigger="hover"
              placement="auto"
              speaker={
                <Tooltip>
                  Install the 'PPC Entourage Chrome Extension' to enable product rank tracking
                  property
                </Tooltip>
              }
            >
              <img alt={keyword['keyword']} src={ImgLock} />
            </Whisper>
          }
        </div>
        <div className="table-col">
          {isExtensionInstalled ? 
            <Radio checked={keyword['indexing_last_check_date'] ? true:false} />
            :
            <Whisper
              trigger="hover"
              placement="auto"
              speaker={
                <Tooltip>
                  Install the 'PPC Entourage Chrome Extension' to see and check the indexing statuses
                  property
                </Tooltip>
              }
            >
              <img alt={keyword['keyword']} src={ImgLock} />
            </Whisper>
          }
        </div>
      </div>
    )
  })

  return (
    <>
      <KeywordFilterZeroComponent showFilter={showFilter} onClose={onHideFilter} />
      <div className="content-header">
        <input type="text" className="header-search" placeholder="Search..." value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
        <Select classNamePrefix={"match-type-select"} value={matchType} options={options} onChange={onMatchTypeChange} />
        <div className="btn-filter" onClick={ onShowFilter }>Filter Keywords</div>
      </div>
      <div className="keyword-table">
        <div className="table-header table-row">
          <div className="table-col">Keyword</div>
          <div className="table-col">Ad Group</div>
          <div className="table-col min-width-300">Campaign</div>
          <div className="table-col">Match</div>
          <div className="table-col">Keyword Bid</div>
          <div className="table-col">Ave CPC</div>
          <div className="table-col">Max CPC</div>
          <div className="table-col">Rev</div>
          <div className="table-col">Spend</div>
          <div className="table-col">ACoS%</div>
          <div className="table-col">Impress</div>
          <div className="table-col">Clicks</div>
          <div className="table-col">Organic Rank Tracker</div>
          <div className="table-col">Indexing State</div>
        </div>
        <div className="table-content">
          {rowElements}
        </div>
      </div>
    </>
  );
}

export default ProductKeywordZeroComponent
