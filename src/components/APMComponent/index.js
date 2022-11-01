// Smart pilot manager.
import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'
import moment from 'moment'

import { hideAPMAction } from '../../redux/actions/pageGlobal'
import { getAp, getApAdgroup, saveAp, saveApMultiple, saveTemplate, turnBulk } from '../../redux/actions/ap'
import { getDefaultAPSettings, apSettings as apSettingsTemplate } from '../../services/helper'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import Header from './Header'
import Footer from './Footer'
import OpSection from './OpSection'
import ExSection from './ExSection'
import CampaignSelector from './CampaignSelector'

const TAB_OP = 'op'
const TAB_EX = 'ex'

const tabList = [
  { value: TAB_OP, label: 'Optimization' },
  { value: TAB_EX, label: 'Expansion' },
]

const APMComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    header: { currentUserId },
    ap: { campaignId, isLoading, campaign, isSaving },
  } = store.getState()

  // Current smart pilot settings.
  const [settings, setSettings] = useState(getDefaultAPSettings())

  // Switch between Optimization and Expansion tabs.
  const [activeTab, setActiveTab] = useState(TAB_OP)

  // Whether to display a campaign selector to choose campaigns
  // to apply smart pilot settings.
  const [isCampaignSelectorVisible, setCampaignSelectorVisible] = useState(false)

  const [saveError, setSaveError] = useState(null)

  // Load smart pilot settings.
  useEffect(() => {
    // TODO: If we have a campaign basic information stored in Redux,
    // we can re-use it, instead of running another DB query.
    dispatch(getAp(campaignId))
  }, []) // eslint-disable-line

  // Update local state with loaded settings.
  useEffect(() => {
    if (campaign && campaign.ap) {
      setSettings(campaign.ap)
    }
  }, [campaign]) // eslint-disable-line

  // Change a setting value.
  const onChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Hide APM pane.
  const onClose = () => {
    dispatch(hideAPMAction())
  }

  const onOutsideClick = (event) => {
    // Date range picker renders itself as a popup outside APM pane,
    // causing clicking on it to close APM pane. Below fixes this behavior.
    if (document.getElementsByClassName('rs-picker-daterange-menu').length) {
      if (document.getElementsByClassName('rs-picker-daterange-menu')[0].contains(event.target)) {
        return
      }
    }
    // Modal dialog renders itself as a popup outside APM pane,
    // causing clicking on it to close APM pane. Below fixes this behavior.
    if (document.getElementsByClassName('rs-modal-dialog').length) {
      if (document.getElementsByClassName('rs-modal-dialog')[0].contains(event.target)) {
        return
      }
    }
    if (document.getElementsByClassName('rs-modal-backdrop').length) {
      if (document.getElementsByClassName('rs-modal-backdrop')[0].contains(event.target)) {
        return
      }
    }
    // Toast renders itself as a popup outside APM pane,
    // causing clicking on it to close APM pane. Below fixes this behavior.
    if (document.getElementsByClassName('notification').length) {
      if (document.getElementsByClassName('notification')[0].contains(event.target)) {
        return
      }
    }
    onClose()
  }

  // When selecting an ad group from selector.
  const onAdgroupSelect = (adgroupId, toSave) => {
    if (toSave) {
      onSave()
    }

    dispatch(getApAdgroup({
      campaignId,
      adgroupId,
    }))
  }

  // When clicking on `Apply to multiple campaigns` button.
  const onApplyToMultiple = () => {
    setCampaignSelectorVisible(true)
  }

  // Sanitize settings before saving.
  const _sanitizeSettings = () => {
    setSaveError(null)

    // We already warned you.
    if (parseInt(settings.daily_off_start_hour, 10)
      >= parseInt(settings.daily_off_end_hour, 10)) {
      setSaveError('The end time cannot be behind the start time for Dayparting/Seasonality.')
      return null
    }

    if (parseFloat(settings['increase_adv_percentacos_threshold'])
      > parseFloat(settings['increase_adv_percentbid_byacos_threshold'])) {
      setSaveError('Please enter a valid ACoS range for Unprofitable Targets.')
      return null
    }

    if (parseFloat(settings['copy_increase_adv_percentacos_threshold'])
      > parseFloat(settings['copy_increase_adv_percentbid_byacos_threshold'])) {
      setSaveError('Please enter a valid ACoS range for Unprofitable Targets.')
      return null
    }

    const payload = Object.assign({}, settings, {
      user_id: currentUserId,
      campaign_id: campaignId,
      campaign_name: campaign.basic[0].name,
      time_zone: moment().format('Z'),
    })

    Object.keys(apSettingsTemplate).forEach((setting) => {
      if (apSettingsTemplate[setting].type === 'json_array') {
        // TODO: Do we need to escape values to be query-safe?
        // `filter` method here removes NULL values.
        payload[setting] = JSON.stringify(settings[setting].filter(s => s))
      } else if (apSettingsTemplate[setting].type === 'concat') {
        payload[setting] = settings[setting].join(',')
      } else if (apSettingsTemplate[setting].type === 'date') {
        payload[setting] = settings[setting]
          ? moment(settings[setting]).format() : settings[setting]
      }
    })

    return payload
  }

  // Save smart pilot settings for a given campaign and ad group.
  const onSave = () => {
    const payload = _sanitizeSettings()
    if (payload) {
      dispatch(saveAp(payload)).then(() => {
        onChange('is_active', true)
      })
    }
  }

  // Apply to multiple campaigns.
  const onApply = (campaignIds) => {
    const payload = _sanitizeSettings()
    if (payload) {
      payload.campaignIds = campaignIds
      dispatch(saveApMultiple(payload)).then(() => {
        if (campaignIds.indexOf(campaignId) !== -1) {
          onChange('is_active', true)
        }
      })
    }
  }

  // Save settings as template.
  const onSaveTemplate = (name, needApply) => {
    const payload = _sanitizeSettings()
    if (payload) {
      dispatch(saveTemplate(name, needApply, payload))
    }
  }

  // Turn smart pilot on/off
  const onTurnOnOff = (state) => {
    dispatch(turnBulk([campaignId], state, true)).then(() => {
      onChange('is_active', state === 'on')
    })
  }

  const renderBody = () => {
    if (!isCampaignSelectorVisible) {
      return (
        <>
          <div className="pane-body">
            {
              activeTab === TAB_OP &&
              <OpSection
                campaign={campaign}
                settings={settings}
                onChange={onChange}
              />
            }
            { activeTab === TAB_EX &&
              <ExSection
                campaign={campaign}
                settings={settings}
                onChange={onChange}
              />
            }
          </div>
          <Footer
            settings={settings}
            isLoading={isLoading}
            isSaving={isSaving}
            saveError={saveError}
            onApplyToMultiple={onApplyToMultiple}
            onSave={onSave}
            onSaveTemplate={onSaveTemplate}
            onClose={onClose}
          />
        </>
      )
    }

    return (
      <CampaignSelector
        saveError={saveError}
        onApply={onApply}
        onCancel={() => { setCampaignSelectorVisible(false) }}
      />
    )
  }

  return (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <div className="apm-component">
        { (isLoading || isSaving) && <LoaderComponent /> }
        <Header
          campaign={campaign}
          settings={settings}
          isCampaignSelectorVisible={isCampaignSelectorVisible}
          tabList={tabList}
          activeTab={activeTab}
          onChange={onChange}
          onSetActiveTab={setActiveTab}
          onAdgroupSelect={onAdgroupSelect}
          onTurnOnOff={onTurnOnOff}
          onClose={onClose}
        />
        { renderBody() }
      </div>
    </OutsideClickHandler>
  )
}

export default APMComponent
