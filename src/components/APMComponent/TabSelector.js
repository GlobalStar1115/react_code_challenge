import React from 'react'

const TabSelector = ({ tabList, activeTab, onSetActiveTab }) => (
  <div className="section-tab-selector">
    {
      tabList.map(tab => (
        <div
          key={tab.value}
          className={`section-tab ${activeTab === tab.value ? 'selected' : ''}`}
          onClick={() => { onSetActiveTab(tab.value) }}
        >
          { tab.label }
        </div>
      ))
    }
  </div>
)

export default TabSelector
