import React from 'react'
import { useStore } from 'react-redux'
import moment from 'moment'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const MetricsComponent = () => {
  const store = useStore().getState()
  const { header, health } = store

  const {
    currencySign,
    currencyRate
  } = header

  const { summaryData } = health

  const { totalRevenue, totalRevenueForPrevMonth, totalCampaigns, totalCampaignsForPrevMonth, totalKeywords, totalKeywordsForPrevMonth } = summaryData
  const kpiForThisMonth = (summaryData && summaryData.kpi) ? summaryData.kpi : {}
  const kpiForPrevMonth = (summaryData && summaryData.kpiForPrevMonth) ? summaryData.kpiForPrevMonth : {}
  const chart = (summaryData && summaryData.chart) ? summaryData.chart : []
  const chartTotalOrganicRevenue = (summaryData && summaryData.chartTotalOrganicRevenue) ? summaryData.chartTotalOrganicRevenue : []
  const chartTotalCampaigns = (summaryData && summaryData.chartTotalCampaigns) ? summaryData.chartTotalCampaigns : []
  const chartTotalKeywords = (summaryData && summaryData.chartTotalKeywords) ? summaryData.chartTotalKeywords : []

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

  const changesFromLastMonth = {}

  for (let i in kpiForThisMonth) {
    changesFromLastMonth[i] = formatValue(100 - kpiForThisMonth[i] / kpiForPrevMonth[i] * 100, 'percent')
  }

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

  let chartData = {
    revenue: [],
    totalRevenue: [],
    acos: [],
    cost: [],
    impressions: [],
    orders: [],
    clicks: [],
    ctr: [],
    conv: [],
    totalCampaigns: [],
    totalKeywords: []
  }

  for (let i in chart) {
    chartData.revenue.push({ 'PPC Revenue': chart[i].revenue*1, 'date': chart[i].startdate})
    chartData.acos.push({ 'ACoS': chart[i].revenue ? chart[i].cost/chart[i].revenue*100 : 0, 'date': chart[i].startdate})
    chartData.cost.push({ 'Ad Spend': chart[i].cost*1, 'date': chart[i].startdate})
    chartData.impressions.push({ 'Impr.': chart[i].impressions*1, 'date': chart[i].startdate})
    chartData.orders.push({ 'Orders': chart[i].orders*1, 'date': chart[i].startdate})
    chartData.clicks.push({ 'Clicks': chart[i].clicks*1, 'date': chart[i].startdate})
    chartData.ctr.push({ 'CTR': chart[i].impressions ? chart[i].clicks/chart[i].impressions*100 : 0, 'date': chart[i].startdate})
    chartData.conv.push({ 'Conversion': chart[i].clicks ? chart[i].orders/chart[i].clicks*100 : 0, 'date': chart[i].startdate})
  }
  for (let i in chartTotalOrganicRevenue) {
    chartData.totalRevenue.push({'Organic Revenue': chartTotalOrganicRevenue[i].organic_revenue*1-(chartTotalOrganicRevenue[i].revenue*1 || 0), 'date': chartTotalOrganicRevenue[i].startdate})
  }
  for (let i in chartTotalCampaigns) {
    chartData.totalCampaigns.push({'Total PPC Campaigns': chartTotalCampaigns[i].totalcampaigns*1, 'date': chartTotalCampaigns[i].startdate})
  }
  for (let i in chartTotalKeywords) {
    chartData.totalKeywords.push({'Total Keywords': chartTotalKeywords[i].totalkeywords*1, 'date': chartTotalKeywords[i].startdate})
  }

  const headerElements = columns.map(data => (<div className="table-col" key={data.value}>{data.label}</div>))
  const chartElements = columns.map(data => {
    return (
      <div className="chart-row" key={data.value}>
        <div className="chart-col">{data.label}</div>
        <div className="chart-col">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={300} height={300} data={chartData[data.value]}>
              <XAxis dataKey="date" tickFormatter={d => moment(d).format('MM-DD')} />
              <YAxis dataKey={data.label} />
              <Tooltip formatter={(value) => formatValue(value, 'number', data.decimal)} labelFormatter={d => moment(d).format('YYYY/MM/DD')} />
              <Line type="monotone" dataKey={data.label} strokeWidth={2} activeDot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  })
  return (
    <div className="account-health-metrics">
      <div className="table-header">
        <div className="table-row">
          <div className="table-col"></div>
          {headerElements}
        </div>
      </div>
      <div className="table-body">
        <div className="table-row">
          <div className="table-col">Change from previous month</div>
          <div className="table-col">{changesFromLastMonth['revenue']}</div>
          <div className="table-col">{changesFromLastMonth['totalRevenue']}</div>
          <div className="table-col">{changesFromLastMonth['acos']}</div>
          <div className="table-col">{changesFromLastMonth['cost']}</div>
          <div className="table-col">{changesFromLastMonth['impressions']}</div>
          <div className="table-col">{changesFromLastMonth['orders']}</div>
          <div className="table-col">{changesFromLastMonth['clicks']}</div>
          <div className="table-col">{changesFromLastMonth['ctr']}</div>
          <div className="table-col">{changesFromLastMonth['conv']}</div>
          <div className="table-col">{changesFromLastMonth['totalCampaigns']}</div>
          <div className="table-col">{changesFromLastMonth['totalKeywords']}</div>
        </div>
      </div>
      <div className="table-footer">
        <div className="table-row">
          <div className="table-col">Total for month selected</div>
          <div className="table-col">{formatCurrency(kpiForThisMonth['revenue'], currencySign, currencyRate)}</div>
          <div className="table-col">{formatCurrency(kpiForThisMonth['totalRevenue'], currencySign, currencyRate)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['acos'], 'percent', 2)}</div>
          <div className="table-col">{formatCurrency(kpiForThisMonth['cost'], currencySign, currencyRate)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['impressions'], 'number', 0)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['orders'], 'number', 0)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['clicks'], 'number', 0)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['ctr'], 'percent', 2)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['conv'], 'percent', 2)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['totalCampaigns'], 'number', 0)}</div>
          <div className="table-col">{formatValue(kpiForThisMonth['totalKeywords'], 'number', 0)}</div>
        </div>
      </div>
      <div className="metric-chart">
        {chartElements}
      </div>
    </div>
  );
}

export default MetricsComponent
