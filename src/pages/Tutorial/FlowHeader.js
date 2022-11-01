/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import { formatValue } from '../../services/helper'

const FlowHeader = ({ name, coin = 0, onToggle }) => {
  return (
    <div className="flow-header">
      <a href="#" className="flow-name" onClick={(event) => { event.preventDefault(); onToggle() }}>
        { name }
      </a>
      {
        coin > 0 && (
          <span className="coin-balance">
            <span className="coin-label">
            </span>
            +{ formatValue(coin, 'number', 0) }
          </span>
        )
      }
    </div>
  )
}

export default FlowHeader
