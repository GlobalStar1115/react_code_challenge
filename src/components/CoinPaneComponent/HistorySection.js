import React, { useState } from 'react'

import {
  COIN_TYPE_NAMES,
} from '../../utils/constants/coin'

const HistorySection = ({ histories }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(prev => !prev)
  }

  const renderHistory = () => {
    if (!histories.length) {
      return (
        <div className="history-item">
          <div className="history-description text-center">
            <em>No history.</em>
          </div>
        </div>
      )
    }

    return histories.map(history => (
      <div key={history.type} className="history-item">
        <div className="history-description">
          { COIN_TYPE_NAMES[history.type] || history.type }
        </div>
        <div className={`history-coin ${history.amount > 0 ? 'history-earn' : 'history-redeem'}`}>
          { history.amount }
        </div>
      </div>
    ))
  }

  return (
    <div className="history-section">
      <div className="section-title" onClick={handleExpand}>
        Genius Coin History
      </div>
      {
        expanded && (
          <div className="section-contents">
            { renderHistory() }
          </div>
        )
      }
    </div>
  )
}

export default HistorySection
