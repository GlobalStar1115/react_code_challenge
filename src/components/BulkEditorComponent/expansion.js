import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'

// Components
import ExpansionKeywordComponent from './ex-keyword'
import ExpansionSearchTermComponent from './ex-search-term'
import ExpansionMatchTypeComponent from './ex-match-type'
import ExpansionProductTargetingComponent from './ex-product-targeting'
import ExpansionKeywordSearchComponent from './ex-keyword-search'
import ExSkuSelector from './ex-sku-selector'
import ExCampaignSelector from './ex-campaign-selector'

//--actions
import { getAllProducts } from '../../redux/actions/product'

const BulkEditorOptimizationComponent = () => {
  const store = useStore()
  const dispatch = useDispatch()

  const { auth: { token }, } = store.getState()  

  const [ selectedCampaigns, setSelectedCampaigns ] = useState([])
  const [ selectedSkus, setSelectedSkus ] = useState([])
  
  useEffect(() => {
    dispatch(getAllProducts({ token }))
  }, [token]) // eslint-disable-line
  
  const [ currentTab, setCurrentTab ] = useState('keyword')
  const [ childTab, setChildTab ] = useState('keyword')

  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
  }
  const handleChangeChildTab = (tab) => {
    setChildTab(tab)
  }
  const handleChangeSkus = (skus) => {
    setSelectedSkus(skus)
  }
  const handleChangeCampaigns = (campaigns) => {
    setSelectedCampaigns(campaigns)
  }
  return (
		<div className="bulk-editor-tab-content expansion">
      <div className="bulk-header">
        <div className="header-input">
          <span>SKUs</span>
          <ExSkuSelector 
            handleChangeSkus={ handleChangeSkus }
            tab={ currentTab + '-' + childTab }
          />
        </div>
        <div className="header-input">
          <span>Campaigns</span>
          <ExCampaignSelector
            handleChangeCampaigns={ handleChangeCampaigns }
            tab={ currentTab + '-' + childTab }
          />
        </div>
      </div>
      <div className="bulk-tabs">
        <div className={ currentTab === 'keyword' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('keyword') }>Keywords</div>
        <div className={ currentTab === 'search-term' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('search-term') }>Search Terms</div>
        <div className={ currentTab === 'match' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('match') }>Match Type</div>
        <div className={ currentTab === 'product' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('product') }>Product Targeting</div>
        <div className={ currentTab === 'keyword-search' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('keyword-search') }>Keyword Search</div>
      </div>
      {currentTab === 'keyword' &&
        <ExpansionKeywordComponent 
          selectedCampaigns={ selectedCampaigns }
        />
      }
      {currentTab === 'search-term' &&
        <ExpansionSearchTermComponent 
          selectedCampaigns={ selectedCampaigns }
          selectedSkus={ selectedSkus }
        />
      }
      {currentTab === 'match' &&
        <ExpansionMatchTypeComponent 
          selectedCampaigns={ selectedCampaigns }
          selectedSkus={ selectedSkus }
        />
      }
      {currentTab === 'product' &&
        <ExpansionProductTargetingComponent 
          selectedCampaigns={ selectedCampaigns }
          selectedSkus={ selectedSkus }
        />
      }
      {currentTab === 'keyword-search' &&
        <ExpansionKeywordSearchComponent 
          selectedCampaigns={ selectedCampaigns }
          selectedSkus={ selectedSkus }
          onChangeChildTab={handleChangeChildTab}
        />
      }
		</div>
  );
}

export default BulkEditorOptimizationComponent
