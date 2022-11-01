import React from 'react'

const formatValue = (type, value) => {
  if (type === 'int') {
    return value.toLocaleString()
  }
  if (type === 'money') {
    // FIXME: Use current currency symbol.
    return `$${value.toFixed(2).toLocaleString()}`
  }
  if (type === 'percent') {
    return `${value.toFixed(2)}%`
  }
  return value
}

const OpTestingMetric = ({ name, type, valueA, valueB }) => (
  <div className="testing-metric">
    <div className="metric-name">{ name }</div>
    <div className="metric-results">
      <div className="metric-result-split">
        <div className="metric-result-label">A</div>
        <div className="metric-result-value">
          { formatValue(type, valueA) }
        </div>
      </div>
      <div className="metric-result-split">
        <div className="metric-result-label">B</div>
        <div className="metric-result-value">
          { formatValue(type, valueB) }
        </div>
      </div>
    </div>
    <div className="metric-summary">
      { valueB >= valueA ? '+' : '' }
      { formatValue(type, valueB - valueA) }
    </div>
  </div>
)

export default OpTestingMetric
