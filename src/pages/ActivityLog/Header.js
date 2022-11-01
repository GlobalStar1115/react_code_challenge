/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Select from 'react-select'

import DateRangeComponent from '../../components/CommonComponents/DateRangeComponent'

const typeList = [
  { value: '', label: '- Select All -' },
  { value: 'bid_change', label: 'Bid change' },
  { value: 'adv_kw', label: 'Advanced keyword updates' },
  { value: 'out_of_budget', label: 'Out of budget' },
  { value: 'dayparting', label: 'Dayparting on/off' },
]

const Header = ({ tabList, activeTab, currentType, range,
  onTabChange, onTypeChange, onRangeChange }) => {
  return (
    <div className="header-container">
      <div className="tab-container">
        {
          tabList.map(tab => (
            <a
              key={tab}
              href="#"
              className={tab === activeTab ? 'active' : ''}
              onClick={onTabChange(tab)}
            >
              { tab }
            </a>
          ))
        }
      </div>
      <div className="filter-container">
        <Select
          className="type-selector"
          value={currentType}
          options={typeList}
          onChange={onTypeChange}
        />
        <DateRangeComponent
          placement="bottomEnd"
          value={range}
          onChange={onRangeChange}
        />
      </div>
    </div>
  )
}

export default Header
