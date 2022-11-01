import React, { useState } from 'react'
import { useStore } from 'react-redux'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CSVLink } from 'react-csv'

import moment from 'moment'
import { Modal } from 'rsuite'
import MainLayout from '../../layout/MainLayout'

import CheckboxComponent from '../../components/CommonComponents/CheckboxComponent'
import AccountHealthComponent from '../../components/AccountHealthComponent'
import PdfComponent from '../../components/AccountHealthComponent/pdf'

import { formatValue, formatCurrency } from '../../services/helper'

const AccountHealthPage = () => {
  const store = useStore().getState()
  const { health, header } = store
  const { currencySign, currencyRate } = header
  const { summaryData, matchTypes, placementData, startDate } = health
  const { auto, legacy, manual } = placementData
  const { totalRevenue, totalRevenueForPrevMonth, totalCampaigns, totalCampaignsForPrevMonth, totalKeywords, totalKeywordsForPrevMonth } = summaryData

  const [showCustomModal, setShowCustomModal] = useState(false)
  const [currentTab, setCurrentTab] = useState('metric')

  const reportMonthName = moment(startDate).format('MMMM')
  const reportYear = moment(startDate).year()

  const kpiForThisMonth = (summaryData && summaryData.kpi) ? summaryData.kpi : {}
  const kpiForPrevMonth = (summaryData && summaryData.kpiForPrevMonth) ? summaryData.kpiForPrevMonth : {}

  kpiForThisMonth['acos'] = kpiForThisMonth.revenue ? kpiForThisMonth.cost / kpiForThisMonth.revenue * 100.0 : 0
  kpiForThisMonth['conv'] = kpiForThisMonth.clicks ? kpiForThisMonth.orders / kpiForThisMonth.clicks * 100.0 : 0
  kpiForThisMonth['ctr'] = kpiForThisMonth.clicks / kpiForThisMonth.impressions * 100.0
  kpiForThisMonth['totalRevenue'] = totalRevenue - kpiForThisMonth['revenue']
  kpiForThisMonth['totalCampaigns'] = totalCampaigns
  kpiForThisMonth['totalKeywords'] = totalKeywords

  kpiForPrevMonth['acos'] = kpiForPrevMonth.revenue ? kpiForPrevMonth.cost / kpiForPrevMonth.revenue * 100.0 : 0
  kpiForPrevMonth['conv'] = kpiForPrevMonth.clicks ? kpiForPrevMonth.orders / kpiForPrevMonth.clicks * 100.0 : 0
  kpiForPrevMonth['ctr'] = kpiForPrevMonth.clicks / kpiForPrevMonth.impressions * 100.0
  kpiForPrevMonth['totalRevenue'] = totalRevenueForPrevMonth - kpiForPrevMonth['revenue']
  kpiForPrevMonth['totalCampaigns'] = totalCampaignsForPrevMonth
  kpiForPrevMonth['totalKeywords'] = totalKeywordsForPrevMonth

  const placementTotal = {}
  const bidTotal = {}

  bidTotal['impressionsAuto'] = auto['impressionsTop'] + auto['impressionsDetail'] + auto['impressionsOther']
  bidTotal['revenueAuto'] = auto['revenueTop'] + auto['revenueDetail'] + auto['revenueOther']
  bidTotal['clicksAuto'] = auto['clicksTop'] + auto['clicksDetail'] + auto['clicksOther']
  bidTotal['ordersAuto'] = auto['ordersTop'] + auto['ordersDetail'] + auto['ordersOther']
  bidTotal['costAuto'] = auto['costTop'] + auto['costDetail'] + auto['costOther']
  bidTotal['ctrAuto'] = bidTotal['impressionsAuto'] ? bidTotal['clicksAuto'] / bidTotal['impressionsAuto'] * 100.0 : 0
  bidTotal['acosAuto'] = bidTotal['revenueAuto'] ? bidTotal['costAuto'] / bidTotal['revenueAuto'] * 100.0 : 0
  bidTotal['convAuto'] = bidTotal['clicksAuto'] ? bidTotal['ordersAuto'] / bidTotal['clicksAuto'] * 100.0 : 0
  bidTotal['cpcAuto'] = bidTotal['clicksAuto'] ? bidTotal['costAuto'] / bidTotal['clicksAuto'] : 0

  bidTotal['impressionsManual'] = manual['impressionsTop'] + manual['impressionsDetail'] + manual['impressionsOther']
  bidTotal['revenueManual'] = manual['revenueTop'] + manual['revenueDetail'] + manual['revenueOther']
  bidTotal['clicksManual'] = manual['clicksTop'] + manual['clicksDetail'] + manual['clicksOther']
  bidTotal['ordersManual'] = manual['ordersTop'] + manual['ordersDetail'] + manual['ordersOther']
  bidTotal['costManual'] = manual['costTop'] + manual['costDetail'] + manual['costOther']
  bidTotal['ctrManual'] = bidTotal['impressionsManual'] ? bidTotal['clicksManual'] / bidTotal['impressionsManual'] * 100.0 : 0
  bidTotal['acosManual'] = bidTotal['revenueManual'] ? bidTotal['costManual'] / bidTotal['revenueManual'] * 100.0 : 0
  bidTotal['convManual'] = bidTotal['clicksManual'] ? bidTotal['ordersManual'] / bidTotal['clicksManual'] * 100.0 : 0
  bidTotal['cpcManual'] = bidTotal['clicksManual'] ? bidTotal['costManual'] / bidTotal['clicksManual'] : 0


  bidTotal['impressionsLegacy'] = legacy['impressionsTop'] + legacy['impressionsDetail'] + legacy['impressionsOther']
  bidTotal['revenueLegacy'] = legacy['revenueTop'] + legacy['revenueDetail'] + legacy['revenueOther']
  bidTotal['clicksLegacy'] = legacy['clicksTop'] + legacy['clicksDetail'] + legacy['clicksOther']
  bidTotal['ordersLegacy'] = legacy['ordersTop'] + legacy['ordersDetail'] + legacy['ordersOther']
  bidTotal['costLegacy'] = legacy['costTop'] + legacy['costDetail'] + legacy['costOther']
  bidTotal['ctrLegacy'] = bidTotal['impressionsLegacy'] ? bidTotal['clicksLegacy'] / bidTotal['impressionsLegacy'] * 100.0 : 0
  bidTotal['acosLegacy'] = bidTotal['revenueLegacy'] ? bidTotal['costLegacy'] / bidTotal['revenueLegacy'] * 100.0 : 0
  bidTotal['convLegacy'] = bidTotal['clicksLegacy'] ? bidTotal['ordersLegacy'] / bidTotal['clicksLegacy'] * 100.0 : 0
  bidTotal['cpcLegacy'] = bidTotal['clicksLegacy'] ? bidTotal['costLegacy'] / bidTotal['clicksLegacy'] : 0

  for (let i in auto) {
    placementTotal[i] = auto[i] + manual[i] + legacy[i]
  }

  placementTotal['ctrTop'] = placementTotal['impressionsTop'] ? placementTotal['clicksTop'] / placementTotal['impressionsTop'] * 100.0 : 0
  placementTotal['acosTop'] = placementTotal['revenueTop'] ? placementTotal['costTop'] / placementTotal['revenueTop'] * 100.0 : 0
  placementTotal['convTop'] = placementTotal['clicksTop'] ? placementTotal['ordersTop'] / placementTotal['clicksTop'] * 100.0 : 0
  placementTotal['cpcTop'] = placementTotal['clicksTop'] ? placementTotal['costTop'] / placementTotal['clicksTop'] : 0

  placementTotal['ctrDetail'] = placementTotal['impressionsDetail'] ? placementTotal['clicksDetail'] / placementTotal['impressionsDetail'] * 100.0 : 0
  placementTotal['acosDetail'] = placementTotal['revenueDetail'] ? placementTotal['costDetail'] / placementTotal['revenueDetail'] * 100.0 : 0
  placementTotal['convDetail'] = placementTotal['clicksDetail'] ? placementTotal['ordersDetail'] / placementTotal['clicksDetail'] * 100.0 : 0
  placementTotal['cpcDetail'] = placementTotal['clicksDetail'] ? placementTotal['costDetail'] / placementTotal['clicksDetail'] : 0

  placementTotal['ctrOther'] = placementTotal['impressionsOther'] ? placementTotal['clicksOther'] / placementTotal['impressionsOther'] * 100.0 : 0
  placementTotal['acosOther'] = placementTotal['revenueOther'] ? placementTotal['costOther'] / placementTotal['revenueOther'] * 100.0 : 0
  placementTotal['convOther'] = placementTotal['clicksOther'] ? placementTotal['ordersOther'] / placementTotal['clicksOther'] * 100.0 : 0
  placementTotal['cpcOther'] = placementTotal['clicksOther'] ? placementTotal['costOther'] / placementTotal['clicksOther'] : 0

  const columns = [
    {value: 'revenue', label: 'PPC Revenue', decimal: 2},
    {value: 'totalRevenue', label: 'Organic Revenue', decimal: 2},
    {value: 'acos', label: 'ACoS', decimal: 2},
    {value: 'cost', label: 'Ad Spend', decimal: 2},
    {value: 'impressions', label: 'Impr.', decimal: 0},
    {value: 'orders', label: 'Orders', decimal: 0},
    {value: 'clicks', label: 'Clicks', decimal: 0},
    {value: 'ctr', label: 'CTR', decimal: 2},
    {value: 'conv', label: 'Conversion', decimal: 2},
    {value: 'totalCampaigns', label: 'Total PPC Campaigns', decimal: 0},
    {value: 'totalKeywords', label: 'Total Keywords', decimal: 0}
  ]
  const performances = [
    {value: 'placement', label: 'Placement'},
    {value: 'bid-type', label: 'Bid Type'},
    {value: 'match-type', label: 'Match Type'}
  ]
  const reports = [
    {value: 'auto-campaign', label: 'Auto Campaigns'},
    {value: 'manual-campaign', label: 'Manual Campaigns'},
    {value: 'campaign-product-target', label: 'Campaigns with Product Targeting'},
    {value: 'sponsored-brand-campaign', label: 'Sponsored Brand Campaigns'},
    {value: 'sponsored-brand-ad', label: 'Sponsored Display Ads'},
  ]

  const tabs = [
    {value: 'metric', label: 'Main Metrics'},
    {value: 'performance', label: 'Performance By'},
    {value: 'report', label: 'Campaign Reports'}
  ]
  const defaultCheckedColumns = columns.map(data => data.value)
  const defaultCheckedPerformances = performances.map(data => data.value)
  const defaultCheckedReports = reports.map(data => data.value)

  const [checkedColumns, setCheckedColumns] = useState(defaultCheckedColumns)
  const [checkedPerformances, setCheckedPerformances] = useState(defaultCheckedPerformances)
  const [checkedReports, setCheckedReports] = useState(defaultCheckedReports)
  const csvData = [['Metric', 'This Month', 'Pre Month']]

  columns.forEach(data => {
    if (checkedColumns.includes(data.value)) {
      csvData.push(
        [data.label, formatValue(kpiForThisMonth[data.value], 'number', data.decimal), formatValue(kpiForPrevMonth[data.value], 'number', data.decimal)]
      )
    }
  })

  if (checkedPerformances.includes('placement')) {
    csvData.push([])
    csvData.push(['Performance by Placement'])
    csvData.push([
      'Placement',
      'Impressions',
      'Clicks',
      'CTR',
      'CPC',
      'Orders',
      'Sales',
      'ACoS',
      'Conversion'
    ])
    csvData.push([
      'Top of search(first page)',
      formatValue(placementTotal['impressionsTop'], 'number', 0),
      formatValue(placementTotal['clicksTop'], 'number', 0),
      formatValue(placementTotal['ctrTop'], 'percent'),
      formatCurrency(placementTotal['cpcTop'], currencySign, currencyRate),
      formatValue(placementTotal['ordersTop'], 'number', 0),
      formatCurrency(placementTotal['revenueTop'], currencySign, currencyRate),
      formatValue(placementTotal['acosTop'], 'percent'),
      formatValue(placementTotal['convTop'], 'percent')
    ])
    csvData.push([
      'Product Pages',
      formatValue(placementTotal['impressionsDetail'], 'number', 0),
      formatValue(placementTotal['clicksclicksDetail'], 'number', 0),
      formatValue(placementTotal['ctrclicksDetail'], 'percent'),
      formatCurrency(placementTotal['cpcclicksDetail'], currencySign, currencyRate),
      formatValue(placementTotal['ordersclicksDetail'], 'number', 0),
      formatCurrency(placementTotal['revenueclicksDetail'], currencySign, currencyRate),
      formatValue(placementTotal['acosclicksDetail'], 'percent'),
      formatValue(placementTotal['convclicksDetail'], 'percent')
    ])
    csvData.push([
      'Reset of search',
      formatValue(placementTotal['impressionsOther'], 'number', 0),
      formatValue(placementTotal['clicksOther'], 'number', 0),
      formatValue(placementTotal['ctrOther'], 'percent'),
      formatCurrency(placementTotal['cpcOther'], currencySign, currencyRate),
      formatValue(placementTotal['ordersOther'], 'number', 0),
      formatCurrency(placementTotal['revenueOther'], currencySign, currencyRate),
      formatValue(placementTotal['acosOther'], 'percent'),
      formatValue(placementTotal['convOther'], 'percent')
    ])
  }
  if (checkedPerformances.includes('bid-type')) {
    csvData.push([])
    csvData.push(['Performance by Bid Type'])
    csvData.push([
      'Bid Type',
      'Impressions',
      'Clicks',
      'CTR',
      'CPC',
      'Orders',
      'Sales',
      'ACoS',
      'Conversion'
    ])
    csvData.push([
      'Dynamic bids - down only',
      formatValue(bidTotal['impressionsLegacy'], 'number', 0),
      formatValue(bidTotal['clicksLegacy'], 'number', 0),
      formatValue(bidTotal['ctrLegacy'], 'percent'),
      formatCurrency(bidTotal['cpcLegacy'], currencySign, currencyRate),
      formatValue(bidTotal['ordersLegacy'], 'number', 0),
      formatCurrency(bidTotal['revenueLegacy'], currencySign, currencyRate),
      formatValue(bidTotal['acosLegacy'], 'percent'),
      formatValue(bidTotal['convLegacy'], 'percent')
    ])
    csvData.push([
      'Dynamic bids - up and down',
      formatValue(bidTotal['impressionsAuto'], 'number', 0),
      formatValue(bidTotal['clicksclicksAuto'], 'number', 0),
      formatValue(bidTotal['ctrclicksAuto'], 'percent'),
      formatCurrency(bidTotal['cpcclicksAuto'], currencySign, currencyRate),
      formatValue(bidTotal['ordersclicksAuto'], 'number', 0),
      formatCurrency(bidTotal['revenueclicksAuto'], currencySign, currencyRate),
      formatValue(bidTotal['acosclicksAuto'], 'percent'),
      formatValue(bidTotal['convclicksAuto'], 'percent')
    ])
    csvData.push([
      'Fixed Bid',
      formatValue(bidTotal['impressionsManual'], 'number', 0),
      formatValue(bidTotal['clicksManual'], 'number', 0),
      formatValue(bidTotal['ctrManual'], 'percent'),
      formatCurrency(bidTotal['cpcManual'], currencySign, currencyRate),
      formatValue(bidTotal['ordersManual'], 'number', 0),
      formatCurrency(bidTotal['revenueManual'], currencySign, currencyRate),
      formatValue(bidTotal['acosManual'], 'percent'),
      formatValue(bidTotal['convManual'], 'percent')
    ])
  }
  if (checkedPerformances.includes('match-type')) {
    csvData.push([])
    csvData.push(['Performance by Match Type'])
    csvData.push([
      'Match Type',
      'Impressions',
      'Clicks',
      'CTR',
      'CPC',
      'Orders',
      'Sales',
      'ACoS',
      'Conversion'
    ])
  }
  if (checkedReports.includes('auto-campaigns')) {
    csvData.push([])
    csvData.push(['Auto Campaigns'])
    csvData.push([
      'Campaigns',
      'Target ACoS',
      'Actual ACoS',
      'ACoS change from last month',
      'Revenue',
      'Revenue from last month',
      'Impressions',
      'Impressions from last month',
      'Clicks',
      'Clicks from last month',
      'CTR',
      'CTR from last month',
      'Conversion',
      'Conversion from last month'
    ])
  }
  if (checkedReports.includes('manual-campaigns')) {
    csvData.push([])
    csvData.push(['Manual Campaigns'])
    csvData.push([
      'Campaigns',
      'Target ACoS',
      'Actual ACoS',
      'ACoS change from last month',
      'Revenue',
      'Revenue from last month',
      'Impressions',
      'Impressions from last month',
      'Clicks',
      'Clicks from last month',
      'CTR',
      'CTR from last month',
      'Conversion',
      'Conversion from last month'
    ])
  }
  if (checkedReports.includes('campaign-product-target')) {
    csvData.push([])
    csvData.push(['Campaign with Product Targeting'])
    csvData.push([
      'Campaigns',
      'Target ACoS',
      'Actual ACoS',
      'ACoS change from last month',
      'Revenue',
      'Revenue from last month',
      'Impressions',
      'Impressions from last month',
      'Clicks',
      'Clicks from last month',
      'CTR',
      'CTR from last month',
      'Conversion',
      'Conversion from last month'
    ])
  }
  if (checkedReports.includes('sponsored-brand-campaign')) {
    csvData.push([])
    csvData.push(['Sponsored Brand Campaigns'])
    csvData.push([
      'Campaigns',
      'Target ACoS',
      'Actual ACoS',
      'ACoS change from last month',
      'Revenue',
      'Revenue from last month',
      'Impressions',
      'Impressions from last month',
      'Clicks',
      'Clicks from last month',
      'CTR',
      'CTR from last month',
      'Conversion',
      'Conversion from last month'
    ])
  }
  if (checkedReports.includes('sponsored-brand-ad')) {
    csvData.push([])
    csvData.push(['Sponsored Display Ads'])
    csvData.push([
      'Campaigns',
      'Target ACoS',
      'Actual ACoS',
      'ACoS change from last month',
      'Revenue',
      'Revenue from last month',
      'Impressions',
      'Impressions from last month',
      'Clicks',
      'Clicks from last month',
      'CTR',
      'CTR from last month',
      'Conversion',
      'Conversion from last month'
    ])
  }

  const onCustomReport = () => {
    setShowCustomModal(true)
  }
  const onApplyCustomReport = () => {
    setShowCustomModal(false)
  }
  const onCancelCustomReport = () => {
    setCheckedColumns(defaultCheckedColumns)
    setCheckedPerformances(defaultCheckedPerformances)
    setCheckedReports(defaultCheckedReports)
    setShowCustomModal(false)
  }
  const onClickTab = (tab) => {
    setCurrentTab(tab)
  }
  const onCheckColumns = (data, value) => {
    let cols = JSON.parse(JSON.stringify(checkedColumns))
    if (data) {
      cols.push(value)
    } else {
      cols = cols.filter(e => e !== value)
    }
    setCheckedColumns(cols)
  }
  const onCheckPerformances = (data, value) => {
    let cols = JSON.parse(JSON.stringify(checkedPerformances))
    if (data) {
      cols.push(value)
    } else {
      cols = cols.filter(e => e !== value)
    }
    setCheckedPerformances(cols)
  }
  const onCheckReports = (data, value) => {
    let cols = JSON.parse(JSON.stringify(checkedReports))
    if (data) {
      cols.push(value)
    } else {
      cols = cols.filter(e => e !== value)
    }
    setCheckedReports(cols)
  }

  return (
    <MainLayout>
      <div className="account-health-page">
        <Modal show={showCustomModal}>
          <Modal.Body className="modal-body">
            <div className="body-tabs">
              {
                tabs.map(data => (
                  <span key={data.value} className={data.value === currentTab && 'selected'} onClick={()=>onClickTab(data.value)}>{data.label}</span>
                ))
              }
            </div>
            <div className="body-columns">
              <div className="body-header">Available metrics</div>
              {currentTab === 'metric' &&
                columns.map(data => (
                  <div className="metric-row" key={data.value}>
                    <CheckboxComponent
                      checked={checkedColumns.includes(data.value)}
                      onChange={(value)=>onCheckColumns(value, data.value)}
                    />
                    <span>{data.label}</span>
                  </div>
                ))
              }
              {currentTab === 'performance' &&
                performances.map(data=> (
                  <div className="metric-row" key={data.value}>
                    <CheckboxComponent
                      checked={checkedPerformances.includes(data.value)}
                      onChange={(value)=>onCheckPerformances(value, data.value)}
                    />
                    <span>{data.label}</span>
                  </div>
                ))
              }
              {currentTab === 'report' &&
                reports.map(data=> (
                  <div className="metric-row" key={data.value}>
                    <CheckboxComponent
                      checked={checkedReports.includes(data.value)}
                      onChange={(value)=>onCheckReports(value, data.value)}
                    />
                    <span>{data.label}</span>
                  </div>
                ))
              }
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="rs-btn rs-btn-primary" onClick={onApplyCustomReport}>
              Apply
            </button>
            <button type="button" className="rs-btn rs-btn-subtle" onClick={onCancelCustomReport}>
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
        <div className="page-header">
          <div className="page-title">Account Health</div>
          <div className="page-header__buttons">
            <div className="page-header__button-new" onClick={onCustomReport}>Customize Report</div>
            <PDFDownloadLink
              fileName={`Account Summary (${reportMonthName}, ${reportYear}).pdf`}
              document={
                <PdfComponent
                  columns={columns}
                  kpiForThisMonth={kpiForThisMonth}
                  kpiForPrevMonth={kpiForPrevMonth}
                  placementTotal={placementTotal}
                  bidTotal={bidTotal}
                  currencyRate={currencyRate}
                  currencySign={currencySign}
                  matchTypes={matchTypes}
                  reportMonthName={reportMonthName}
                  reportYear={reportYear}
                  checkedColumns={checkedColumns}
                  checkedPerformances={checkedPerformances}
                  checkedReports={checkedReports}
                />
              }
            >
              <div className="page-header__button-new">PDF</div>
            </PDFDownloadLink>
            <CSVLink data={csvData}>
              <div className="page-header__button-new">CSV</div>
            </CSVLink>
          </div>
        </div>
        <div className="page-content">
          <AccountHealthComponent />
        </div>
      </div>
    </MainLayout>
  );
}

export default AccountHealthPage
