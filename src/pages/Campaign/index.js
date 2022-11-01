import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import MainLayout from '../../layout/MainLayout'

// components
import CampaignsComponent from '../../components/CampaignsComponent'
import SPCampaignCreator from '../../components/CampaignCreator/SPCampaignCreator'
import SDCampaignCreator from '../../components/CampaignCreator/SDCampaignCreator'

const CampaignPage = () => {
  const match = useRouteMatch()

  return (
    <MainLayout>
      <Switch>
        <Route
          path={`${match.url}/`}
          component={CampaignsComponent}
          exact
        />
        <Route
          path={`${match.url}/new/sp`}
          component={SPCampaignCreator}
          exact
        />
        <Route
          path={`${match.url}/new/sd`}
          component={SDCampaignCreator}
          exact
        />
      </Switch>
    </MainLayout>
  );
}

export default CampaignPage
