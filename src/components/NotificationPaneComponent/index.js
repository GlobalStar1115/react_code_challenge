import React from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import OutsideClickHandler from 'react-outside-click-handler'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import { toggleNotificationPane } from '../../redux/actions/pageGlobal'

const NotificationPaneComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()
  const { header: { currentOutOfBudgetCampaignLogs } } = store.getState()

  const handleClose = () => {
    dispatch(toggleNotificationPane())
  }

  const handleViewLog = () => {
    history.push('/activity-log')
  }
  const renderPaneBody = () => {
    if (!currentOutOfBudgetCampaignLogs) {
      return
    }
    if (currentOutOfBudgetCampaignLogs.length === 0) {
      return
    }
    return currentOutOfBudgetCampaignLogs.map((campaignLog, index) => (
      <div className="notification-list" key={campaignLog && campaignLog.length > 0 ? campaignLog[0].id : index}>
        <div className="notification-item">
          <div className="notification-title">
            <h4 className="campaign-name">{campaignLog && campaignLog.length > 0 ? campaignLog[0].campaignName : ''}</h4>
            <span className="campaign-date">{campaignLog && campaignLog.length > 0 ? campaignLog[0].outOfBudgetDate : ''}</span>
          </div>
          {
            campaignLog && campaignLog.length > 1 && (
              <div className="notification-history">
                <span className="history-title">History: </span>
                <div className="history-list">
                {
                  campaignLog.map(item => (
                    <li className="history-item" key={item.id}>
                      <span>On</span>
                      <span className="history-date">{item.outOfBudgetDate}</span>
                      <span>It was out of budget</span>
                    </li>
                  ))
                }
                </div>
              </div>
            )
          }
        </div>
      </div>
    ))
  }
  return (
    <OutsideClickHandler onOutsideClick={handleClose}>
      <div className="notification-pane-component">
        <div className="pane-header">
          <div className="pane-title">
            {
              currentOutOfBudgetCampaignLogs && currentOutOfBudgetCampaignLogs.length > 0
                ? `You have ${currentOutOfBudgetCampaignLogs.length} campaign(s) out of budget.`
                : 'You have no campaign out of budget'
            }
          </div>
          <CloseSvg className="close-button" title="Close" onClick={handleClose} />
        </div>
        <div className="pane-body">
          <span>
            Note: See activity log for more details. <button type="button" onClick={handleViewLog}>View activity log</button>
          </span>
          {renderPaneBody()}
        </div>
      </div>
    </OutsideClickHandler>
  )
}

export default NotificationPaneComponent
