import React, { useState } from 'react'
import Select from 'react-select'

const EmptyCard = ({ metricList, cards, onChange }) => {
  const [isSelecting, setIsSelecting] = useState(false)

  const unusedMetrics = []
  Object.keys(metricList).forEach((metric) => {
    if (cards.indexOf(metric) === -1) {
      unusedMetrics.push({
        label: metricList[metric].name,
        value: metric,
      })
    }
  })

  return (
    <div
      className="kpi-card-inner kpi-empty"
      onClick={() => { !isSelecting && setIsSelecting(true) }}
    >
      {
        !isSelecting ? '+ Metric Card' : (
          <Select
            className="metric-selector"
            classNamePrefix="metric-selector"
            options={unusedMetrics}
            placeholder="Select Metric..."
            onChange={(selected) => { onChange(selected.value) }}
          />
        )
      }
    </div>
  )
}

export default EmptyCard
