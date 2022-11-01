import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import moment from 'moment'
import {
  formatValue,
  calculateTrendLines,
} from '../../../services/helper'

const getNearValue = (value) => {
  const length = parseInt(value).toString().length
  const divider = Math.pow(10, length)
  return Math.ceil(value/divider) * divider
}
const getColor = (direct, diff) => {
  if (direct) {
    return diff > 0 ? {stroke: '#EA305C', fill: '#colorUr'} : {stroke: '#93DF8D', fill: '#colorUg'}
  }
  return diff > 0 ? {stroke: '#93DF8D', fill: '#colorUg'} : {stroke: '#EA305C', fill: '#colorUr'}
}
const getChartData = (data, startDate, endDate) => {
  const newAreaData = []
  const start = moment(moment(startDate).format('yyyy/MM/DD'))
  const end = moment(moment(endDate).format('yyyy/MM/DD'))
  const period = end.diff(start, 'days')
  for (let index = 0; index <= period; index++) {
    const tmpDate = moment(start).add(index, 'days')
    const itemIndex = data.findIndex(item => moment(item.date).format('yyyy/MM/DD') === tmpDate.format('yyyy/MM/DD'))
    const tmpItem = {
      value: formatValue(0),
      date: tmpDate.format('yyyy/MM/DD'),
    }
    if (itemIndex !== -1) {
      tmpItem.value = formatValue(data[itemIndex].value)
    }
    newAreaData.push(tmpItem)
  }
  return newAreaData
}
const AreaRechartComponent = ({ areaData, direct=false, showXAxis, showYAxis, showToolTip, margin, startDate, endDate }) => {
  const newAreaData = getChartData(areaData, startDate, endDate)
  const [startPoint, endPoint] = calculateTrendLines(newAreaData)
  const values = newAreaData.map(item => item.value || 0)
  const minValue = Math.ceil(Math.min(0, ...values))
  const maxValue = Math.ceil(Math.max(...values)) < 10 ? Math.ceil(Math.max(...values)) : getNearValue(Math.ceil(Math.max(...values)))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        className="area-chart"
        data={newAreaData}
        margin={margin}
      >
        <defs>
          <linearGradient id='colorUr' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#EA305C' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#EA305C' stopOpacity={0} />
          </linearGradient>
          <linearGradient id='colorUg' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#93DF8D' stopOpacity={0.8} />
            <stop offset='95%' stopColor='#93DF8D' stopOpacity={0} />
          </linearGradient>
        </defs>
        {
          showXAxis && <XAxis dataKey="date" tickFormatter={ts => moment(ts).format('MM/DD')} />
        }
        {
          showYAxis && <YAxis dataKey="value" domain={[minValue, maxValue]} />
        }
        {
          showToolTip && <Tooltip />
        }
        <Area
          type='monotone'
          dataKey='value'
          stroke={getColor(direct, endPoint.y - startPoint.y > 0)['stroke']}
          fillOpacity={1}
          fill={`url(${getColor(direct, endPoint.y - startPoint.y > 0)['fill']})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default AreaRechartComponent
