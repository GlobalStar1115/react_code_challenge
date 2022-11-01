import React from 'react'
import { useStore } from 'react-redux'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const ReportsComponent = () => {
  const store = useStore().getState()
  const { header, health } = store

  const { currencySign, currencyRate } = header
  const { listCampaignData } = health
  const { listCampaigns, listCampaignsPrevMonth } = listCampaignData

  const autoCampaignElements = listCampaigns.map((data) => {
    if (data['targetingtype'] !== 'auto') {
      return null
    }
    const prevMonth = listCampaignsPrevMonth.filter(campaign=>campaign.campaignid === data.campaignid)[0] || []

    return (
      <div className="table-row" key={data.campaignid}>
        <div className="table-col">{data['campaign']}</div>
        <div className="table-col">{formatValue(data['acos1'], 'number', 0)}</div>
        <div className="table-col">{formatValue(data['acos'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['acos'] - data['acos'])/data['acos']*100, 'percent', 2)}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue((prevMonth['revenue'] - data['revenue'])/data['revenue']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['impressions'] - data['impressions'])/data['impressions']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['clicks'] - data['clicks'])/data['clicks']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['ctr']*100, 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['ctr'] - data['ctr'])/data['ctr']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['conversionrate'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['conversionrate'] - data['conversionrate'])/data['conversionrate']*100, 'percent', 0)}</div>
      </div>
    )
  })
  const manualCampaignElements = listCampaigns.map((data) => {
    if (data['targetingtype'] !== 'manual') {
      return null
    }
    const prevMonth = listCampaignsPrevMonth.filter(campaign=>campaign.campaignid === data.campaignid)[0] || []

    return (
      <div className="table-row" key={data.campaignid}>
        <div className="table-col">{data['campaign']}</div>
        <div className="table-col">{formatValue(data['acos1'], 'number', 0)}</div>
        <div className="table-col">{formatValue(data['acos'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['acos'] - data['acos'])/data['acos']*100, 'percent', 2)}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue((prevMonth['revenue'] - data['revenue'])/data['revenue']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['impressions'] - data['impressions'])/data['impressions']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['clicks'] - data['clicks'])/data['clicks']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['ctr']*100, 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['ctr'] - data['ctr'])/data['ctr']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['conversionrate'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['conversionrate'] - data['conversionrate'])/data['conversionrate']*100, 'percent', 0)}</div>
      </div>
    )
  })
  const productTargetCampaignElements = listCampaigns.map((data) => {
    if (data['targetingtype'] !== 'product') {
      return null
    }
    const prevMonth = listCampaignsPrevMonth.filter(campaign=>campaign.campaignid === data.campaignid)[0]

    return (
      <div className="table-row" key={data.campaignid}>
        <div className="table-col">{data['campaign']}</div>
        <div className="table-col">{formatValue(data['acos1'], 'number', 0)}</div>
        <div className="table-col">{formatValue(data['acos'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['acos'] - data['acos'])/data['acos']*100, 'percent', 2)}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue((prevMonth['revenue'] - data['revenue'])/data['revenue']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['impressions'] - data['impressions'])/data['impressions']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['clicks'] - data['clicks'])/data['clicks']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['ctr']*100, 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['ctr'] - data['ctr'])/data['ctr']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['conversionrate'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['conversionrate'] - data['conversionrate'])/data['conversionrate']*100, 'percent', 0)}</div>
      </div>
    )
  })
  const brandCampaignElements = listCampaigns.map((data) => {
    if (data['targetingtype'] !== 'sp') {
      return null
    }
    const prevMonth = listCampaignsPrevMonth.filter(campaign=>campaign.campaignid === data.campaignid)[0]

    return (
      <div className="table-row" key={data.campaignid}>
        <div className="table-col">{data['campaign']}</div>
        <div className="table-col">{formatValue(data['acos1'], 'number', 0)}</div>
        <div className="table-col">{formatValue(data['acos'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['acos'] - data['acos'])/data['acos']*100, 'percent', 2)}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue((prevMonth['revenue'] - data['revenue'])/data['revenue']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['impressions'] - data['impressions'])/data['impressions']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['clicks'] - data['clicks'])/data['clicks']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['ctr']*100, 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['ctr'] - data['ctr'])/data['ctr']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['conversionrate'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['conversionrate'] - data['conversionrate'])/data['conversionrate']*100, 'percent', 0)}</div>
      </div>
    )
  })
  const displayAdCampaignElements = listCampaigns.map((data) => {
    if (data['targetingtype'] !== 'sd') {
      return null
    }
    const prevMonth = listCampaignsPrevMonth.filter(campaign=>campaign.campaignid === data.campaignid)[0]

    return (
      <div className="table-row" key={data.campaignid}>
        <div className="table-col">{data['campaign']}</div>
        <div className="table-col">{formatValue(data['acos1'], 'number', 0)}</div>
        <div className="table-col">{formatValue(data['acos'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['acos'] - data['acos'])/data['acos']*100, 'percent', 2)}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue((prevMonth['revenue'] - data['revenue'])/data['revenue']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['impressions'] - data['impressions'])/data['impressions']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>
        <div className="table-col">{formatValue((prevMonth['clicks'] - data['clicks'])/data['clicks']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['ctr']*100, 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['ctr'] - data['ctr'])/data['ctr']*100, 'percent', 0)}</div>
        <div className="table-col">{formatValue(data['conversionrate'], 'percent', 2)}</div>
        <div className="table-col">{formatValue((prevMonth['conversionrate'] - data['conversionrate'])/data['conversionrate']*100, 'percent', 0)}</div>
      </div>
    )
  })
  return (
    <div className="account-health-reports">
      <div className="report-table">
        <div className="table-title">Auto Campaigns</div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Campaign Name</div>
            <div className="table-col">Target ACoS</div>
            <div className="table-col">Actual ACoS%</div>
            <div className="table-col">ACoS MoM</div>
            <div className="table-col">Revenue</div>
            <div className="table-col">Revenue MoM</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Impressions MoM</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">Clicks MoM</div>
            <div className="table-col">CTR%</div>
            <div className="table-col">CTR MoM</div>
            <div className="table-col">Conversion%</div>
            <div className="table-col">Conversion MoM</div>
          </div>
        </div>
        <div className="table-body">
          {autoCampaignElements}
        </div>
      </div>
      <div className="report-table">
        <div className="table-title">Manual Campaigns</div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Campaign Name</div>
            <div className="table-col">Target ACoS</div>
            <div className="table-col">Actual ACoS%</div>
            <div className="table-col">ACoS MoM</div>
            <div className="table-col">Revenue</div>
            <div className="table-col">Revenue MoM</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Impressions MoM</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">Clicks MoM</div>
            <div className="table-col">CTR%</div>
            <div className="table-col">CTR MoM</div>
            <div className="table-col">Conversion%</div>
            <div className="table-col">Conversion MoM</div>
          </div>
        </div>
        <div className="table-body">
          {manualCampaignElements}
        </div>
      </div>
      <div className="report-table">
        <div className="table-title">Campaigns with Product Targeting</div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Campaign Name</div>
            <div className="table-col">Target ACoS</div>
            <div className="table-col">Actual ACoS%</div>
            <div className="table-col">ACoS MoM</div>
            <div className="table-col">Revenue</div>
            <div className="table-col">Revenue MoM</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Impressions MoM</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">Clicks MoM</div>
            <div className="table-col">CTR%</div>
            <div className="table-col">CTR MoM</div>
            <div className="table-col">Conversion%</div>
            <div className="table-col">Conversion MoM</div>
          </div>
        </div>
        <div className="table-body">
          {productTargetCampaignElements}
        </div>
      </div>
      <div className="report-table">
        <div className="table-title">Sponsored Brand Campaigns</div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Campaign Name</div>
            <div className="table-col">Target ACoS</div>
            <div className="table-col">Actual ACoS%</div>
            <div className="table-col">ACoS MoM</div>
            <div className="table-col">Revenue</div>
            <div className="table-col">Revenue MoM</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Impressions MoM</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">Clicks MoM</div>
            <div className="table-col">CTR%</div>
            <div className="table-col">CTR MoM</div>
            <div className="table-col">Conversion%</div>
            <div className="table-col">Conversion MoM</div>
          </div>
        </div>
        <div className="table-body">
          {brandCampaignElements}
        </div>
      </div>
      <div className="report-table">
        <div className="table-title">Sponsored Display Ads</div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Campaign Name</div>
            <div className="table-col">Target ACoS</div>
            <div className="table-col">Actual ACoS%</div>
            <div className="table-col">ACoS MoM</div>
            <div className="table-col">Revenue</div>
            <div className="table-col">Revenue MoM</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Impressions MoM</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">Clicks MoM</div>
            <div className="table-col">CTR%</div>
            <div className="table-col">CTR MoM</div>
            <div className="table-col">Conversion%</div>
            <div className="table-col">Conversion MoM</div>
          </div>
        </div>
        <div className="table-body">
          {displayAdCampaignElements}
        </div>
      </div>
    </div>
  );
}

export default ReportsComponent
