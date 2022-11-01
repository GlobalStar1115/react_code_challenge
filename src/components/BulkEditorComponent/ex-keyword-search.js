import React, { useState } from 'react'

// components
import ExpansionKeywordTabsComponent from './ex-keyword-search-tab-keyword'
import ExpansionDuplicateTabComponent from './ex-keyword-search-tab-duplicate'

const ExpansionKeywordSearchComponent = ({onChangeChildTab, ...props}) => {
  const [ currentTab, setCurrentTab ] = useState('keyword')
  
  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
    onChangeChildTab(tab)
  }

  return (
    <div className="ex-keyword-search-component">
      <div className="ex-keyword-search-header">
        <div className="keyword-search-tabs">
          <div className={ "tab " + (currentTab === 'keyword' && 'selected') } onClick={() => { handleChangeTab('keyword') }}>Keyword Search</div>
          <div className={ "tab " + (currentTab === 'duplicate' && 'selected') } onClick={() => { handleChangeTab('duplicate') }}>Find Duplicate Keywords</div>
        </div>
      </div>
      <div className="ex-keyword-search-content">
        { currentTab === 'keyword' && 
          <ExpansionKeywordTabsComponent
            {...props}
          />
        }
        { currentTab === 'duplicate' && 
          <ExpansionDuplicateTabComponent
            {...props}
          />
        }
      </div>
    </div>
  );
}

export default ExpansionKeywordSearchComponent
