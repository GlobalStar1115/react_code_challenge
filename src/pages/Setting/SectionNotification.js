import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'

import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import CheckboxComponent from '../../components/CommonComponents/CheckboxComponent'

import { saveNotification } from '../../redux/actions/auth'

const alertList = [
  { label: 'Monthly', value: 'monthly_alert' },
  { label: 'Weekly', value: 'weekly_alert' },
  { label: 'Additional', value: 'additional_alert' },
]

const SectionNotification = () => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const { header: { selectedUserInfo } } = store

  const [alertSettings, setAlertSettings] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  // Load current settings.
  useEffect(() => {
    if (!Object.keys(selectedUserInfo).length) {
      return
    }

    const { monthly_alert, weekly_alert, additional_alert } = selectedUserInfo
    setAlertSettings({
      monthly_alert,
      weekly_alert,
      additional_alert,
    })
  }, [selectedUserInfo])

  const handleChange = value => (checked) => {
    const newSettings = { ...alertSettings }
    newSettings[value] = checked ? 1 : 0
    setAlertSettings(newSettings)
  }

  const handleSave = () => {
    const { monthly_alert, weekly_alert, additional_alert } = alertSettings
    setIsSaving(true)
    dispatch(saveNotification({
      monthlyAlert: monthly_alert || 0,
      weeklyAlert: weekly_alert || 0,
      additionalAlert: additional_alert || 0,
    })).then(() => {
      setIsSaving(false)
    })
  }

  return (
    <div className={`page-section${isSaving ? ' loading' : ''}`}>
      { isSaving && <LoaderComponent /> }
      <div className="section-title">Notifications</div>
      <div className="section-note">Mark notifications that you would like to receive</div>
      <div className="section-contents section-notification">
        {
          alertList.map(({ label, value }) => (
            <CheckboxComponent
              key={value}
              label={label}
              checked={alertSettings[value] || 0}
              onChange={handleChange(value)}
            />
          ))
        }
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default SectionNotification
