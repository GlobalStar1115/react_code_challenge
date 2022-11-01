import React from 'react'
import { Page, Text, View, Document } from '@react-pdf/renderer';

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const PdfComponent = ({
  kpiForThisMonth,
  kpiForPrevMonth,
  placementTotal,
  bidTotal,
  matchTypes,
  currencyRate,
  currencySign,
  reportMonthName,
  reportYear,
  columns,
  checkedColumns,
  checkedPerformances,
  checkedReports
}) => {
  const kpiElements = []
  kpiElements.push(
    <View key='header' style={{flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderStyle: 'solid'}}>
      <Text style={{minWidth: '33%'}}>Metric</Text>
      <Text style={{minWidth: '33%'}}>This Month</Text>
      <Text style={{minWidth: '33%'}}>Prev Month</Text>
    </View>
  )
  columns.forEach(data => {
    if (checkedColumns.includes(data.value)) {
      kpiElements.push(
        <View key={data.value} style={{flexDirection: 'row', width: '100%', borderBottomWidth: 1, borderStyle: 'solid'}}>
          <Text style={{minWidth: '33%'}}>{data.label}</Text>
          <Text style={{minWidth: '33%'}}>{formatValue(kpiForThisMonth[data.value], 'number', data.decimal)}</Text>
          <Text style={{minWidth: '33%'}}>{formatValue(kpiForPrevMonth[data.value], 'number', data.decimal)}</Text>
        </View>
      )
    }
  })
  const matchTypeElements = matchTypes.map((data) => {
    const ctr = data.impressions ? data.clicks / data.impressions * 100.0 : 0
    const acos = data.revenue ? data.cost / data.revenue * 100.0 : 0
    const conv = data.clicks ? data.orders / data.clicks * 100.0 : 0
    const cpc = data.clicks ? data.cost / data.clicks : 0

    return (
      <View style={{flexDirection: 'row'}} key={data['match_type']}>
        <Text style={{width: '17%', padding: '1px'}}>{data['match_type']}</Text>
        <Text style={{width: '14%', padding: '1px'}}>{formatValue(data['impressions'], 'number', 0)}</Text>
        <Text style={{width: '10%', padding: '1px'}}>{formatValue(data['clicks'], 'number', 0)}</Text>
        <Text style={{width: '9%', padding: '1px'}}>{formatValue(ctr, 'percent')}</Text>
        <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(cpc, currencySign, currencyRate)}</Text>
        <Text style={{width: '9%', padding: '1px'}}>{formatValue(data['orders'], 'number', 0)}</Text>
        <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(data['revenue'], currencySign, currencyRate)}</Text>
        <Text style={{width: '9%', padding: '1px'}}>{formatValue(acos, 'percent')}</Text>
        <Text style={{width: '12%', padding: '1px'}}>{formatValue(conv, 'percent')}</Text>
      </View>
    )
  })

  return (
    <Document>
      <Page size="A4" style={{padding: '30px', fontSize: '12px'}}>
        <View style={{marginBottom: '20px'}}>
          <Text style={{fontSize: '16px', marginBottom: '10px'}}>{`Account Summary(${reportMonthName}, ${reportYear})`}</Text>
          <Text>Data Represents Sponsored Product Ads and Sponsored Display Ads. We will be adding Sponsored Brand Ads Soon!</Text>
        </View>
        <View>
          { kpiElements }
        </View>
        {
          checkedPerformances.includes('placement') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Performance By Placement</Text>
              <View style={{flexDirection: 'row', borderBottomWidth: 1}}>
                <Text style={{width: '17%', padding: '1px'}}>Placement</Text>
                <Text style={{width: '14%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '10%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '9%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '9%', padding: '1px'}}>CPC</Text>
                <Text style={{width: '9%', padding: '1px'}}>Orders</Text>
                <Text style={{width: '10%', padding: '1px'}}>Sales</Text>
                <Text style={{width: '9%', padding: '1px'}}>ACoS</Text>
                <Text style={{width: '12%', padding: '1px'}}>Conversion</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Top of search(first page)</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(placementTotal['impressionsTop'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(placementTotal['clicksTop'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ctrTop'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(placementTotal['cpcTop'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ordersTop'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(placementTotal['revenueTop'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['acosTop'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(placementTotal['convTop'], 'percent')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Product pages</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(placementTotal['impressionsDetail'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(placementTotal['clicksDetail'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ctrDetail'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(placementTotal['cpcDetail'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ordersDetail'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(placementTotal['revenueDetail'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['acosDetail'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(placementTotal['convDetail'], 'percent')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Reset of search</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(placementTotal['impressionsOther'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(placementTotal['clicksOther'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ctrOther'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(placementTotal['cpcOther'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['ordersOther'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(placementTotal['revenueOther'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(placementTotal['acosOther'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(placementTotal['convOther'], 'percent')}</Text>
              </View>
            </View>
          )
        }
        {
          checkedPerformances.includes('bid-type') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Performance By Bid Type</Text>
              <View style={{flexDirection: 'row', borderBottomWidth: 1}}>
                <Text style={{width: '17%', padding: '1px'}}>Bid Type</Text>
                <Text style={{width: '14%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '10%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '9%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '9%', padding: '1px'}}>CPC</Text>
                <Text style={{width: '9%', padding: '1px'}}>Orders</Text>
                <Text style={{width: '10%', padding: '1px'}}>Sales</Text>
                <Text style={{width: '9%', padding: '1px'}}>ACoS</Text>
                <Text style={{width: '12%', padding: '1px'}}>Conversion</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Dynamic bids - down only</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(bidTotal['impressionsLegacy'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(bidTotal['clicksLegacy'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ctrLegacy'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(bidTotal['cpcLegacy'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ordersLegacy'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(bidTotal['revenueLegacy'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['acosLegacy'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(bidTotal['convLegacy'], 'percent')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Dynamic bids - up and down</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(bidTotal['impressionsAuto'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(bidTotal['clicksAuto'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ctrAuto'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(bidTotal['cpcAuto'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ordersAuto'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(bidTotal['revenueAuto'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['acosAuto'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(bidTotal['convAuto'], 'percent')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={{width: '17%', padding: '1px'}}>Fixed Bid</Text>
                <Text style={{width: '14%', padding: '1px'}}>{formatValue(bidTotal['impressionsManual'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatValue(bidTotal['clicksManual'], 'number', 0)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ctrManual'], 'percent')}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatCurrency(bidTotal['cpcManual'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['ordersManual'], 'number', 0)}</Text>
                <Text style={{width: '10%', padding: '1px'}}>{formatCurrency(bidTotal['revenueManual'], currencySign, currencyRate)}</Text>
                <Text style={{width: '9%', padding: '1px'}}>{formatValue(bidTotal['acosManual'], 'percent')}</Text>
                <Text style={{width: '12%', padding: '1px'}}>{formatValue(bidTotal['convManual'], 'percent')}</Text>
              </View>
            </View>
          )
        }
        {
          checkedPerformances.includes('match-type') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Performance By Match Type</Text>
              <View style={{flexDirection: 'row', borderBottomWidth: 1}}>
                <Text style={{width: '17%', padding: '1px'}}>Match Type</Text>
                <Text style={{width: '14%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '10%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '9%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '9%', padding: '1px'}}>CPC</Text>
                <Text style={{width: '9%', padding: '1px'}}>Orders</Text>
                <Text style={{width: '10%', padding: '1px'}}>Sales</Text>
                <Text style={{width: '9%', padding: '1px'}}>ACoS</Text>
                <Text style={{width: '12%', padding: '1px'}}>Conversion</Text>
              </View>
              { matchTypeElements }
            </View>
          )
        }
        {
          checkedReports.includes('auto-campaign') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Auto Campaigns</Text>
              <View style={{flexDirection: 'row', fontSize: '8px', borderBottomWidth: 1}}>
                <Text style={{width: '10%', padding: '1px'}}>Campaign</Text>
                <Text style={{width: '7%', padding: '1px'}}>Target ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>Actual ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>ACoS change from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions from last month</Text>
                <Text style={{width: '6%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '7%', padding: '1px'}}>Clicks from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion from last month</Text>
              </View>
            </View>
          )
        }
        {
          checkedReports.includes('manual-campaign') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Manual Campaigns</Text>
              <View style={{flexDirection: 'row', fontSize: '8px', borderBottomWidth: 1}}>
                <Text style={{width: '10%', padding: '1px'}}>Campaign</Text>
                <Text style={{width: '7%', padding: '1px'}}>Target ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>Actual ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>ACoS change from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions from last month</Text>
                <Text style={{width: '6%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '7%', padding: '1px'}}>Clicks from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion from last month</Text>
              </View>
            </View>
          )
        }
        {
          checkedReports.includes('campaign-product-target') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Campaign with Product Targeting</Text>
              <View style={{flexDirection: 'row', fontSize: '8px', borderBottomWidth: 1}}>
                <Text style={{width: '10%', padding: '1px'}}>Campaign</Text>
                <Text style={{width: '7%', padding: '1px'}}>Target ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>Actual ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>ACoS change from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions from last month</Text>
                <Text style={{width: '6%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '7%', padding: '1px'}}>Clicks from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion from last month</Text>
              </View>
            </View>
          )
        }
        {
          checkedReports.includes('sponsored-brand-campaign') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Sponsored Brand Campaigns</Text>
              <View style={{flexDirection: 'row', fontSize: '8px', borderBottomWidth: 1}}>
                <Text style={{width: '10%', padding: '1px'}}>Campaign</Text>
                <Text style={{width: '7%', padding: '1px'}}>Target ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>Actual ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>ACoS change from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions from last month</Text>
                <Text style={{width: '6%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '7%', padding: '1px'}}>Clicks from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion from last month</Text>
              </View>
            </View>
          )
        }
        {
          checkedReports.includes('sponsored-brand-ad') && (
            <View style={{marginTop: '30px'}}>
              <Text style={{marginBottom: '10px', fontSize: '14px'}}>Sponsored Display Ads</Text>
              <View style={{flexDirection: 'row', fontSize: '8px', borderBottomWidth: 1}}>
                <Text style={{width: '10%', padding: '1px'}}>Campaign</Text>
                <Text style={{width: '7%', padding: '1px'}}>Target ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>Actual ACoS</Text>
                <Text style={{width: '7%', padding: '1px'}}>ACoS change from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue</Text>
                <Text style={{width: '7%', padding: '1px'}}>Revenue from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions</Text>
                <Text style={{width: '7%', padding: '1px'}}>Impressions from last month</Text>
                <Text style={{width: '6%', padding: '1px'}}>Clicks</Text>
                <Text style={{width: '7%', padding: '1px'}}>Clicks from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR</Text>
                <Text style={{width: '7%', padding: '1px'}}>CTR from last month</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion</Text>
                <Text style={{width: '7%', padding: '1px'}}>Conversion from last month</Text>
              </View>
            </View>
          )
        }
      </Page>
    </Document>
  );
}

export default PdfComponent
