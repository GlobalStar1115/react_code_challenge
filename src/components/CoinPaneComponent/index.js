import React from 'react'
import { useDispatch, useStore } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import { toggleCoinPane } from '../../redux/actions/pageGlobal'

import RedeemSection from './RedeemSection'
import TaskSection from './TaskSection'
import GuideSection from './GuideSection'
import HistorySection from './HistorySection'

const CoinPaneComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { coin: { histories } } = store.getState()

  const handleClose = () => {
    dispatch(toggleCoinPane())
  }

  const handleOutsideClick = () => {
    handleClose()
  }

  return (
    <OutsideClickHandler onOutsideClick={handleOutsideClick}>
      <div className="coin-pane-component">
        <div className="pane-header">
          <div className="pane-title">
            Earned Genius Coins
          </div>
          <CloseSvg className="close-button" title="Close" onClick={handleClose} />
        </div>
        <div className="pane-body">
          <RedeemSection />
          <TaskSection histories={histories} />
          <GuideSection histories={histories} />
          <HistorySection histories={histories} />
        </div>
        <div className="pane-footer">
          <a href="https://www.facebook.com/groups/1095709597142657" target="_blank" rel="noopener noreferrer">
            Share your wins and ask questions in the community!
          </a>
        </div>
      </div>
    </OutsideClickHandler>
  )
}

export default CoinPaneComponent
