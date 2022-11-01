/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation, Link } from 'react-router-dom'

import LogoSvg from '../../assets/svg/logo2.svg'
import LogoSmallSvg from '../../assets/svg/logo-small.svg'

import CampaignSvg from '../../assets/svg/menu-campaign.svg'
import CampaignOnSvg from '../../assets/svg/menu-campaign-on.svg'
import BulkSvg from '../../assets/svg/menu-bulk.svg'
import BulkOnSvg from '../../assets/svg/menu-bulk-on.svg'
import SpotlightSvg from '../../assets/svg/menu-spotlight.svg'
import MarginSvg from '../../assets/svg/menu-margin.svg'
import SettingSvg from '../../assets/svg/menu-setting.svg'
import SettingOnSvg from '../../assets/svg/menu-setting-on.svg'
import HealthSvg from '../../assets/svg/menu-health.svg'
import HealthOnSvg from '../../assets/svg/menu-health-on.svg'
import ActivitySvg from '../../assets/svg/menu-activity.svg'
import ReferralSvg from '../../assets/svg/menu-referral.svg'
import TutorialSvg from '../../assets/svg/menu-tutorial.svg'
import LogoutSvg from '../../assets/svg/menu-logout.svg'
import MarketSvg from '../../assets/svg/menu-market.svg'

import { ReactComponent as CollapseSvg } from '../../assets/svg/menu-collapse.svg'
import { ReactComponent as ExpandSvg } from '../../assets/svg/menu-expand.svg'

import { doLogout } from '../../redux/actions/auth'

const menuList = [
  {
    name: 'Main',
    items: [
      { key: 'campaigns', to: '/campaigns', name: 'Command Center', icon: CampaignSvg, iconActive: CampaignOnSvg },
      { key: 'bulk', to: '/bulk-engine', name: 'Bulk Engine', icon: BulkSvg, iconActive: BulkOnSvg },
      { key: 'spotlight', url: 'https://ppcentourage.com/spotlights/login', name: 'Spotlight', icon: SpotlightSvg },
      { key: 'margins', url: 'https://ppcentourage.com/margins/login', name: 'Margins', icon: MarginSvg },
    ],
  },
  {
    name: 'Account',
    items: [
      { key: 'setting', to: '/settings', name: 'Settings', icon: SettingSvg, iconActive: SettingOnSvg },
      { key: 'health', to: '/account-health', name: 'Health', icon: HealthSvg, iconActive: HealthOnSvg },
      { key: 'log', to: '/activity-log', name: 'Activity Log', icon: ActivitySvg },
      { key: 'referrals', url: 'https://ppcentourage.refersion.com', name: 'Referrals', icon: ReferralSvg },
      { key: 'signout' },
    ],
  },
  {
    name: 'Help',
    items: [
      { key: 'tutorial', to: '/tutorial', name: 'University', icon: TutorialSvg },
      { key: 'marketplace', to: '/marketplace', name: 'Marketplace', icon: MarketSvg },
    ],
  },
]

const SideMenuComponent = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mouseIn, setMouseIn] = useState('')

  const onLogout = (event) => {
    event.preventDefault()
    dispatch(doLogout())
    history.push('/login')
  }

  const renderItem = (item) => {
    if (item.to) {
      return (
        <Link
          key={item.key}
          to={item.to}
          className="side-menu-item"
          onMouseMove={() => { setMouseIn(item.key) }}
          onMouseOut={() => { setMouseIn('') }}>
          <span className="image-wrapper">
            <img
              src={(mouseIn === item.key || location.pathname.includes(item.to)) ? item.iconActive || item.icon : item.icon}
              alt={item.name}
              title={item.name}
            />
          </span>
          <span className="menu-name">{ item.name }</span>
        </Link>
      )
    }

    if (item.url) {
      return (
        <div key={item.key} className="side-menu-item">
          <span className="image-wrapper">
            <img src={item.icon} alt={item.name} title={item.name} />
          </span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" title={item.name}>
            { item.name }
          </a>
        </div>
      )
    }

    if (item.key === 'signout') {
      return (
        <div key={item.key} className="side-menu-item">
          <span className="image-wrapper">
            <img src={LogoutSvg} alt="Sign Out" />
          </span>
          <a href="#" onClick={onLogout} title="Sign Out">
            Sign Out
          </a>
        </div>
      )
    }

    return (
      <div key={item.key} className="side-menu-item">
        <span className="image-wrapper">
          <img src={item.icon} alt={item.name} title={item.name} />
        </span>
        <span className="menu-name">{ item.name }</span>
      </div>
    )
  }

  const renderSubMenu = subMenu => (
    <div key={subMenu.name} className="side-menu-submenu">
      {
        !isCollapsed && (
          <div className="submenu-header">
            { subMenu.name }
          </div>
        )
      }
      <div className="submenu-contents">
        { subMenu.items.map(renderItem) }
      </div>
    </div>
  )

  return (
		<div className={`side-menu-component${!isCollapsed ? '' : ' collapsed'}`}>
      <div className="side-menu-header">
        <Link to="/dashboard">
          <img src={!isCollapsed ? LogoSvg : LogoSmallSvg} alt="PPC Entourage" title="PPC Entourage" />
        </Link>
      </div>
      <div className="side-menu-contents">
        { menuList.map(renderSubMenu) }
      </div>
      <div className="side-menu-footer">
        {
          !isCollapsed
          ? <CollapseSvg title="Collapse" onClick={() => { setIsCollapsed(true) }} />
          : <ExpandSvg title="Expand" onClick={() => { setIsCollapsed(false) }} />
        }
      </div>
		</div>
  )
}

export default SideMenuComponent
