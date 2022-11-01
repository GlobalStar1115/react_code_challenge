import React, { useState } from 'react'

// components
import ExpansionAsinTargetingComponent from './ex-asin-targeting'
import ExpansionCategoryTargetingComponent from './ex-category-targeting'

const ExpansionProductTargetingComponent = (props) => {
  const [currentTab, setCurrentTab] = useState('asin')

  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
  }

  return (
    <div className="ex-product-targeting-component">
      <div className="ex-product-targeting-header">
        <div className="product-targeting-tabs">
          <div className={ "tab "+(currentTab==='asin' && 'selected') } onClick={() => { handleChangeTab('asin') }}>Asin Targeting</div>
          <div className={ "tab "+(currentTab==='category' && 'selected') } onClick={() => { handleChangeTab('category') }}>Category Targeting</div>
        </div>
      </div>
      <div className="ex-product-targeting-content">
        { currentTab === 'asin' && 
          <ExpansionAsinTargetingComponent
            {...props}
          />
        }
        { currentTab === 'category' && 
          <ExpansionCategoryTargetingComponent
            {...props}
          />
        }
      </div>
    </div>
  );
}

export default ExpansionProductTargetingComponent
