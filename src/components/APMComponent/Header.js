// Smart pilot manager pane header.
import React from 'react'
import { Toggle } from 'rsuite'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import { ReactComponent as VideoSvg } from '../../assets/svg/video.svg'

import CampaignInfo from './CampaignInfo'
import AdgroupSelector from './AdgroupSelector'
import TabSelector from './TabSelector'

const Header = (props) => {
  const { campaign, settings, isCampaignSelectorVisible, tabList, activeTab,
    onChange, onAdgroupSelect, onSetActiveTab, onTurnOnOff, onClose } = props

  let isAutoSP = false
  if (campaign) {
    isAutoSP = campaign.basic[0].type === 'sp'
      && campaign.basic[0].targeting_type === 'auto'
  }

  const level = settings.adgroup_id === null || settings.adgroup_id === 0 ? 'Campaign' : 'Ad group'

  return (
    <div className="top-container">
      <div className="pane-header">
        <div className="left-column">
          <span className="pane-title">
            Edit Smart Pilot
          </span>
          <Toggle
            checked={settings.is_active}
            checkedChildren={`${level} level on`}
            unCheckedChildren={`${level} level off`}
            onChange={(checked) => { onTurnOnOff(checked ? 'on' : 'off') }}
          />
        </div>
        <div className="right-column">
          <span className="tutorial-link">
            <VideoSvg />
            Watch tutorials
          </span>
          <CloseSvg className="close-button" onClick={onClose} />
        </div>
      </div>
      <CampaignInfo
        campaign={campaign}
        settings={settings}
        onChange={onChange}
      />
      {
        !isCampaignSelectorVisible && (
          <AdgroupSelector
            campaign={campaign}
            settings={settings}
            onChange={onAdgroupSelect}
          />
        )
      }
      {
        !isCampaignSelectorVisible && !isAutoSP && (
          <TabSelector
            tabList={tabList}
            activeTab={activeTab}
            onSetActiveTab={onSetActiveTab}
          />
        )
      }
    </div>
  )
}

export default Header
