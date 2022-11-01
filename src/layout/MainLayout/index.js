import React from 'react'
import { useStore } from 'react-redux'

import HeaderComponent from '../../components/HeaderComponent'
import SideMenuComponent from '../../components/SideMenuComponent'
import CallComponent from '../../components/HeaderComponent/CallComponent'
import CoinPaneComponent from '../../components/CoinPaneComponent'
import NotificationPaneComponent from '../../components/NotificationPaneComponent'

const MainLayout = ({ children }) => {
  const store = useStore().getState()
  const { dashboard, pageGlobal } = store
  const { maxTable } = dashboard
  const { showColumnEditor, showTableFilter, showAPM, showANP, showAEP,
    showExistingModal, showCoinPane, showNotificationPane } = pageGlobal

  const needOverlay = showColumnEditor
    || showTableFilter
    || showAPM
    || showANP
    || showAEP
    || showExistingModal
    || showCoinPane
    || showNotificationPane

  return (
		<div className="main-layout">
      { !maxTable && <SideMenuComponent /> }
      <div className="main-content">
        <HeaderComponent />
        <CallComponent />
        { children }
        { showCoinPane && <CoinPaneComponent /> }
        { showNotificationPane && <NotificationPaneComponent /> }
      </div>
      { needOverlay && <div className="overlay"></div> }
		</div>
  )
}

export default MainLayout
