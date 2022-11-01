import React from 'react'

import CampaignChartComponent from '../../../../CampaignChartComponent'
import LoaderComponent from '../../../../CommonComponents/LoaderComponent'

import {
  formatValue,
  formatCurrency,
} from '../../../../../services/helper'

const CampaignKpi = ({ kpi, chart, sign, rate, isLoading }) => {
  return (
    <div className="section">
      <div className={`statistics-cards${isLoading ? ' loading' : ''}`}>
        { isLoading && <LoaderComponent /> }
        <div className="statistics-cards-row">
          <div className="statistics-card">
            <div className="statistics-card-name">Gross Revenue</div>
            <div className="statistics-card-value">{ formatCurrency(kpi && kpi['revenue'] ? kpi['revenue'] : 0, sign, rate) }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">Clicks</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['clicks'] ? kpi['clicks'] : 0, 'number', 0) }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">Spend</div>
            <div className="statistics-card-value">{ formatCurrency(kpi && kpi['cost'] ? kpi['cost'] : 0, sign, rate) }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">Impressions</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['impressions'] ? kpi['impressions'] : 0, 'number', 0) }</div>
          </div>
        </div>
        <div className="statistics-cards-row">
          <div className="statistics-card">
            <div className="statistics-card-name">Orders</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['orders'] ? kpi['orders'] : 0, 'number', 0) }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">CTR</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['impressions'] && parseFloat(kpi['impressions']) !== 0 ? (kpi['clicks'] / kpi['impressions']) * 100 : 0, 'percent') }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">Conversion Rate</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['clicks'] && parseFloat(kpi['clicks']) !== 0 ? (kpi['orders'] / kpi['clicks']) * 100 : 0, 'percent') }</div>
          </div>
          <div className="statistics-card">
            <div className="statistics-card-name">ACoS</div>
            <div className="statistics-card-value">{ formatValue(kpi && kpi['revenue'] && kpi['cost'] && parseFloat(kpi['revenue']) !== 0 ? (kpi['cost'] / kpi['revenue']) * 100 : 0, 'percent') }</div>
          </div>
        </div>
      </div>
      <CampaignChartComponent
        isLoading={isLoading}
        chart={chart}
      />
    </div>
  )
}

export default CampaignKpi
