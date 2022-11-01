import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Tooltip, Whisper } from 'rsuite'
import Select from 'react-select'

import ValueUpSvg from '../../assets/svg/value-up-green.svg'
import ValueDownSvg from '../../assets/svg/value-down-red.svg'
import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as TrashSvg } from '../../assets/svg/trash.svg'
import { ReactComponent as PlusSvg } from '../../assets/svg/btns/add-new-blue.svg'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import DateRangeComponent from '../CommonComponents/DateRangeComponent'
import EmptyCard from './EmptyCard'

import {
  setDateRange,
} from '../../redux/actions/header'

import { formatValue, formatCurrency } from '../../services/helper'

const METRIC_SETTING = 'DASHBOARD_METRICS'
const METRIC_LIMIT = 8

const metricList = {
  organicRevenue: {
    name: 'Organic Revenue',
    tooltip: 'The amount of revenue generated from non-advertising sales. ' +
      'If you see negative organic revenue, Amazon may be experiencing ' +
      'delayed attribution (assigning revenue to certain orders). ' +
      'This is corrected once Amazon updates the data they send to us.'
  },
  ppcRevenue: {
    name: 'PPC Revenue',
    tooltip: 'The total value of products sold to shoppers within the specified timeframe due to clicks on your ads',
  },
  cost: {
    name: 'Ad Spend',
    tooltip: 'The total click charges for a product ad',
  },
  impressions: {
    name: 'Impressions',
    tooltip: 'The number of times ads were displayed',
  },
  clicks: {
    name: 'Clicks/CTR(%)',
  },
  orders: {
    name: 'Orders',
  },
  conversion: {
    name: 'Conversion Rate(%)',
  },
  acos: {
    name: 'ACoS(%)',
  },
  cpc: {
    name: 'Ave CPC',
  },
  roas: {
    name: 'ROAS',
    tooltip: 'Return on ad spend (ROAS)<br /><br />' +
      'The revenue you receive from your advertising investment. ' +
      'This is calculated by dividing sales attributed to your ads by your spend.',
  },
  ntbOrders: {
    name: 'NTB Orders',
    tooltip: 'The number of first-time orders for products within the brand over a 1-year period.',
  },
  ntbSales: {
    name: 'NTB Sales',
    tooltip: 'The total sales (in local currency) of new-to-brand orders.',
  },
  ntbUnits: {
    name: 'NTB Units',
  },
  ntbSalesPercent: {
    name: '% of NTB Sales',
    tooltip: 'The percentage of total sales (in local currency) that are new-to-brand sales.',
  },
}

