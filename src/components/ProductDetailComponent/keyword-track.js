import React, { useState } from 'react'
import { useStore } from 'react-redux'
import moment from 'moment'

import { Toggle, Radio, Tooltip, Whisper } from 'rsuite'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

import ImgLock from '../../assets/img/lock.png'

const ProductKeywordTrackComponent = ({isExtensionInstalled}) => {
  const store = useStore().getState()
  const { productDetail, header } = store
  const { organicKeywords } = productDetail
  const { currencyRate, currencySign } = header

  const [ searchKey, setSearchKey ] = useState('')

  const rowElements = organicKeywords.map((keyword) => {
    if (!keyword['keyword'].toLowerCase().includes(searchKey.toLowerCase())) {
      return null
    }
    return (
      <div className="table-row">
        <div className="table-col">{keyword['keyword']}</div>
        <div className="table-col">
          {isExtensionInstalled ? 
            <Toggle checked={keyword['auto_organic_rank_checking'] ? true:false} />
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
        <div className="table-col">{formatCurrency(keyword['cost'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue(keyword['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue(keyword['orders'], 'number', 0)}</div>
        <div className="table-col">{formatValue(keyword['max_cpc'], 'number')}</div>
        <div className="table-col">{keyword['started_tracking_on'] ? moment(keyword['started_tracking_on']).format('YYYY-MM-DD') : ''}</div>
        <div className="table-col"></div>
      </div>
    )
  })

  return (
    <>
      <div className="content-header">
        <input type="text" className="header-search" placeholder="Search..." value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
      </div>
      <div className="organic-table">
        <div className="table-header table-row">
          <div className="table-col">Keyword</div>
          <div className="table-col">Organic Rank</div>
          <div className="table-col">Rank Change</div>
          <div className="table-col">Spend</div>
          <div className="table-col">Impressions</div>
          <div className="table-col">Number Of Orders</div>
          <div className="table-col">Max CPC</div>
          <div className="table-col">Started Tracking On</div>
          <div className="table-col">Actions</div>
        </div>
        <div className="table-content">
          { rowElements }
        </div>
      </div>
    </>
  );
}

export default ProductKeywordTrackComponent
