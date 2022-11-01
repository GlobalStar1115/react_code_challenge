import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Select from 'react-select'
import { Toggle, Radio, Tooltip, Whisper } from 'rsuite'

import KeywordFilterAboveComponent from './filter-above'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

import {
  enableKeywordOrganicRankTracking,
  disableKeywordOrganicRankTracking
} from '../../redux/actions/productDetail'

import ImgLock from '../../assets/img/lock.png'
import KeywordOptionComponent from './keyword-select-option'

const ProductKeywordAboveComponent = ({isExtensionInstalled}) => {
  const store = useStore().getState()
  const dispatch = useDispatch()
  const {header, productDetail} = store
  const {targetAcosKeywords} = productDetail
  const {currencyRate, currencySign} = header

  const [showFilter, setShowFilter] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [matchType, setMatchType] = useState({value:'all', label: 'All'})
  const [keywordChecking, setKeywordChecking] = useState({})
  const [allKeywordChecking, setAllKeywordChecking] = useState(false)
  const [clipboard, setClipboard] = useState('')

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
  const onKeywordCheck = (id) => {
    keywordChecking[id] = !keywordChecking[id]
    setKeywordChecking(keywordChecking)
    setAllKeywordChecking(false)
    let keywordNames = []
    for (let i in keywordChecking) {
      if (keywordChecking[i]) {
        keywordNames.push(targetAcosKeywords.filter(k => k.keyword_id === i)[0]['keyword'])
      }
    }

    if (keywordNames.length) {
      setClipboard(keywordNames.join(', '))
    }
  }
  const onAllKeywordCheck = () => {
    let tmp = {...keywordChecking}
    for (let i in targetAcosKeywords) {
      const keyword = targetAcosKeywords[i]
      if (keyword['profit1'] > 0 || !keyword['keyword'].toLowerCase().includes(searchKey.toLowerCase())) {
        continue
      }
      if (matchType['value'] === 'active') {
        if (keyword['state'] !== 'enabled') {
          continue
        }
      } else if (matchType['value'] === 'paused') {
        if (keyword['state'] !== 'paused') {
          continue
        }
      } else if (matchType['value'] === 'active-paused') {
        if (keyword['state'] !== 'enabled' && keyword['state'] !== 'paused') {
          continue
        }
      } else if (matchType['value'] === 'archived') {
        if (keyword['state'] !== 'archived') {
          continue
        }
      }

      tmp[targetAcosKeywords[i]['keyword_id']] = !allKeywordChecking
    }
    setKeywordChecking(tmp)
    setAllKeywordChecking(!allKeywordChecking)
  }

  const rowElements = targetAcosKeywords.map((keyword) => {
    if (keyword['profit1'] > 0 || !keyword['keyword'].toLowerCase().includes(searchKey.toLowerCase())) {
      return null
    }
    if (matchType['value'] === 'active') {
      if (keyword['state'] !== 'enabled') {
        return null
      }
    } else if (matchType['value'] === 'paused') {
      if (keyword['state'] !== 'paused') {
        return null
      }
    } else if (matchType['value'] === 'active-paused') {
      if (keyword['state'] !== 'enabled' && keyword['state'] !== 'paused') {
        return null
      }
    } else if (matchType['value'] === 'archived') {
      if (keyword['state'] !== 'archived') {
        return null
      }
    }
    
    return (
      <div className="table-row">
        <div className="table-col">
          <CheckboxComponent
            checked={keywordChecking[keyword['keyword_id']]}
            onChange={()=>onKeywordCheck(keyword['keyword_id'])}
          />
        </div>
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
      <KeywordFilterAboveComponent showFilter={showFilter} onClose={onHideFilter} />
      <div className="content-header">
        <input type="text" className="header-search" placeholder="Search..." value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
        <Select classNamePrefix={"match-type-select"} value={matchType} options={options} onChange={onMatchTypeChange} />
        <div className="btn-filter" onClick={ onShowFilter }>Filter Keywords</div>
        <KeywordOptionComponent clipboard={clipboard} keywordChecking={keywordChecking} />
      </div>
      <div className="keyword-table">
        <div className="table-header table-row">
          <div className="table-col">
            <CheckboxComponent
              checked={allKeywordChecking}
              onChange={onAllKeywordCheck}
            />
          </div>
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

export default ProductKeywordAboveComponent
