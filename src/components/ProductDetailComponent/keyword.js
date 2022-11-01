/*global chrome*/
import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'
import DateRangeComponent from '../CommonComponents/DateRangeComponent'

import ProductKeywordBelowComponent from './keyword-below'
import ProductKeywordAboveComponent from './keyword-above'
import ProductKeywordZeroComponent from './keyword-zero'
import ProductKeywordTrackComponent from './keyword-track'


//--actions
import {
  setActiveTabInKeyword,
  setKeywordDateRange,
  filterTargetAcosKeywords,
  filterKeywordWithZeroImpression,
  filterOrganicKeywords
} from '../../redux/actions/productDetail'
import { EXTENSION_ID } from '../../utils/constants/defaultValues'

const ProductKeywordComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const {product, productDetail, header} = store
  const {currentUserId} = header
  const {activeKeywordTab, keywordStartDate, keywordEndDate} = productDetail
  const {curProduct} = product

  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)

  const tabs = [
    { value: 'below', label: 'Below Target ACoS'},
    { value: 'above', label: 'Above Target ACoS'},
    { value: 'zero', label: 'Targets With Zero Impressions'},
    { value: 'track', label: 'Track Organic Position'}
  ]
  
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(EXTENSION_ID, { type: 'checkIfExtensionInstalled' }, function (response) {
        if (chrome.runtime.lastError) {
          return
        }
        if (response && response.success === true) {
          setIsExtensionInstalled(true)
        }
      });
    }
  })

  useEffect(() => {
    dispatch(filterTargetAcosKeywords({
      id: curProduct['id'],
      sku: curProduct['sku'],
      userId: currentUserId,
      keywordStartDate,
      keywordEndDate
    }))
    dispatch(filterKeywordWithZeroImpression({
      id: curProduct['id'],
      sku: curProduct['sku'],
      userId: currentUserId,
      keywordStartDate,
      keywordEndDate
    }))
    dispatch(filterOrganicKeywords({
      id: curProduct['id'],
      sku: curProduct['sku'],
      userId: currentUserId,
      keywordStartDate,
      keywordEndDate
    }))
  }, [dispatch, curProduct, currentUserId, keywordStartDate, keywordEndDate])

  const tabElements = tabs.map(tab => (
    <div className={activeKeywordTab === tab.value ? "tab selected" : "tab"} onClick={()=>onChangeTab(tab.value)}>{ tab.label }</div>
  ))

  const onChangeTab = (tab) => {
    dispatch(setActiveTabInKeyword(tab))
  }
  const handleChangeDateRange = ([startDate, endDate]) => {
    dispatch(
      setKeywordDateRange({
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      })
    )
  }

  return (
    <div className="product-detail-keyword">
      <div className="detail-keyword-header">
        <div className="keyword-tabs">
          { tabElements }
        </div>
        <DateRangeComponent
          onChange={handleChangeDateRange}
          value={[keywordStartDate, keywordEndDate]}
        />
      </div>
      <div className="detail-keyword-content">
        {activeKeywordTab === 'below' &&
          <ProductKeywordBelowComponent isExtensionInstalled={isExtensionInstalled} />
        }
        {activeKeywordTab === 'above' &&
          <ProductKeywordAboveComponent isExtensionInstalled={isExtensionInstalled} />
        }
        {activeKeywordTab === 'zero' &&
          <ProductKeywordZeroComponent isExtensionInstalled={isExtensionInstalled} />
        }
        {activeKeywordTab === 'track' &&
          <ProductKeywordTrackComponent isExtensionInstalled={isExtensionInstalled} />
        }
      </div>
    </div>
  );
}

export default ProductKeywordComponent
