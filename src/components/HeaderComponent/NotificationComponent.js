/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'
import { ReactComponent as BellSvg } from '../../assets/svg/bell.svg'
import {
  toggleNotificationPane,
} from '../../redux/actions/pageGlobal'
import {
  setNotificationChecked,
  setOutOfBudget,
} from '../../redux/actions/header'

import { formatValue } from '../../services/helper'

const NotificationComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const {
    campaignLog,
    header,
  } = store.getState()

  const {
    isOutOfBudgetCampaignLogsLoading,
    outOfBudgetCampaignLogs,
  } = campaignLog

  const {
    isCheckedNotification,
    currentOutOfBudgetCampaignLogs,
  } = header

  useEffect(() => {
    if (isOutOfBudgetCampaignLogsLoading) {
      return
    }
    if (!outOfBudgetCampaignLogs) {
      return
    }
    const tmpCampaignLogs = outOfBudgetCampaignLogs.map(campaignLog => {
      let index = campaignLog.contents.search('was out of budget at')
      let tmpLog = {...campaignLog}
      if (index > -1) {
        tmpLog.campaignName = campaignLog.contents.slice(0, index - 1)
      }
      tmpLog.outOfBudgetDate = moment(campaignLog.created_at).format('ll')
      return tmpLog
    })
    const logsByCampaign = tmpCampaignLogs.reduce((total, currentVal) => {
      (total[currentVal['campaign_id']] = total[currentVal['campaign_id']] || []).push(currentVal)
      return total
    }, {})

    const tmpOutOfBudgetCampaigns = []
    for (let campaignId in logsByCampaign) {
      tmpOutOfBudgetCampaigns.push(logsByCampaign[campaignId])
    }

    if (isCheckedNotification && currentOutOfBudgetCampaignLogs && currentOutOfBudgetCampaignLogs.length > 0 && currentOutOfBudgetCampaignLogs.length !== tmpOutOfBudgetCampaigns.length) {
      dispatch(
        setNotificationChecked(false)
      )
    }
    dispatch(
      setOutOfBudget(tmpOutOfBudgetCampaigns)
    )
    // eslint-disable-next-line
  }, [isOutOfBudgetCampaignLogsLoading, outOfBudgetCampaignLogs])

  const handleTogglePane = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleNotificationPane())
    dispatch(setNotificationChecked(true))
  }

  const renderBadge = () => {
    if (isOutOfBudgetCampaignLogsLoading) {
      return
    }
    if (!currentOutOfBudgetCampaignLogs || currentOutOfBudgetCampaignLogs.length === 0) {
      return
    }

    if (isCheckedNotification) {
      return
    }
    return (
      <span className="notification-badge">
        {formatValue(currentOutOfBudgetCampaignLogs.length, 'number', 0)}
      </span>
    )
  }
  return (
    <span className="notification-component">
      <button onClick={e => handleTogglePane(e)}>
        <span className="notification-label" onClick={handleTogglePane}>
          <BellSvg />
        </span>
        {renderBadge()}
      </button>
    </span>
  )
}

export default NotificationComponent
