import React, { useState, useEffect } from 'react'
import { useStore } from 'react-redux'

import CampaignKpi from './sections/statistic'
import CampaignInfo from './sections/campaign-info'
import NegativeKeywordSection from './sections/NegativeKeyword'
import NegativeTargetSection from './sections/NegativeTarget'
import LogSection from './sections/log'

import {
  getNormalizedCampaignType,
} from '../../../../services/helper'

const CampaignDashboardComponent = () => {
  const store = useStore()

  const {
    campaignDetail: { isLoading, kpiData, chartData, currentDetail },
    header: {
      currencyRate,
      currencySign,
    },
  } = store.getState()

  const [campaignDetail, setCampaignDetail] = useState()

  useEffect(() => {
    if (!currentDetail) {
      return
    }

    let topOfSearchPercent = 0
    let productPagePercent = 0
    if (currentDetail.bidding) {
      topOfSearchPercent = currentDetail.bidding.adjustments
        ? currentDetail.bidding.adjustments.filter(item => item.predicate === 'placementTop') : []
      topOfSearchPercent = topOfSearchPercent.length > 0 ? topOfSearchPercent[0].percentage : 0

      productPagePercent = currentDetail.bidding.adjustments
        ? currentDetail.bidding.adjustments.filter(item => item.predicate === 'placementProductPage') : []
      productPagePercent = productPagePercent.length > 0 ? productPagePercent[0].percentage : 0
    }

    setCampaignDetail({
      campaign: currentDetail.name,
      state: currentDetail.state,
      portfolioId: currentDetail.portfolio_id,
      portfolioName: currentDetail.portfolio_name,
      campaignId: currentDetail.campaign_id,
      campaignType: getNormalizedCampaignType(currentDetail.campaign_type),
      bidding: currentDetail.bidding,
      topOfSearchPercent: topOfSearchPercent,
      productPagePercent: productPagePercent,
      defaultBid: 1.00,
    })
  }, [currentDetail])

  return (
    <div className="campaign-detail-dashboard">
      <CampaignKpi
        kpi={kpiData}
        isLoading={isLoading}
        chart={chartData}
        rate={currencyRate}
        sign={currencySign}
      />
      <CampaignInfo
        isLoading={isLoading}
        campaignDetail={campaignDetail}
      />
      {
        (!campaignDetail || campaignDetail.campaignType !== 'Sponsored Displays') && (
          <NegativeKeywordSection
            isLoading={isLoading}
            campaignDetail={campaignDetail}
          />
        )
      }
      <NegativeTargetSection
        isLoading={isLoading}
        campaignDetail={campaignDetail}
      />
      <LogSection
        campaignDetail={campaignDetail}
      />
    </div>
  )
}

export default CampaignDashboardComponent
