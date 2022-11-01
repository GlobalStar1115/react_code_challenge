import React from 'react'
import { Link } from 'react-router-dom'
import { useStore } from 'react-redux'

import { formatValue } from '../../services/helper'

const RedeemSection = () => {
  const store = useStore()
  const { coin: { balance } } = store.getState()

  return (
    <div className="redeem-section">
      <div className="redeem-contents">
        <div className="coin-label">
        </div>
        <div className="redeem-coin">
          <div className="redeem-amount">
            { formatValue(balance, 'number', 0) } Coins
          </div>
          <div className="redeem-description">
            Your balance
          </div>
        </div>
        <Link to="/marketplace" className="btn btn-blue">
          Redeem
        </Link>
      </div>
      <div className="redeem-conversion">
        <div className="conversion-label">
          Conversion:
        </div>
        <div className="conversion-value">
          <span className="coin-label">
          </span>
          1 = 1 USD
        </div>
      </div>
    </div>
  )
}

export default RedeemSection
