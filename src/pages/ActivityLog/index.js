import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'

import MainLayout from '../../layout/MainLayout'
import APMComponent from '../../components/APMComponent'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import PageHeader from './PageHeader'
import Header from './Header'
import LogTable from './LogTable'

import {
  getActivityLog,
} from '../../redux/actions/activityLog'

const TAB_ALL = 'All'
const TAB_AP = 'Smart Pilot'

const ActivityLog = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    activityLog: {
      isLoading,
      logs,
    },
    pageGlobal: { showAPM },
  } = store.getState()

  const [activeTab, setActiveTab] = useState(TAB_ALL)
  const [currentType, setCurrentType] = useState('')
  const [range, setRange] = useState([
    moment().subtract(14, 'days'),
    moment(),
  ])
  const [selectedLogs, setSelectedLogs] = useState([])

  useEffect(() => {
    dispatch(getActivityLog(range[0], range[1]))
  }, [range]) // eslint-disable-line

  const handleTabChange = tab => (event) => {
    event.preventDefault()
    setActiveTab(tab)
  }

  let filteredLogs = logs || []
  if (activeTab === TAB_AP) {
    filteredLogs = filteredLogs.filter(log => (
      (log.log_type || '').indexOf('ap_') === 0
    ))
  }

  if (currentType) {
    // TODO: Share this logic with campaign details page log section.
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
  }

  return (
    <MainLayout>
      <div className="activity-log">
        <PageHeader />
        <div className="page-content">
          { isLoading && <LoaderComponent /> }
          { showAPM && <APMComponent /> }
          <Header
            tabList={[TAB_ALL, TAB_AP]}
            activeTab={activeTab}
            currentType={currentType}
            range={range}
            onTabChange={handleTabChange}
            onTypeChange={setCurrentType}
            onRangeChange={setRange}
          />
          <LogTable
            logs={filteredLogs}
            selectedLogs={selectedLogs}
            onSelect={setSelectedLogs}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default ActivityLog
