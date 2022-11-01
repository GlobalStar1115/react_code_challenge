import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'

import PaginationComponent from '../CommonComponents/PaginationComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import { toast } from '../CommonComponents/ToastComponent/toast'

import APMComponent from '../APMComponent'
import AddCampaignsToNewPortfolio from './modals/add-campaigns-to-new-portfolio'
import AddCampaignsToExistingPortfolio from './modals/add-campaigns-to-existing-portfolio'
import CampaignThumbHistory from './modals/thumb-history'
import EditTableColumnComponent from './edit-column'
import EditTableFilterComponent from './edit-filter'
import ActionBar from './ActionBar'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import TableFooter from './TableFooter'

import {
  updateCampaignAcos,
  getCampaignsWithHistory,
  updateCampaignsDailyBudget,
  updateCampaignsState,
  sortCampaignData,
  disableNotification
} from '../../redux/actions/campaign'

const CampaignTableComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const acosRef = useRef()
  const dailyBudgetRef = useRef()

  const { campaign, pageGlobal, header, portfolio, ap } = store

  const {
    currencyRate,
    currencySign,
    currentUserId,
  } = header

  const {
    campaignsWithHistory,
    isUpdateCampaignAcos,
    isUpdateCampaignDailyBudget,
    isLoading,
    isUpdateCampaignState,
    startDate,
    endDate,
    sortColumnName,
    sortDirection,
    updateCampaignAcosSuccess,
    updateDailyBudgetSuccess
  } = campaign

  const {
    isAddCampaignToExistingPortfolio,
  } = portfolio

  const {
    showColumnEditor,
    showTableFilter,
    showAPM,
    campaignTableColumns,
    showANP,
    showAEP,
    campaignFilters,
  } = pageGlobal

  const { isTurningBulk } = ap

  const [isShowHistory, setIsShowHistory] = useState(false)
  const [acosCampaignId, setAcosCampaignId] = useState('')
  const [dailyBudgetCampaignId, setDailyBudgetCampaignId] = useState('')
  const [acos, setAcos] = useState('')
  const [dailyBudget, setDailyBudget] = useState('')
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [changeCampaignState, setChangeCampaignState] = useState(false)

  const [pageStartNum, setPageStartNum] = useState(0)
  const [pageEndNum, setPageEndNum] = useState(10)
  const [searchKey, setSearchKey] = useState('')

  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [historyModalData, setHistoryModalData] = useState([])
  const [historyModalCampaign, setHistoryModalCampaign] = useState('')
  const [historyModalMetric, setHistoryModalMetric] = useState('')
  const [historySortAsc, setHistorySortAsc] = useState(false)

  useEffect(() => {
    if (updateCampaignAcosSuccess) {
      toast.show({
        title: 'Success',
        description: 'Target ACoS updated successfully!',
      })
    }
    if (updateDailyBudgetSuccess) {
      toast.show({
        title: 'Success',
        description: 'Daily Budget updated successfully!',
      })
    }
    dispatch(disableNotification())
  }, [dispatch, updateCampaignAcosSuccess, updateDailyBudgetSuccess])

  useEffect(() => {
    if (!currentUserId) {
      return
    }
    loadCampaigns()
  }, [startDate, endDate, currentUserId, acos, dailyBudget, changeCampaignState]) // eslint-disable-line

  useEffect(() => {
    if (!acos) {
      return
    }
    loadCampaigns()
  }, [acos]) // eslint-disable-line

  useEffect(() => {
    if (!changeCampaignState || isUpdateCampaignState) {
      return
    }
    loadCampaigns()
    setChangeCampaignState(false)
  }, [changeCampaignState, isUpdateCampaignState]) // eslint-disable-line

  useEffect(() => {
    if (!dailyBudget) {
      return
    }
    loadCampaigns()
  }, [dailyBudget])// eslint-disable-line

  const total = {
    revenue: 0,
    spend: 0,
    imp: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    orders: 0,
    acos: 0,
    roas: 0,
    ntbOrders: 0,
    ntbSales: 0,
  }

  const columns = [
    {
      name: 'campaign',
      label: 'Campaign'
    },
    {
      name: 'target_acos',
      label: 'ACoS Target %'
    },
    {
      name: 'daily_budget',
      label: 'Daily Budget'
    },
    {
      name: 'cost',
      label: 'Spend',
      dataType: 'currency',
    },
    {
      name: 'impressions',
      label: 'Imp.',
      decimalLength: 0,
    },
    {
      name: 'clicks',
      label: 'Clicks',
      decimalLength: 0,
    },
    {
      name: 'ctr',
      label: 'CTR %',
    },
    {
      name: 'cpc',
      label: 'AVE CPC',
      direct: true,
    },
    {
      name: 'orders',
      label: 'Orders',
      decimalLength: 0,
    },
    {
      name: 'revenue',
      label: 'Sales',
      dataType: 'currency',
    },
    {
      name: 'acos',
      label: 'ACoS %',
      decimalLength: 1,
      direct: true,
    },
    {
      name: 'roas',
      label: 'Return on Ad spend',
      shortLabel: 'ROAS',
    },
    {
      name: 'conversion',
      label: 'Conversion Rate',
      shortLabel: 'Conv %',
    },
    {
      name: 'ntb_orders',
      label: 'NTB Orders',
      decimalLength: 0,
    },
    {
      name: 'ntb_orders_percent',
      label: 'NTB Orders %',
    },
    {
      name: 'ntb_sales',
      label: 'NTB Sales',
    },
    {
      name: 'ntb_sales_percent',
      label: 'NTB Sales %',
    }
  ]

  const loadPageCampaigns = (pageNum, pageRows) => {
    if (pageRows !== 'all') {
      setPageStartNum((pageNum - 1) * pageRows)
      setPageEndNum(pageNum * pageRows - 1)
    } else {
      setPageStartNum(0)
      setPageEndNum(filteredCampaigns.length)
    }
  }

  const onShowTableHistory = () => {
    setIsShowHistory(!isShowHistory)
  }

  const handleAcosBtn = (campaignId) => {
    setAcosCampaignId(campaignId)
  }

  const handleCancelAcos = () => {
    setAcosCampaignId('')
  }

  const handleSaveAcos = (campaign) => {
    const acosValue = parseFloat(acosRef.current.value, 10)
    if (!acosValue || isNaN(acosValue)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter Target ACoS.',
      })
      return
    }

    if (acosValue <= 0) {
      toast.show({
        title: 'Warning',
        description: 'Target ACoS should be greater than 0.',
      })
      return
    }
    dispatch(updateCampaignAcos(campaign.campaignid, campaign.campaignType, acosValue))
    setAcos(acosValue)
  }

  const handleDailyBudgetBtn = (campaignId) => {
    setDailyBudgetCampaignId(campaignId)
  }

  const handleCancelDailyBudget = () => {
    setDailyBudgetCampaignId('')
  }

  const handleSaveDailyBudget = (campaign) => {
    const newDailyBudget = parseFloat(dailyBudgetRef.current.value, 10)
    if (!newDailyBudget) {
      return
    }
    const newBudget = newDailyBudget
    if (isNaN(newBudget) || newBudget < 1) {
      toast.show({
        title: 'Warning',
        description: 'Minimum value is $1. Please enter a higher number.',
      })
      return
    }
    dispatch(updateCampaignsDailyBudget(campaign.campaignid, campaign.campaignType, newBudget))
    setDailyBudget(newBudget)
  }

  const handleSelect = (checked, data) => {
    if (checked) {
      setSelectedCampaigns(prevState => [...prevState, data])
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(item => item.campaignid !== data['campaignid']))
    }
  }

  const handleUpdateStateBulk = (state) => {
    const campaignsChanged = selectedCampaigns
      .filter(campaign => campaign.state !== 'archived')
      .map(campaign => ({
        campaignId: campaign.campaignid,
        campaignType: campaign.campaignType,
      }))

    dispatch(updateCampaignsState(campaignsChanged, state))
    setChangeCampaignState(true)
    setSelectedCampaigns([])
  }

  const handleClickHistory = (chartData, field, campaign, metric, direct=false) => {
    if (!isShowHistory) {
      return
    }
    const data = chartData && chartData.length > 0 ? chartData.map(item => ({
      date: item.startdate,
      value: item[field] ? item[field] : 0,
    }))
    : []
    setHistoryModalCampaign(campaign)
    setHistoryModalMetric(metric)
    setHistoryModalData(data)
    setShowHistoryModal(true)
    setHistorySortAsc(direct)
  }

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }

    function handleClick(e) {
      if (acosRef && acosRef.current && !acosRef.current.contains(e.target)) {
        setAcosCampaignId('')
      }
      if (dailyBudgetRef && dailyBudgetRef.current && !dailyBudgetRef.current.contains(e.target)) {
        setDailyBudgetCampaignId('')
      }
    }
  }, [])

  const loadCampaigns = () => {
    dispatch(
      getCampaignsWithHistory({
        startDate: moment(startDate).format('YYYY-MM-DD'),
        endDate: moment(endDate).format('YYYY-MM-DD'),
      })
    )
  }

  const sortColumn = (field) => {
    dispatch(sortCampaignData(field))
  }

  const filteredCampaigns = (campaignsWithHistory || []).filter((data) => {
    if (!data['campaign'].toLowerCase().includes(searchKey.toLowerCase())) {
      return false
    }

    if (campaignFilters.adType
      && campaignFilters.adType.value !== 'all'
      && !data['campaignType'].toLowerCase().includes(campaignFilters.adType.label.toLowerCase())) {
      return false
    }

    if (campaignFilters.campaignType
      && campaignFilters.campaignType.value !== 'all'
      && data.targeting_type !== campaignFilters.campaignType.value) {
      return false
    }

    if (campaignFilters.campaignStatus
      && campaignFilters.campaignStatus.value !== 'all'
      && !campaignFilters.campaignStatus.value.toLowerCase().includes(data['state'].toLowerCase())) {
      return false
    }

    if (campaignFilters.targetAcosMin
      && data['target_acos'] * 1 < campaignFilters.targetAcosMin * 1) {
      return false
    }

    if (campaignFilters.targetAcosMax
      && data['target_acos'] * 1 > campaignFilters.targetAcosMax * 1) {
      return false
    }

    if (campaignFilters.budgetMin
      && data['daily_budget'] * 1 < campaignFilters.budgetMin * 1) {
      return false
    }

    if (campaignFilters.budgetMax
      && data['daily_budget'] * 1 > campaignFilters.budgetMax * 1) {
      return false
    }

    if (campaignFilters.ordersMin
      && data['orders'] * 1 < campaignFilters.ordersMin * 1) {
      return false
    }

    if (campaignFilters.ordersMax
      && data['orders'] * 1 > campaignFilters.ordersMax * 1) {
      return false
    }

    if (campaignFilters.spendMin
      && data['cost'] * 1 < campaignFilters.spendMin * 1) {
      return false
    }

    if (campaignFilters.spendMax
      && data['cost'] * 1 > campaignFilters.spendMax * 1) {
      return false
    }

    if (campaignFilters.impressionMin
      && data['impressions'] * 1 < campaignFilters.impressionMin * 1) {
      return false
    }

    if (campaignFilters.impressionMax
      && data['impressions'] * 1 > campaignFilters.impressionMax * 1) {
      return false
    }

    if (campaignFilters.clicksMin
      && data['clicks'] * 1 < campaignFilters.clicksMin * 1) {
      return false
    }

    if (campaignFilters.clicksMax
      && data['clicks'] * 1 < campaignFilters.clicksMax * 1) {
      return false
    }

    return true
  })

  filteredCampaigns.sort((a, b) => {
    if (sortDirection) {
      return b[sortColumnName] - a[sortColumnName]
    } else {
      return a[sortColumnName] - b[sortColumnName]
    }
  })

  const campaignElements = filteredCampaigns.slice(pageStartNum, pageEndNum + 1).map((data) => {
    total.revenue += data['revenue'] * 1
    total.spend += data['cost'] * 1
    total.imp += data['impressions'] * 1
    total.clicks += data['clicks'] * 1
    total.ctr += (data['clicks'] / data['impressions']) * 1
    total.cpc += (data['cost'] / data['clicks']) * 1
    total.orders += data['orders'] * 1
    total.acos += parseFloat(data.acos || 0)
    total.roas += parseFloat(data.roas || 0)
    total.ntbOrders += data['ntb_orders'] * 1
    total.ntbSales += data['ntb_sales'] * 1
    total.ntbUnits += data['ntb_units'] * 1

    return (
      <TableRow
        key={data.campaignid}
        campaign={data}
        columns={columns}
        selectedCampaigns={selectedCampaigns}
        campaignTableColumns={campaignTableColumns}
        acosCampaignId={acosCampaignId}
        acosRef={acosRef}
        dailyBudgetCampaignId={dailyBudgetCampaignId}
        dailyBudgetRef={dailyBudgetRef}
        isShowHistory={isShowHistory}
        currencySign={currencySign}
        currencyRate={currencyRate}
        onSelect={handleSelect}
        onOpenAcosPopup={handleAcosBtn}
        onSaveAcos={handleSaveAcos}
        onCancelAcos={handleCancelAcos}
        onOpenDailyBudgetPopup={handleDailyBudgetBtn}
        onSaveDailyBudget={handleSaveDailyBudget}
        onCancelDailyBudget={handleCancelDailyBudget}
        onClickHistory={handleClickHistory}
        startDate={startDate}
        endDate={endDate}
      />
    )
  })

  const isDataLoading = isLoading
    || isUpdateCampaignAcos
    || isUpdateCampaignDailyBudget
    || isUpdateCampaignState
    || isAddCampaignToExistingPortfolio
    || isTurningBulk

  return (
    <div className={`campaign-table-component${isDataLoading ? ' loading' : ''}`}>
      { isDataLoading && <LoaderComponent /> }
      { showColumnEditor && <EditTableColumnComponent columns={columns} /> }
      { showTableFilter && <EditTableFilterComponent /> }
      { showAPM && <APMComponent /> }
      { showANP && <AddCampaignsToNewPortfolio campaigns={selectedCampaigns} /> }
      { showAEP && <AddCampaignsToExistingPortfolio campaigns={selectedCampaigns} /> }
      <ActionBar
        searchKey={searchKey}
        selectedCampaigns={selectedCampaigns}
        dateRange={[startDate, endDate]}
        onChangeSearch={setSearchKey}
        onDeselect={() => { setSelectedCampaigns([]) }}
        onUpdateState={handleUpdateStateBulk}
        onShowTableHistory={onShowTableHistory}
      />
      <div className="table-body">
        <TableHeader
          columns={columns}
          campaignTableColumns={campaignTableColumns}
          selectedCampaigns={selectedCampaigns}
          filteredCampaigns={filteredCampaigns}
          onSelect={setSelectedCampaigns}
          onSort={sortColumn}
        />
        <TableFooter
          columns={columns}
          campaignTableColumns={campaignTableColumns}
          total={total}
          campaignCount={filteredCampaigns.slice(pageStartNum, pageEndNum + 1).length}
          currencySign={currencySign}
          currencyRate={currencyRate}
        />
        {campaignElements}
      </div>
      <PaginationComponent
        total={filteredCampaigns.length}
        loadData={loadPageCampaigns}
      />
      <CampaignThumbHistory
        areaData={historyModalData}
        campaign={historyModalCampaign}
        metric={historyModalMetric}
        show={showHistoryModal}
        direct={historySortAsc}
        onClose={handleCloseHistoryModal}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}

export default CampaignTableComponent
