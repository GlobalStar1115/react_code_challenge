import React from 'react'
import { Tooltip, Whisper, Progress } from 'rsuite'

import ValueUpYellowSvg from '../../assets/svg/value-up-yellow.svg'
import ValueUpBlueSvg from '../../assets/svg/value-up-blue.svg'
import ValueDownSvg from '../../assets/svg/value-down-red.svg'
import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import {
  formatValue,
  formatCurrency,
} from '../../services/helper'

const ChartOverview = ({ salesStats, currencySign, currencyRate }) => {
  let trueACoS = 0
  let organicPercent = 0
  let ppcPercent = 0
  let isRevenueBetter = true
  let isAcosBetter = true
  if (salesStats) {
    if (salesStats.sales) {
      trueACoS = salesStats.ppcCost / salesStats.sales * 100
      organicPercent = (salesStats.sales - salesStats.ppcRevenue) / salesStats.sales * 100
      ppcPercent = salesStats.ppcRevenue / salesStats.sales * 100
    }

    let pastTrueAcos = 0
    if (salesStats.past.sales) {
      pastTrueAcos = salesStats.past.ppcCost / salesStats.past.sales * 100
    }

    isRevenueBetter = salesStats.sales > salesStats.past.sales
    isAcosBetter = trueACoS > pastTrueAcos
  }

  return (
    <div className="chart-overview">
      <div className="overview-header">
        Overview
      </div>
      <div className="overview-metric">
        <div className="metric-name">Gross Revenue</div>
        <div className="metric-note">
          Organic and advertising revenues combined.
        </div>
        <div className="metric-value">
          <span>
            { formatCurrency(salesStats ? salesStats.sales : 0, currencySign, currencyRate) }
          </span>
          <img src={ isRevenueBetter ? ValueUpYellowSvg : ValueDownSvg } alt="" />
        </div>
      </div>
      <div className="overview-metric">
        <div className="metric-name">
          True ACoS
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              True ACoS is the sum of PPC revenue plus organic revenue, divided by AD Spend.
              Since it takes organic revenue into account, it allows you to see
              how much you are spending on PPC relative to overall revenue.
              You can also see the beneficial affect that your PPC is having
              on organic sales by tracking this number.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="metric-value">
          <span>
            { formatValue(trueACoS, 'percent', 2) }
          </span>
          <img src={ isAcosBetter ? ValueUpBlueSvg : ValueDownSvg } alt="" />
        </div>
        <div className="revenue-split-list">
          <div className="revenue-split">
            <div className="revenue-name">
              Organic Revenue
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  The amount of revenue generated from non-advertising sales.
                  If you see negative organic revenue, Amazon may be experiencing
                  delayed attribution (assigning revenue to certain orders).
                  This is corrected once Amazon updates the data they send to us.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
            <div className="revenue-value">
              { formatValue(organicPercent, 'percent', 2) }
            </div>
          </div>
          <div className="revenue-split">
            <div className="revenue-name">
              PPC Revenue
            </div>
            <div className="revenue-value">
              { formatValue(ppcPercent, 'percent', 2) }
            </div>
          </div>
        </div>
        <Progress.Line
          percent={organicPercent}
          showInfo={false}
        />
      </div>
    </div>
  )
}

export default ChartOverview
