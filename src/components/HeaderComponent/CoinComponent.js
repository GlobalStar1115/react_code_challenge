/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'

import { toggleCoinPane } from '../../redux/actions/pageGlobal'
import { formatValue } from '../../services/helper'

const CoinComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { coin: { balance, histories } } = store.getState()

  const [congratsVisible, setCongratsVisible] = useState(false)
  const amountRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!histories.length) {
      return
    }

    if (histories[histories.length - 1].newlyEarned === true) {
      amountRef.current = histories[histories.length - 1].amount
      setCongratsVisible(true)

      timerRef.current = setTimeout(() => {
        setCongratsVisible(false)

        timerRef.current = null
      }, 3 * 1000)
    }
  }, [histories])

  // Clear any pending timeout.
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleTogglePane = (event) => {
    event.preventDefault()
    dispatch(toggleCoinPane())
  }

  const renderCongrats = () => {
    if (!congratsVisible) {
      return null
    }

    return (
      <div className="coin-congrats-wrapper">
        <div className="coin-label-wrapper">
          <span className="coin-label">
          </span>
        </div>
        <div className="coin-info">
          <div className="coin-amount">
            { formatValue(amountRef.current, 'number', 0) } Coins
          </div>
          <div className="coin-description">
            You received bonus
          </div>
        </div>
      </div>
    )
  }

  return (
    <span className="coin-component">
      <a href="#" onClick={handleTogglePane}>
        <span className="coin-label">
        </span>
        { formatValue(balance, 'number', 0) }
      </a>
      { renderCongrats() }
    </span>
  )
}

export default CoinComponent
