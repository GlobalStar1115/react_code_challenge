import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { watch } from '../../redux/actions/tutorial'

import {
  COIN_TYPE_FLOW_QUICK_RESULTS,
  COIN_TYPE_FLOW_SMART_PILOT,
} from '../../utils/constants/coin'

import MainLayout from '../../layout/MainLayout'
import QuickStartFlow from './QuickStartFlow'
import GrowBusinessFlow from './GrowBusinessFlow'
import SmartPilotFlow from './SmartPilotFlow'
import TargetResearchFlow from './TargetResearchFlow'
import ExpansionBasicFlow from './ExpansionBasicFlow'
import BulkOverviewFlow from './BulkOverviewFlow'
import ProductDashboardFlow from './ProductDashboardFlow'
import MoreMarginFlow from './MoreMarginFlow'
import EntourPlaybookSeries from './EntourPlaybookSeries'
import SPAds from './SPAds'
import SBAds from './SBAds'
import SBVAds from './SBVAds'
import SDAds from './SDAds'

const flowList = [
  { key: COIN_TYPE_FLOW_QUICK_RESULTS, component: QuickStartFlow },
  { key: COIN_TYPE_FLOW_SMART_PILOT, component: SmartPilotFlow },
  { key: 'flow_grow_business', component: GrowBusinessFlow },
  { key: 'keyword_target_research', component: TargetResearchFlow },
  { key: 'expansion_basic', component: ExpansionBasicFlow },
  { key: 'bulk_engine_overview', component: BulkOverviewFlow },
  { key: 'product_dashboard', component: ProductDashboardFlow },
  { key: 'more_margin', component: MoreMarginFlow },
  { key: 'entourage_playbook_series', component: EntourPlaybookSeries },
  { key: 'sp_ads', component: SPAds },
  { key: 'sb_ads', component: SBAds },
  { key: 'sbv_ads', component: SBVAds },
  { key: 'sd_ads', component: SDAds },
]

const TutorialPage = () => {
  const dispatch = useDispatch()
  const [activeFlow, setActiveFlow] = useState()

  const handleToggle = (key) => {
    setActiveFlow(activeFlow === key ? '' : key)
  }

  // After watched all videos belong to a specific flow, earn coins.
  const handleWatch = (key) => {
    dispatch(watch(key))
  }

  return (
    <MainLayout>
      <div className="tutorial-page">
        <div className="page-header">
          <div className="page-title">Tutorial</div>
        </div>
        <div className="page-content">
          {
            flowList.map(flow => (
              <flow.component
                key={flow.key}
                active={activeFlow === flow.key}
                onToggle={() => { handleToggle(flow.key) }}
                onWatch={() => { handleWatch(flow.key) }}
              />
            ))
          }
        </div>
      </div>
    </MainLayout>
  )
}

export default TutorialPage
