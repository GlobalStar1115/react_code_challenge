import React from 'react'
import { useStore } from 'react-redux'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const PerformanceComponent = () => {
  const store = useStore().getState()
  const { header, health } = store
  const {
    currencySign,
    currencyRate
  } = header
  const { matchTypes, placementData } = health
  const { auto, legacy, manual } = placementData

  const matchTypeElements = matchTypes.map((data, ind) => {
    const ctr = data.impressions ? data.clicks / data.impressions * 100.0 : 0
    const acos = data.revenue ? data.cost / data.revenue * 100.0 : 0
    const conv = data.clicks ? data.orders / data.clicks * 100.0 : 0
    const cpc = data.clicks ? data.cost / data.clicks : 0

    return (
      <div className="table-row" key={ind}>
        <div className="table-col">{data['match_type']}</div>
        <div className="table-col">{data['impressions']}</div>
        <div className="table-col">{data['clicks']}</div>
        <div className="table-col">{formatValue(ctr, 'percent')}</div>
        <div className="table-col">{formatValue(cpc, 'percent')}</div>
        <div className="table-col">{data['orders']}</div>
        <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>
        <div className="table-col">{formatValue(acos, 'percent')}</div>
        <div className="table-col">{formatValue(conv, 'percent')}</div>
      </div>
    )
  })

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

  return (
    <div className="account-health-performance">
      <div className="performance-section">
        <div className="table-toolbar">
          <div className="toolbar-left">
            By Placement
          </div>
        </div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Placement</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">CTR</div>
            <div className="table-col">CPC</div>
            <div className="table-col">Orders</div>
            <div className="table-col">Sales</div>
            <div className="table-col">ACoS</div>
            <div className="table-col">Conversion</div>
          </div>
        </div>
        <div className="table-body">
          <div className="table-row">
            <div className="table-col">Top of search(first page)</div>
            <div className="table-col">{formatValue(placementTotal['impressionsTop'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['clicksTop'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['ctrTop'], 'percent')}</div>
            <div className="table-col">{formatCurrency(placementTotal['cpcTop'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['ordersTop'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(placementTotal['revenueTop'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['acosTop'], 'percent')}</div>
            <div className="table-col">{formatValue(placementTotal['convTop'], 'percent')}</div>
          </div>
          <div className="table-row">
            <div className="table-col">Product pages</div>
            <div className="table-col">{formatValue(placementTotal['impressionsDetail'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['clicksDetail'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['ctrDetail'], 'percent')}</div>
            <div className="table-col">{formatCurrency(placementTotal['cpcDetail'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['ordersDetail'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(placementTotal['revenueDetail'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['acosDetail'], 'percent')}</div>
            <div className="table-col">{formatValue(placementTotal['convDetail'], 'percent')}</div>
          </div>
          <div className="table-row">
            <div className="table-col">Reset of search</div>
            <div className="table-col">{formatValue(placementTotal['impressionsOther'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['clicksOther'], 'number', 0)}</div>
            <div className="table-col">{formatValue(placementTotal['ctrOther'], 'percent')}</div>
            <div className="table-col">{formatCurrency(placementTotal['cpcOther'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['ordersOther'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(placementTotal['revenueOther'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['acosOther'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(placementTotal['convOther'], currencySign, currencyRate)}</div>
          </div>
        </div>
      </div>
      <div className="performance-section">
        <div className="table-toolbar">
          <div className="toolbar-left">
            By Bid Type
          </div>
        </div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Bid Type</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">CTR</div>
            <div className="table-col">CPC</div>
            <div className="table-col">Orders</div>
            <div className="table-col">Sales</div>
            <div className="table-col">ACoS</div>
            <div className="table-col">Conversion</div>
          </div>
        </div>
        <div className="table-body">
          <div className="table-row">
            <div className="table-col">Dynamic bids - down only</div>
            <div className="table-col">{formatValue(bidTotal['impressionsLegacy'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['clicksLegacy'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['ctrLegacy'], 'percent')}</div>
            <div className="table-col">{formatCurrency(bidTotal['cpcLegacy'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['ordersLegacy'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(bidTotal['revenueLegacy'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['acosLegacy'], 'percent')}</div>
            <div className="table-col">{formatValue(bidTotal['convLegacy'], 'percent')}</div>
          </div>
          <div className="table-row">
            <div className="table-col">Dynamic bids - up and down</div>
            <div className="table-col">{formatValue(bidTotal['impressionsAuto'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['clicksAuto'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['ctrAuto'], 'percent')}</div>
            <div className="table-col">{formatCurrency(bidTotal['cpcAuto'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['ordersAuto'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(bidTotal['revenueAuto'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['acosAuto'], 'percent')}</div>
            <div className="table-col">{formatValue(bidTotal['convAuto'], 'percent')}</div>
          </div>
          <div className="table-row">
            <div className="table-col">Fixed Bid</div>
            <div className="table-col">{formatValue(bidTotal['impressionsManual'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['clicksManual'], 'number', 0)}</div>
            <div className="table-col">{formatValue(bidTotal['ctrManual'], 'percent')}</div>
            <div className="table-col">{formatCurrency(bidTotal['cpcManual'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['ordersManual'], 'number', 0)}</div>
            <div className="table-col">{formatCurrency(bidTotal['revenueManual'], currencySign, currencyRate)}</div>
            <div className="table-col">{formatValue(bidTotal['acosManual'], 'percent')}</div>
            <div className="table-col">{formatValue(bidTotal['convManual'], 'percent')}</div>
          </div>
        </div>
      </div>
      <div className="performance-section">
        <div className="table-toolbar">
          <div className="toolbar-left">
            By Match Type
          </div>
        </div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">Match Type</div>
            <div className="table-col">Impressions</div>
            <div className="table-col">Clicks</div>
            <div className="table-col">CTR</div>
            <div className="table-col">CPC</div>
            <div className="table-col">Orders</div>
            <div className="table-col">Sales</div>
            <div className="table-col">ACoS</div>
            <div className="table-col">Conversion</div>
          </div>
        </div>
        <div className="table-body">
          {matchTypeElements}
        </div>
      </div>
    </div>
  );
}

export default PerformanceComponent
