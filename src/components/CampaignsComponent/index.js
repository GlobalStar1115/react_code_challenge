import React from 'react'
import { useHistory } from "react-router-dom";

import DashboardTableComponent from '../DashboardTableComponent'

const CampaignsComponent = () => {
  const history = useHistory()

  const onNewCampaign = () => {
    history.push('/campaigns/new/sp')
  }

  return (
    <div className="campaign-page">
      <div className="page-header">
        <div className="page-title">Command Center</div>
        <div className="page-header-buttons">
          <button type="button" className="page-header-button-new" onClick={ onNewCampaign }>+ New</button>
        </div>
      </div>
      <div className="page-content">
        <DashboardTableComponent />
      </div>
    </div>
  );
}

export default CampaignsComponent
