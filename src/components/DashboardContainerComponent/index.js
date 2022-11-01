import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'

import DashboardTableComponent from '../../components/DashboardTableComponent'
import DashboardChartComponent from '../../components/DashboardChartComponent'
import KpiList from './KpiList'

import {
  getTopCampaigns,
} from '../../redux/actions/campaign'

import {
  getAllSkusWithProfit,
  getTopProducts,
} from '../../redux/actions/product'

import {
  getListPortfolios,
} from '../../redux/actions/portfolio'

import {
  getSalesStats,
  getStats,
} from '../../redux/actions/dashboard'

const adTypes = [
  { label: 'All Sponsored Dashboard', value: '' },
  { label: 'Sponsored Product Dashboard', value: 'sp' },
  { label: 'Sponsored Brand Dashboard', value: 'sb' },
  { label: 'Sponsored Brand Video Dashboard', value: 'sbv' },
  { label: 'Sponsored Display Dashboard', value: 'sd' },
]

const DashboardContainerComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()

  const {
    dashboard,
    header,
  } = store

  const {
    maxTable,
    salesStats,
    stats,
    isSalesStatsLoading,
    isStatsLoading,
  } = dashboard

  const {
    currencyRate,
    currencySign,
    currentUserId,
    currentStartDate,
    currentEndDate,
  } = header

  const [ currentAdType, setCurrentAdType ] = useState(adTypes[0])

  useEffect(() => {
    if (!currentUserId) {
      return
    }

    dispatch(
      getSalesStats({
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      })
    )
  }, [currentStartDate, currentEndDate, currentUserId]) // eslint-disable-line

  useEffect(() => {
    if (!currentUserId) {
      return
    }

    dispatch(
      getStats({
        adType: currentAdType.value,
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      })
    )
  }, [currentStartDate, currentEndDate, currentUserId, currentAdType]) // eslint-disable-line

  useEffect(() => {
    if (!currentUserId) {
      return
    }

    dispatch(
      getTopCampaigns({
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      })
    )
    dispatch(
      getTopProducts({
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      })
    )
    dispatch(
      getAllSkusWithProfit({
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      })
    )
  }, [currentStartDate, currentEndDate, currentUserId]) // eslint-disable-line

  useEffect(() => {
    if (!currentUserId) {
      return
    }
    dispatch(getListPortfolios())
  }, [currentUserId]) // eslint-disable-line

  const renderTopSection = () => {
    if (maxTable) {
      return null
    }

    const isLoading = isStatsLoading || isSalesStatsLoading
    return (
      <>
        <KpiList
          salesStats={salesStats}
          stats={stats}
          adTypes={adTypes}
          currentAdType={currentAdType}
          onChangeAdType={setCurrentAdType}
          isLoading={isLoading}
          currencySign={currencySign}
          currencyRate={currencyRate}
          currentStartDate={currentStartDate}
          currentEndDate={currentEndDate}
        />
        <DashboardChartComponent
          isLoading={isLoading}
        />
      </>
    )
  }

  return (
    <div className="dashboard-page">
      { renderTopSection() }
      <DashboardTableComponent />
    </div>
  )
}

export default DashboardContainerComponent
