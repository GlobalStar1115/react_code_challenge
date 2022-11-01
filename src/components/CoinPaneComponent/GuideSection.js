import React, { useState } from 'react'

import {
  COIN_TYPE_FLOW_QUICK_RESULTS,
  COIN_TYPE_FLOW_SMART_PILOT,
  COIN_TYPE_SCHEDULE_CALL,
  COIN_TYPE_AP_SETUP,
  COIN_TYPE_NAMES,
} from '../../utils/constants/coin'

import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

const flowList = [
  { key: COIN_TYPE_FLOW_QUICK_RESULTS, coin: 25 },
  { key: COIN_TYPE_FLOW_SMART_PILOT, coin: 25 },
  { key: COIN_TYPE_SCHEDULE_CALL, coin: 10 },
  { key: COIN_TYPE_AP_SETUP, coin: 25 },
]

const GuideSection = ({ histories }) => {
  const [expanded, setExpanded] = useState(false)

  const handleExpand = () => {
    setExpanded(prev => !prev)
  }

  const renderFlows = () => {
    return flowList.map((flow) => {
      const completed = histories.find(history => (
        history.type === flow.key
      ))
      return (
        <div key={flow.key} className="flow-item">
          {
            completed
            ? <CheckSvg className="status-completed" />
            : <CloseSvg className="status-incomplete" />
          }
          <span className="flow-name">
            { COIN_TYPE_NAMES[flow.key] }
          </span>
          <span className="flow-coin">
            +{ flow.coin }
          </span>
        </div>
      )
    })
  }

  return (
    <div className="guide-section">
      <div className="section-title" onClick={handleExpand}>
        How do I Earn More Genius Coins?
      </div>
      {
        expanded && (
          <div className="section-contents">
            { renderFlows() }
          </div>
        )
      }
    </div>
  )
}

export default GuideSection
