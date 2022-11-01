import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import moment from 'moment'
import DateRangeComponent from '../CommonComponents/DateRangeComponent'

// action
import {
  setDateRange,
} from '../../redux/actions/header'
import {
  formatValue
} from '../../services/helper'

const ProductChartComponent = ({ revenue, clicks, orders, ...props }) => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const {
    product,
    header,
  } = store
  const {
    curProductChart,
  } = product

  const {
    currencyRate,
    currencySign,
    currentStartDate,
    currentEndDate,
  } = header

  const [ chartData, setChartData ] = useState([])
  const [ currentCurrencyRate, setCurrentCurrencyRate ] = useState(1)
  const [ startDate, setStartDate ] = useState(moment().startOf('day').subtract(29, 'day').toDate())
  const [ endDate, setEndDate ] = useState(moment().endOf('day').toDate())

  useEffect(() => {
    if (!currentStartDate || currentStartDate === '' || !currentEndDate || currentEndDate === '') {
      return
    }
    setStartDate(currentStartDate)
    setEndDate(currentEndDate)
  }, [currentStartDate, currentEndDate])

  useEffect(() => {
    if (!currencyRate) {
      return
    }
    if (!currencySign) {
      return
    }
    setCurrentCurrencyRate(currencyRate)
  }, [currencyRate, currencySign])

  useEffect(() => {
    if (!curProductChart || curProductChart.length === 0) {
      return
    }
    setChartData(curProductChart.map(product => (
      {
        'Gross Revenue': product.revenue * currentCurrencyRate,
        'Ad Spend': product.cost * currentCurrencyRate,
        'Orders': product.orders * 1,
        'Clicks': product.clicks * 1,
        'Impressions': product.impressions * 1,
        'ACoS': product.revenue ? formatValue(product.cost / product.revenue * 100, 'number') : 0,
        'date': moment(product.startdate ? product.startdate : '0000-00-00').format('yyyy/MM/DD'),
      }
    )))
  }, [curProductChart, currentCurrencyRate])

  const handleChangeDateRange = (val) => {
    dispatch(
      setDateRange({
        startDate: val[0],
        endDate: val[1],
      })
    )
  }
  return (
    <div className="product-chart-component">
      <div className="chart-area">
        <div className="chart-header">
          <DateRangeComponent
            onChange = { handleChangeDateRange }
            value = { [ startDate, endDate ] }
          />
        </div>
        <div className="chart-content">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width = { 300 }
              height = { 300 }
              data = { chartData }
              margin = {{
                top: 10,
                right: 30,
                left: -25,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" tickFormatter={ts => moment(ts).format('MM/DD')} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Gross Revenue" stroke="#FBAB34" strokeWidth={2} dot={{ r: 2, fill: '#FBAB34' }} activeDot={true} />
              <Line type="monotone" dataKey="Ad Spend" stroke="#CFD2F5" strokeWidth={2} dot={{ r: 2, fill: '#CFD2F5' }} activeDot={true} />
              <Line type="monotone" dataKey="Orders" stroke="#3DADE8" strokeWidth={2} dot={{ r: 2, fill: '#3DADE8' }} activeDot={true} />
              <Line type="monotone" dataKey="Clicks" stroke="#25C835" strokeWidth={2} dot={{ r: 2, fill: '#25C835' }} activeDot={true} />
              <Line type="monotone" dataKey="Impressions" stroke="#93DF8D" strokeWidth={2} dot={{ r: 2, fill: '#93DF8D' }} activeDot={true} />
              <Line type="monotone" dataKey="ACoS" stroke="#FFD156" strokeWidth={2} dot={{ r: 2, fill: '#FFD156' }} activeDot={true} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-footer">
          <div className="metric-label">
            <span className="metric-dot metric-revenue"></span>
            <span>Gross Revenue</span>
          </div>
          <div className="metric-label">
            <span className="metric-dot metric-spend"></span>
            <span>Ad Spend</span>
          </div>
          <div className="metric-label">
            <span className="metric-dot metric-orders"></span>
            <span>Orders</span>
          </div>
          <div className="metric-label">
            <span className="metric-dot metric-clicks"></span>
            <span>Clicks</span>
          </div>
          <div className="metric-label">
            <span className="metric-dot metric-impr"></span>
            <span>Impressions</span>
          </div>
          <div className="metric-label">
            <span className="metric-dot metric-acos"></span>
            <span>ACoS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductChartComponent
