import React, { useState, useEffect, useRef } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Select from 'react-select'
import { DatePicker, Dropdown } from 'rsuite'
import moment from 'moment'

import { toast } from '../CommonComponents/ToastComponent/toast'
import MetricsComponent from './metrics'
import PerformanceComponent from './performance'
import ReportComponent from './report'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { getAccountHealthData, setDateRange, saveNotificationPlan, disableNotification } from '../../redux/actions/health'

const AccountHealthComponent = () => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const { product, portfolio, health, header } = store
  const { topProducts } = product
  const { listPortfolios } = portfolio
  const { isLoadingSummary, isLoadingMatchType, isLoadingPlacement, isSavingNotificationPlan, isNotificationUpdated, startDate, endDate } = health
  const { listAccounts, currentUserId } = header

  const currentUser = listAccounts.filter(user => user['user'] === currentUserId)[0]

  const [ tab, setTab ] = useState('metric')
  const [ adTypeFilter, setAdTypeFilter ] = useState({})
  const [ productFilter, setProductFilter ] = useState({})
  const [ portfolioFilter, setPortfolioFilter ] = useState({})
  const [ weeklyAlert, setWeeklyAlert ] = useState(currentUser['weekly_alert'])
  const [ monthlyAlert, setMonthlyAlert ] = useState(currentUser['monthly_alert'])
  const [ additionalAlert, setAdditionalAlert ] = useState(currentUser['additional_alert'])
  const [openNotificationDropdown, setOpenNotificationDropdown] = useState(false)

  const dateRangeContainerRef = useRef(null)

  useEffect(() => {
    dispatch(getAccountHealthData({
      startDate,
      endDate
    }))
  }, [dispatch, startDate, endDate])
  useEffect(() => {
    if (isNotificationUpdated) {
      toast.show({
        title: 'Success',
        description: 'Notification Plan Updated Successfully!',
      })
      dispatch(disableNotification())
    }
  }, [dispatch, isNotificationUpdated])

  const adTypes = [
    { label: 'All Sponsored', value: '' },
    { label: 'Sponsored Product', value: 'sp' },
    { label: 'Sponsored Brand', value: 'sb' },
    { label: 'Sponsored Brand Video', value: 'sbv' },
    { label: 'Sponsored Display', value: 'sd' },
  ]
  const productOptions = [
    {value: 'all', label: 'All'},
    ...topProducts.map(data => ({value: data.id, label: data.product}))
  ]
  const portfolioOptions = [
    {value: 'all', label: 'All'},
    ...listPortfolios.map(data => ({value: data.id, label: data.name}))
  ]

  const tabs = [
    {value: 'metric', label: 'Main Metrics'},
    {value: 'performance', label: 'Performance'},
    {value: 'report', label: 'Campaign Reports'}
  ]
  const tabElements = tabs.map(data => ( <div key={data.value} className={tab===data.value ? "component-tab selected" : "component-tab"} onClick={()=>setTab(data.value)}>{data.label}</div>))

  const onAdTypeChange = (data) => {
    setAdTypeFilter(data)

    dispatch(getAccountHealthData({
      startDate,
      endDate,
      adTypeFilter: data,
      productFilter,
      portfolioFilter
    }))
  }
  const onPortfolioChange = (data) => {
    setPortfolioFilter(data)

    dispatch(getAccountHealthData({
      startDate,
      endDate,
      adTypeFilter,
      productFilter,
      portfolioFilter: data
    }))
  }
  const onProductChange = (data) => {
    setProductFilter(data)

    dispatch(getAccountHealthData({
      startDate,
      endDate,
      adTypeFilter,
      productFilter: data,
      portfolioFilter
    }))
  }
  const onChangeDateRange = (data) => {
    dispatch(
      setDateRange({
        startDate: moment(data).startOf('month').format('YYYY-MM-DD'),
        endDate: moment(data).endOf('month').format('YYYY-MM-DD'),
        adTypeFilter,
        productFilter,
        portfolioFilter
      })
    )
  }
  const onSavePlan = () => {
    dispatch(saveNotificationPlan({
      weeklyAlert,
      monthlyAlert,
      additionalAlert
    }))
  }

  const handleToggleDropdown = () => {
    setOpenNotificationDropdown(false)
  }
  return (
    <div className={(isLoadingSummary || isLoadingMatchType || isLoadingPlacement || isSavingNotificationPlan) ? "account-health-component isLoading" : "account-health-component"}>
      {(isLoadingSummary || isLoadingMatchType || isLoadingPlacement) && <LoaderComponent />}
      <div className="component-notification">
        <Dropdown title="Change Notification Plan" onClick={() => { setOpenNotificationDropdown(true) }} open={openNotificationDropdown} onMouseLeave={handleToggleDropdown}>
          <Dropdown.Item onClick={()=>setMonthlyAlert(!monthlyAlert)}>
            <CheckboxComponent checked={monthlyAlert} />
            <span>Monthly Email: Opt-in to receive monthly emails from PPC Entourage containing account performance updates.</span>
          </Dropdown.Item>
          <Dropdown.Item onClick={()=>setWeeklyAlert(!weeklyAlert)}>
            <CheckboxComponent checked={weeklyAlert} />
            <span>Weekly Email: Opt-in to receive weekly emails from PPC Entourage containing account performance updates.</span>
          </Dropdown.Item>
          <Dropdown.Item onClick={()=>setAdditionalAlert(!additionalAlert)}>
            <CheckboxComponent checked={additionalAlert} />
            <span>Opt-in to additional emails from PPC Entourage that may contain educational resources, training and webinar schedules, and marketing content. Your information is never shared with a third party.</span>
          </Dropdown.Item>
          <Dropdown.Item>
            <button type="button" className="btn btn-red" onClick={onSavePlan}>Save</button>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <div className="component-header">
        <div className="header-row">
          <span>Ad Type</span>
          <Select classNamePrefix={"custom-campaign-filter"} options={adTypes} value={adTypeFilter} onChange={onAdTypeChange} />
        </div>
        <div className="header-row">
          <span>Portfolio</span>
          <Select classNamePrefix={"custom-portfolio-filter"} options={portfolioOptions} value={portfolioFilter} onChange={onPortfolioChange} />
        </div>
        <div className="header-row">
          <span>SKU/ASIN/Product</span>
          <Select classNamePrefix={"custom-product-filter"} options={productOptions} value={productFilter} onChange={onProductChange} />
        </div>
        <div className="header-row date-range-container" ref={dateRangeContainerRef}>
          <span>Select Date Range</span>
          <DatePicker
            format="YYYY-MM"
            onChange={onChangeDateRange}
            value={moment(startDate).toDate()}
            ranges={[]}
            limitEndYear={0}
            container={dateRangeContainerRef.current}
          />
        </div>
      </div>
      <div className="component-body">
        <div className="component-tabs">
          {tabElements}
        </div>
        {tab==='metric' &&
          <MetricsComponent />
        }
        {tab==='performance' &&
          <PerformanceComponent />
        }
        {tab==='report' &&
          <ReportComponent />
        }
      </div>
    </div>
  );
}

export default AccountHealthComponent
