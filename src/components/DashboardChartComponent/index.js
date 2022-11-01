import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import moment from 'moment'
import Select from 'react-select'
import { ReactComponent as TrashSvg } from '../../assets/svg/trash.svg'
import { ReactComponent as PlusSvg } from '../../assets/svg/btns/add-new-blue.svg'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import ChartOverview from './ChartOverview'

import { formatCurrency, formatValue } from '../../services/helper'

const CHART_METRIC_SETTING = 'DASHBOARD_CHART_METRICS'
const METRIC_LIMIT = 6

const metricList = [
  { name: 'PPC Revenue', key: 'revenue', color: '#fbab34' },
  { name: 'Ad Spend', key: 'cost', color: '#cfd2f5' },
  { name: 'Orders', key: 'orders', color: '#3dade8' },
  { name: 'Clicks', key: 'clicks', color: '#25c835' },
  { name: 'Impressions', key: 'impressions', color: '#93df8d' },
  { name: 'ACoS', key: 'acos', color: '#ffd156' },
  { name: 'Ave CPC', key: 'cpc', color: '#072257' },
  { name: 'ROAS', key: 'roas', color: '#292929' },
  { name: 'Conv %', key: 'conversion', color: '#FF7B56' },
]

const DashboardChartComponent = ({ isLoading }) => {
  const store = useStore().getState()

  const {
    dashboard: { salesStats, stats },
    header: {
      currencyRate,
      currencySign,
    },
  } = store

  const [chartData, setChartData] = useState([])
  const [chartMetrics, setChartMetrics] = useState([])
  const [isClickedAdd, setIsClickedAdd] = useState(false)

  const visibility = {}
  metricList.forEach((metric) => {
    // By default, turn off line chart for impressions.
    visibility[metric.key] = metric.key !== 'impressions'
  })

  const [ metricVisibility, setMetricVisibility ] = useState(visibility)

  useEffect(() => {
    loadSavedMetrics()
  }, [])

  const loadSavedMetrics = () => {
    const savedMetrics = window.localStorage.getItem(CHART_METRIC_SETTING)
    if (savedMetrics) {
      let metrics = []
      try {
        metrics = JSON.parse(savedMetrics)
      } catch (error) {
        // keep silence
      }
      setChartMetrics(metrics)
    } else {
      setChartMetrics(metricList.slice(0, METRIC_LIMIT))
    }
  }

  useEffect(() => {
    if (!stats) {
      return
    }

    setChartData(stats.charts.map(record => Object.assign({}, record, {
      revenue: record.revenue * currencyRate,
      cost: record.cost * currencyRate,
      acos: record.revenue ? record.cost / record.revenue * 100 : 0,
      roas: record.cost ? record.revenue / record.cost : 0,
      cpc: record.clicks ? record.cost / record.clicks : 0,
      conversion: record.clicks ? record.orders / record.clicks * 100 : 0,
    })))
  }, [stats, currencyRate])

  const handleMetricToggle = key => () => {
    const visibility = Object.assign({}, metricVisibility, {
      [key]: !metricVisibility[key]
    })
    setMetricVisibility(visibility)
  }

  const handleClickCreateMetric = () => {
    setIsClickedAdd(true)
  }

  const handleDeleteMetric = (index) => {
    let newChartMetrics = [...chartMetrics].filter((metric, ind) => ind !== index)
    setChartMetrics(newChartMetrics)
    window.localStorage.setItem(CHART_METRIC_SETTING, JSON.stringify(newChartMetrics))
  }

  const handleMetricAdd = (metric) => {
    const newChartMetrics = [...chartMetrics]
    const length = newChartMetrics.length
    const selectedMetric = metricList.find(item => item.key === metric.value)
    metricVisibility[selectedMetric.key] = false
    newChartMetrics[length] = selectedMetric
    setChartMetrics(newChartMetrics)
    setIsClickedAdd(false)
    window.localStorage.setItem(CHART_METRIC_SETTING, JSON.stringify(newChartMetrics))
  }
  const formatter = (value, name) => {
    if (name === 'PPC Revenue' || name === 'Ad Spend') {
      return formatCurrency(value, currencySign, currencyRate)
    }
    if (name === 'ACoS') {
      return formatValue(value, 'percent', 1)
    }
    if (name === 'Conv %') {
      return formatValue(value, 'percent', 2)
    }
    if (name === 'ROAS' || name === 'Ave CPC') {
      return formatValue(value, 'number')
    }
    return formatValue(value, 'number', 0)
  }

  const renderLegend = ({ payload }) => (
    <ul className="legend-list">
      {
        payload.map((entry, index) => {
          const style = {
            borderColor: entry.payload.stroke,
          }

          if (metricVisibility[entry.dataKey]) {
            style.backgroundColor = entry.payload.stroke
          }
          return (
            <li key={entry.dataKey}>
              <button onClick={handleMetricToggle(entry.dataKey)}>
                <span className="bullet" style={style} />
                { entry.value }
              </button>
              <TrashSvg onClick={() => { handleDeleteMetric(index) }}/>
            </li>
          )
        })
      }
      {
        isClickedAdd && (
          <li className="metric-selector-container">
            <Select
              className="metric-selector"
              classNamePrefix="metric-selector"
              options={metricList.filter(metric => chartMetrics.findIndex(item => item.key === metric.key) === -1).map(metric => (
                {
                  label: metric.name,
                  value: metric.key,
                }
              ))}
              onChange={handleMetricAdd}
            />
          </li>
        )
      }
      <li className="add-action">
        <PlusSvg
          title="Add Metric"
          onClick={handleClickCreateMetric}
        />
      </li>
    </ul>
  )

  return (
    <div className={`dashboard-chart-component${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent/> }
      <div className="chart-area">
        <div className="chart-content">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={300}
              height={300}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: -25,
                bottom: 20,
              }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={ts => moment.utc(parseInt(ts, 10)).format('MM/DD')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={ts => moment.utc(parseInt(ts, 10)).format('YYYY/MM/DD')}
                formatter={formatter}
              />
              {
                chartMetrics.map(metric => (
                  metric && <Line
                    key={metric.key}
                    type="monotone"
                    name={metric.name}
                    dataKey={metric.key}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ r: 2, fill: metric.color }}
                    activeDot={true}
                    hide={!metricVisibility[metric.key]}
                  />
                ))
              }
              <Legend
                content={renderLegend}
                wrapperStyle={{
                  bottom: -5,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ChartOverview
        salesStats={salesStats}
        currencySign={currencySign}
        currencyRate={currencyRate}
      />
    </div>
  )
}

export default DashboardChartComponent
