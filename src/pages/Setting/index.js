import React from 'react'

import MainLayout from '../../layout/MainLayout'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import SectionGeneral from './SectionGeneral'
import SectionAmazon from './SectionAmazon'
import SectionBilling from './SectionBilling'
import SectionPassword from './SectionPassword'
import SectionUniversal from './SectionUniversal'
import SectionNotification from './SectionNotification'

const SettingPage = () => {
  toast.setPosition('bottom-right')

  return (
    <MainLayout>
      <div className="setting-page">
        <div className="page-header">
          <div className="page-title">Account Settings</div>
        </div>
        <div className="page-content">
          <SectionGeneral />
          <SectionAmazon />
          <SectionBilling />
          <SectionPassword />
          <SectionUniversal />
          <SectionNotification />
        </div>
      </div>
    </MainLayout>
  )
}

export default SettingPage
