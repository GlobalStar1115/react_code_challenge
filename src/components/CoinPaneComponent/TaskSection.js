import React from 'react'
import { Link } from 'react-router-dom'

import {
  COIN_TYPE_FLOW_SMART_PILOT,
} from '../../utils/constants/coin'

import { ReactComponent as TaskSvg } from '../../assets/svg/task.svg'

const TaskSection = ({ histories }) => {
  const alreadyDid = histories.find(history => (
    history.type === COIN_TYPE_FLOW_SMART_PILOT
  ))

  if (alreadyDid) {
    return null
  }

  return (
    <div className="task-section">
      <div className="task-border">
        <div className="contents-wrapper">
          <TaskSvg />
        </div>
        <div className="back-line" />
      </div>
      <div className="task-contents">
        Learn how to use Smart Pilot
      </div>
      <div className="task-border">
        <div className="contents-wrapper">
          <Link to={{
            pathname: '/tutorial',
            state: {
              openSP: true,
            },
          }} className="btn btn-blue">
            Get +25 Coins Now
          </Link>
        </div>
        <div className="back-line" />
      </div>
    </div>
  )
}

export default TaskSection
