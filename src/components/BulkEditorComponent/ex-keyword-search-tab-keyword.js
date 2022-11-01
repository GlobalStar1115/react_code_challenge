import React, { useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'

//--assets
import moment from 'moment'

// Components
import ExpansionKeywordSearchKeywordsTableComponent from './ex-keyword-search-keywords-table'
import ExpansionKeywordSearchTermssTableComponent from './ex-keyword-search-terms-table'

//--actions
import {
  getProductsByKeyword
} from '../../redux/actions/product'

import {
  getCampaignsByKeyword,
  getCampaignExFindKeywords
} from '../../redux/actions/campaign'
// helper

const ExpansionKeywordTabsComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { 
    selectedCampaigns, // eslint-disable-next-line
    selectedSkus,
  } = props
  
  const { 
    auth: { token },
  } = store.getState()
  
  const [currentTab, setCurrentTab] = useState('keywords')

  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
  }

  const keywordInputRef = useRef()
  
  // Load Search Terms with Acos, campaigns
  const handleFindKeywords = () => {
    if (selectedSkus.length === 0 || selectedCampaigns.length === 0) {
      return
    }
      
    const keyword = keywordInputRef.current.value
    if (!keyword) {
      return
    }
    
    let campaignData = ''
    selectedSkus.map(sku => campaignData += 'SKU='+sku.sku+'&')
    selectedCampaigns.map(campaign => campaignData += 'campaign='+campaign.campaignid+'&')
    // FIXME to use current start date
    const startDate = moment('2021-05-02').format('YYYY-MM-DD')
    // FIXME to use current end date
    const endDate = moment('2021-05-31').format('YYYY-MM-DD')
    // FIXME to use current user id
    campaignData+='endDate=' + endDate + '&keyword='+ keyword + '&startDate=' + startDate + '&user=238'    
    
    dispatch(getCampaignExFindKeywords({ campaignData, token}))

  }
  const handleFindSkus = () => {
    const keyword = keywordInputRef.current.value
    if (!keyword) {
      return
    }
    
    dispatch(getProductsByKeyword({ keyword, token }))
    dispatch(getCampaignsByKeyword({ keyword, token }))
  }

  return (
    <div className="expansion-keyword-search-tab-keyword">
      <div className="keyword-search-tab-keyword-header">
        <span>Find valuable information such as profit, match type and ad spend.</span>
        <div className="input-container">
          <input className='acosTargetInput' ref={keywordInputRef}/>
          <button type="button" className="btn-accent btn-find-skus" onClick={ handleFindSkus }>
            Search
          </button>
        </div>
      </div>
      <button type="button" className="btn-accent btn-find-asin" onClick={ handleFindKeywords }>
        Continue
      </button>

      <div className="keyword-search-tab-keyword-tabs">
        <div className={"tab "+(currentTab==='keywords' && 'selected')} onClick={() => { handleChangeTab('keywords') }}>Keywords</div>
        <div className={"tab "+(currentTab==='search-terms' && 'selected')} onClick={() => { handleChangeTab('search-terms') }}>Search Terms</div>
      </div>
      <div className="keyword-search-tab-keyword-container">
        {
          currentTab === 'keywords' && <ExpansionKeywordSearchKeywordsTableComponent {...props} />
        }
        {
          currentTab === 'search-terms' && <ExpansionKeywordSearchTermssTableComponent {...props} />
        }
      </div>
    </div>
  );
}

export default ExpansionKeywordTabsComponent
