import React, { useState } from 'react'
import { useStore } from 'react-redux'
import Select from 'react-select'
import moment from 'moment'

import CustomTable from '../../../../CommonComponents/CustomTableComponent'
import LoaderComponent from '../../../../CommonComponents/LoaderComponent'

const CATEGORY_AP = 'ap'

const categoryList = [
  { value: '', label: 'All Logs' },
  { value: CATEGORY_AP, label: 'Smart Pilot Logs' },
]

const typeList = [
  { value: '', label: '- Select All -' },
  { value: 'bid_change', label: 'Bid change' },
  { value: 'adv_kw', label: 'Advanced keyword updates' },
  { value: 'out_of_budget', label: 'Out of budget' },
  { value: 'dayparting', label: 'Dayparting on/off' },
]

const LogSection = () => {
  const store = useStore()

  const {
    campaignDetail: {
      isLoading,
      currentLogs,
    },
  } = store.getState()

  const [currentCategory, setCurrentCategory] = useState(categoryList[0])
  const [currentType, setCurrentType] = useState(typeList[0])
  const [selectedLogs, setSelectedLogs] = useState([])

  const renderAction = () => {
    return (
      <>
        <Select
          className="category-selector"
          value={currentCategory}
          options={categoryList}
          onChange={setCurrentCategory}
        />
        <Select
          className="type-selector"
          value={currentType}
          options={typeList}
          onChange={setCurrentType}
        />
      </>
    )
  }

  const renderLog = log => (
    <>
      <div className="table-col col-type">
        { log.type }
      </div>
      <div className="table-col col-created-at">
        { moment(log.created_at).local().format('M/D') }
      </div>
      <div
        className="table-col col-description"
        dangerouslySetInnerHTML={{
          __html: log.description,
        }}
      />
      <div
        className="table-col col-contents"
        dangerouslySetInnerHTML={{
          __html: log.contents,
        }}
      />
    </>
  )

  let filteredLogs = currentLogs || []
  if (currentCategory.value === CATEGORY_AP) {
    filteredLogs = filteredLogs.filter(log => (
      (log.log_type || '').indexOf('ap_') === 0
    ))
  }
  switch (currentType.value) {
    case 'bid_change':
      filteredLogs = filteredLogs.filter(log => (
        log.log_type === 'ap_kw_basic'
      ))
      break
    case 'adv_kw':
      filteredLogs = filteredLogs.filter(log => (
        log.log_type === 'ap_kw_adv'
      ))
      break
    case 'out_of_budget':
      filteredLogs = filteredLogs.filter(log => (
        log.log_type === 'out_of_budget'
      ))
      break
    case 'dayparting':
      filteredLogs = filteredLogs.filter(log => (
        log.log_type === 'ap_dayparting'
      ))
      break
    default:
      break
  }

  return (
    <div className={`section section-log${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="section-header">
        <h4>Logs</h4>
      </div>
      <CustomTable
        className="table-logs"
        records={filteredLogs}
        idField="id"
        searchFields={['contents']}
        selectedRecords={selectedLogs}
        paginationSelectPlacement="top"
        renderRecord={renderLog}
        renderTopRight={renderAction}
        onChange={setSelectedLogs}
      >
        <div className="table-col col-type">Log Type</div>
        <div className="table-col col-created-at">Date</div>
        <div className="table-col col-description">Description</div>
        <div className="table-col col-contents">Detail</div>
      </CustomTable>
    </div>
  )
}

export default LogSection