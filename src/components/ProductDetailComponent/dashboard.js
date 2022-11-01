import React from 'react'
import { useStore } from 'react-redux'

import ProductChartComponent from '../ProductChartComponent'
import CampaignTableComponent from '../CampaignTableComponent'

import {
  formatCurrency,
  formatValue
} from '../../services/helper'

const ProductDashboardComponent = ({curProductKpi, productCog, setProductCog, onUpdateAcos}) => {
  const store = useStore().getState()

  const {
    header,
    product,
  } = store

  const {
    currencyRate,
    currencySign,
  } = header

  const {
    curProduct,
  } = product

  const isSame = formatValue(curProduct['cog'], 'number') === productCog

  return (
    <div className="product-detail-dashboard">
      <div className="section">
        <div className="block-info">
          <div className="info-row">
            <div className="input-row">
              <span>Cost of goods</span>
              <input type="number" min="0" value={ productCog } onChange={e => setProductCog(e.target.value)} />
              { !isSame && <button type="button" className="page-button-new" onClick={ onUpdateAcos }>Save</button> }
            </div>
            <div className="input-row">
              <span>Average selling price ({currencySign})</span>
              <input type="number" value={ formatValue(curProductKpi['average_selling_price'], 'number', 2)  } disabled />
            </div>
            <div className="input-row">
              <span>Profit margin</span>
              <input type="number" value={ formatValue(curProductKpi['profit_margin'], '', 2) } disabled />
            </div>
            <div className="input-row">
              <span>Profit margin (%)</span>
              <input type="number" value={ formatValue(curProductKpi['profit_percent'], 'number', 2) } disabled />
            </div>
          </div>
        </div>
        <div className="statistics-cards">
          <div className="statistics-cards-row">
            <div className="statistics-card">
              <div className="statistics-card-name">Organic Revenue</div>
              <div className="statistics-card-value">{ formatCurrency(( isFinite(curProductKpi['ppcrevenue']) ? curProductKpi['total_sale'] - curProductKpi['ppcrevenue'] : 0 ), currencySign, currencyRate) }</div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">PPC Revenue</div>
              <div className="statistics-card-value">{ formatCurrency(curProductKpi['ppcrevenue'], currencySign, currencyRate)  }</div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">Spend</div>
              <div className="statistics-card-value">{ formatCurrency(curProductKpi['cost'], currencySign, currencyRate)}</div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">Impressions</div>
              <div className="statistics-card-value">{ formatValue(curProductKpi['impressions'], 'number', 0) }</div>
            </div>
          </div>
          <div className="statistics-cards-row">
            <div className="statistics-card">
              <div className="statistics-card-name">Orders</div>
              <div className="statistics-card-value">{ formatValue(curProductKpi['orders'], 'number', 0) }</div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">Clicks/CTR</div>
              <div className="statistics-card-value">{`${formatValue(curProductKpi['clicks'], 'number', 0)}/${formatValue(curProductKpi['ctr'], 'percent', 2)}`}</div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">Conversion Rate</div>
              <div className="statistics-card-value">
                { formatValue(!isFinite(curProductKpi['orders'] / curProductKpi['clicks'] * 100) ? 0 : curProductKpi['orders'] / curProductKpi['clicks'] * 100, 'percent', 2) }
              </div>
            </div>
            <div className="statistics-card">
              <div className="statistics-card-name">ACOS</div>
              <div className="statistics-card-value">
                { formatValue(!isFinite(curProductKpi['cost'] / curProductKpi['revenue'] * 100) ? 0 : curProductKpi['cost'] / curProductKpi['revenue'] * 100, 'percent', 1) }
              </div>
            </div>
          </div>
        </div>
        <div className="block-chart">
          <ProductChartComponent
            revenue = { curProductKpi['total_sale'] * currencyRate }
            orders = { curProductKpi['orders'] }
            clicks = { curProductKpi['clicks'] }
          />
        </div>
      </div>
      <div className="section">
        <CampaignTableComponent />
      </div>
    </div>
  )
}

export default ProductDashboardComponent
