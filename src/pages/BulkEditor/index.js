import React, { useState } from 'react'

import MainLayout from '../../layout/MainLayout'

import BulkOptimizationComponent from '../../components/BulkEditorComponent/optimization'
import BulkExpansionComponent from '../../components/BulkEditorComponent/expansion'

import { ReactComponent as VideoSvg } from '../../assets/svg/video.svg'

const BulkEditorPage = () => {
  const [currentTab, setCurrentTab] = useState('optimization')

  const onChangeTab = (tab) => {
    setCurrentTab(tab)
  }

  return (
    <MainLayout>
      <div className="bulk-editor-page">
        <div className="page-header">
          <div className="page-title">Bulk Engine</div>
          <div className="page-header__buttons">
            <VideoSvg />
            <span>Watch tutorials</span>
          </div>
        </div>
        <div className="page-tabs">
          <div className={currentTab === 'optimization' ? "page-tab selected" : "page-tab"} onClick={()=>onChangeTab('optimization')}>Optimization</div>
          <div className={currentTab === 'expansion' ? "page-tab selected" : "page-tab"} onClick={()=>onChangeTab('expansion')}>Expansion</div>
        </div>
        {currentTab === 'optimization' &&
          <BulkOptimizationComponent />
        }
        {currentTab === 'expansion' &&
          <BulkExpansionComponent />
        }
      </div>
    </MainLayout>
  );
}

export default BulkEditorPage