const KpiList = ({ salesStats, stats, adTypes, currentAdType, onChangeAdType, isLoading, currencySign, currencyRate, currentStartDate, currentEndDate }) => {
  const dispatch = useDispatch()
  const [cards, setCards] = useState([])
  const [isCustomView, setIsCustomView] = useState(false)

  useEffect(() => {
    loadSavedMetrics()
  }, [])

  const loadSavedMetrics = () => {
    const savedMetrics = window.localStorage.getItem(METRIC_SETTING)
    if (savedMetrics) {
      let metrics = []
      try {
        metrics = JSON.parse(savedMetrics)
      } catch (e) {
        // Shhh... keep silence.
      }
      setCards(metrics)
    } else {
      setCards(Object.keys(metricList).slice(0, METRIC_LIMIT))
    }
  }

  const calcMetricValue = (metric) => {
    let isBetter = true
    switch (metric) {
      case 'organicRevenue':
        if (salesStats) {
          isBetter = (salesStats.sales - salesStats.ppcRevenue) >= (salesStats.past.sales - salesStats.past.ppcRevenue)
        }
        return (
          <>
            { formatCurrency(salesStats ? salesStats.sales - salesStats.ppcRevenue : 0, currencySign, currencyRate) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'ppcRevenue':
        if (stats) {
          isBetter = stats.kpi.revenue >= stats.past.kpi.revenue
        }
        return (
          <>
            { formatCurrency(stats ? stats.kpi.revenue : 0, currencySign, currencyRate) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'cost':
        if (stats) {
          isBetter = stats.kpi.cost >= stats.past.kpi.cost
        }
        return (
          <>
            { formatCurrency(stats ? stats.kpi.cost : 0, currencySign, currencyRate) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'impressions':
        if (stats) {
          isBetter = stats.kpi.impressions >= stats.past.kpi.impressions
        }
        return (
          <>
            { formatValue(stats ? stats.kpi.impressions : 0, 'number', 0) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'clicks':
        let ctr = 0
        if (stats && stats.kpi.impressions) {
          ctr = stats.kpi.clicks / stats.kpi.impressions * 100
          let pastCtr = 0
          if (stats.past.kpi.impressions) {
            pastCtr = stats.past.kpi.clicks / stats.past.kpi.impressions * 100
          }
          isBetter = ctr >= pastCtr
        }
        return (
          <>
            { `${formatValue(stats ? stats.kpi.clicks : 0, 'number', 0)} / ${formatValue(ctr, 'percent', 2)}` }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'orders':
        if (stats) {
          isBetter = stats.kpi.orders >= stats.past.kpi.orders
        }
        return (
          <>
            { formatValue(stats ? stats.kpi.orders : 0, 'number', 0) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'conversion':
        let conversion = 0
        if (stats && stats.kpi.clicks) {
          conversion = stats.kpi.orders / stats.kpi.clicks * 100
          let pastConversion = 0
          if (stats.past.kpi.clicks) {
            pastConversion = stats.past.kpi.orders / stats.past.kpi.clicks * 100
          }
          isBetter = conversion >= pastConversion
        }
        return (
          <>
            { formatValue(conversion, 'percent', 2) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'acos':
        let acos = 0
        if (stats && stats.kpi.revenue) {
          acos = stats.kpi.cost / stats.kpi.revenue * 100
          let pastAcos = 0
          if (stats.past.kpi.revenue) {
            pastAcos = stats.past.kpi.cost / stats.past.kpi.revenue * 100
          }
          isBetter = acos >= pastAcos
        }
        return (
          <>
            { formatValue(acos, 'percent', 1) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'cpc':
        let cpc = 0
        if (stats && stats.kpi.clicks) {
          cpc = stats.kpi.cost / stats.kpi.clicks
          let pastCpc = 0
          if (stats.past.kpi.clicks) {
            pastCpc = stats.past.kpi.cost / stats.past.kpi.clicks
          }
          isBetter = cpc >= pastCpc
        }
        return (
          <>
            { formatValue(cpc, 'number', 2) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'roas':
        let roas = 0
        if (stats && stats.kpi.cost) {
          roas = stats.kpi.revenue / stats.kpi.cost
          let pastRoas = 0
          if (stats.past.kpi.cost) {
            pastRoas = stats.past.kpi.revenue / stats.past.kpi.cost
          }
          isBetter = roas >= pastRoas
        }
        return (
          <>
            { formatValue(roas, 'number', 2) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'ntbOrders':
        if (stats) {
          isBetter = stats.kpi.ntbOrders >= stats.past.kpi.ntbOrders
        }
        return (
          <>
            { formatValue(stats ? stats.kpi.ntbOrders : 0, 'number', 0) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'ntbSales':
        if (stats) {
          isBetter = stats.kpi.ntbSales >= stats.past.kpi.ntbSales
        }
        return (
          <>
            { formatCurrency(stats ? stats.kpi.ntbSales : 0, currencySign, currencyRate) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'ntbUnits':
        if (stats) {
          isBetter = stats.kpi.ntbUnits >= stats.past.kpi.ntbUnits
        }
        return (
          <>
            { formatValue(stats ? stats.kpi.ntbUnits : 0, 'number', 0) }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      case 'ntbSalesPercent':
        let percent = 0
        if (stats && stats.kpi.revenue) {
          percent = stats.kpi.ntbSales / stats.kpi.revenue * 100
          let oldPercent = 0
          if (stats.past.kpi.revenue) {
            oldPercent = stats.past.kpi.ntbSales / stats.past.kpi.revenue * 100
          }
          isBetter = percent >= oldPercent
        }
        return (
          <>
            { formatValue(percent, 'percent') }
            <img src={ isBetter ? ValueUpSvg : ValueDownSvg } alt="" />
          </>
        )
      default:
        return ''
    }
  }

  const handleCustomizeView = () => {
    setIsCustomView(true)
  }

  const handleCancelView = () => {
    loadSavedMetrics()
    setIsCustomView(false)
  }

  const handleSaveView = () => {
    const newCards = []
    let emptyCounter = 0
    // When saving custom view, push full cards to the beginning
    // and add empty slots at the end of list.
    cards.forEach((metric) => {
      if (metric) {
        newCards.push(metric)
      } else {
        emptyCounter += 1
      }
    })
    for (let counter = 0; counter < emptyCounter; counter += 1) {
      newCards.push('')
    }

    setCards(newCards)
    setIsCustomView(false)

    window.localStorage.setItem(METRIC_SETTING, JSON.stringify(newCards))
  }

  const handleMetricAdd = index => (metric) => {
    const newCards = [...cards]
    newCards[index] = metric
    setCards(newCards)
  }

  const handleCreateMetric = () => {
    const newCards = [...cards]
    const length = newCards.length
    newCards[length] = ''
    setCards(newCards)
  }
  const handleRemove = index => () => {
    const newCards = [...cards]
    newCards[index] = ''
    setCards(newCards)
  }

  const renderFullCard = (metric, index) => (
    <div className="kpi-card-inner">
      <div className="metric-name">
        { metricList[metric].name }
        {
          isCustomView && (
            <TrashSvg
              className="trash-icon"
              title="Remove Metric"
              onClick={handleRemove(index)}
            />
          )
        }
        {
          !isCustomView && typeof metricList[metric].tooltip !== 'undefined' && (
            <Whisper placement="bottom" trigger="hover" speaker={(
              <Tooltip>
                <span dangerouslySetInnerHTML={{
                  __html: metricList[metric].tooltip,
                }} />
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          )
        }
      </div>
      <div className="metric-value">
        { calcMetricValue(metric) }
      </div>
    </div>
  )

  const renderCard = (metric, index) => {
    if (!isCustomView && !metric) {
      return null
    }

    return (
      <div key={`${index}-${metric}`} className={`kpi-card${isLoading ? ' loading' : ''}`}>
        {
          metric
          ? renderFullCard(metric, index)
          : (
            <EmptyCard
              metricList={metricList}
              cards={cards}
              onChange={handleMetricAdd(index)}
            />
          )
        }
      </div>
    )
  }

  const handleDateRangeChange = ([startDate, endDate]) => {
    dispatch(
      setDateRange({
        startDate,
        endDate,
      })
    )
  }
  return (
    <>
      <div className="page-header">
        <div className="flex">
          <Select
            className="ad-type-selector"
            options={adTypes}
            value={currentAdType}
            onChange={onChangeAdType}
          />
          <DateRangeComponent
            onChange={handleDateRangeChange}
            value={[currentStartDate, currentEndDate]}
          />
        </div>
        <div className="page-header-buttons">
          {isCustomView ?
            <>
              <button type="button" className="page-header-button-cancel" onClick={handleCancelView}>
                Cancel
              </button>
              <button type="button" className="page-header-button-save" onClick={handleSaveView}>
                Save View
              </button>
            </>
            :
            <button type="button" className="page-header-button-custom" onClick={handleCustomizeView}>
              Customize View
            </button>
          }
          <Dropdown
            title="+ New"
            placement="bottomEnd"
            toggleClassName="new-campaign-toggle"
          >
            <Dropdown.Item componentClass={Link} to="/campaigns/new/sp">
              Sponsored Product Campaign
            </Dropdown.Item>
            <Dropdown.Item href="https://ppcentourage.com/spotlights/ppc/createNewSpotlight" target="_blank">
              Sponsored Brand Campaign
            </Dropdown.Item>
            <Dropdown.Item href="https://ppcentourage.com/spotlights/ppc/createNewSpotlight" target="_blank">
              Sponsored Brand Video Campaign
            </Dropdown.Item>
            <Dropdown.Item componentClass={Link} to="/campaigns/new/sd">
              Sponsored Display Campaign
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      <div className={`kpi-container${isLoading ? ' loading' : ''}`}>
        { isLoading && <LoaderComponent /> }
        { cards.map(renderCard) }
        {
          cards.length > 0 && cards.length < 16  && isCustomView && (
            <div className="plus-icon-container">
              <PlusSvg
                title="Add Metric"
                onClick={handleCreateMetric}
              />
            </div>
          )
        }
      </div>
    </>
  )
}

export default KpiList
