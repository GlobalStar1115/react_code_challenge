import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
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

import DateRangeComponent from '../CommonComponents/DateRangeComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import {
  setDateRange,
} from '../../redux/actions/header'

import { formatCurrency, formatValue } from '../../services/helper'

const metricList = [
  { name: 'PPC Revenue', key: 'revenue', color: '#fbab34' },
  { name: 'Ad Spend', key: 'cost', color: '#cfd2f5' },
  { name: 'Orders', key: 'orders', color: '#3dade8' },
  { name: 'Clicks', key: 'clicks', color: '#25c835' },
  { name: 'Impressions', key: 'impressions', color: '#93df8d' },
  { name: 'ACoS', key: 'acos', color: '#ffd156' },
]

const CampaignChartComponent = ({ isLoading, chart }) => {
  const store = useStore()
  const  { header } = store.getState()
  const dispatch = useDispatch()
  const {
    currencySign,
    currencyRate,
    currentStartDate,
    currentEndDate,
  } = header

  const [chartData, setChartData] = useState([])

  const visibility = {}
  metricList.forEach((metric) => {
    // By default, turn off line chart for impressions.
    visibility[metric.key] = metric.key !== 'impressions'
  })

  const [metricVisibility, setMetricVisibility] = useState(visibility)

  useEffect(()=> {
    if (!chart.length) {
      return
    }
    setChartData(chart.map(data => ({
      ...data,
      acos: parseFloat(data.revenue) !== 0 ? data.cost / data.revenue * 100 : 0,
      date: data.date ? new Date(data.date).valueOf() : new Date().valueOf(),
    })))
  }, [chart, currencyRate])

  const handleChangeDateRange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleMetricToggle = key => () => {
    const visibility = Object.assign({}, metricVisibility, {
      [key]: !metricVisibility[key]
    })
    setMetricVisibility(visibility)
  }

  const formatter = (value, name) => {
    if (name === 'PPC Revenue' || name === 'Ad Spend') {
      return formatCurrency(value, currencySign, currencyRate)
    }
    if (name === 'ACoS') {
      return formatValue(value, 'percent', 1)
    }
    return formatValue(value, 'number', 0)
  }

  const renderLegend = ({ payload }) => (
    <ul className="legend-list">
      {
        payload.map((entry) => {
          const style = {
            borderColor: entry.payload.stroke,
          }

          if (metricVisibility[entry.dataKey]) {
            style.backgroundColor = entry.payload.stroke
          }

          return (
            <li key={entry.dataKey} onClick={handleMetricToggle(entry.dataKey)}>
              <span className="bullet" style={style} />
              { entry.value }
            </li>
          )
        })
      }
    </ul>
  )

  return (
    <div className={`campaign-chart-component${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="chart-header">
        <DateRangeComponent
          onChange={handleChangeDateRange}
          value={[currentStartDate, currentEndDate]}
        />
      </div>
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
              bottom: 0,
            }}
          >
            <XAxis
              dataKey="date"
              tickFormatter={ts => moment(ts).format('MM/DD')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={ts => moment(ts).format('YYYY/MM/DD')}
              formatter={formatter}
            />
            {
              metricList.map(metric => (
                <Line
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
  )
}

export default CampaignChartComponent
