import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import MainLayout from '../../layout/MainLayout'

import DashboardContainerComponent from '../../components/DashboardContainerComponent'
import ProductDetailComponent from '../../components/ProductDetailComponent'

const DashboardPage = () => {
  const match = useRouteMatch()

  return (
    <MainLayout>
      <Switch>
        <Route
          path={`${match.url}/`}
          component={DashboardContainerComponent}
          exact
        />
        <Route
          path={`${match.url}/product/:id/:sku`}
          component={ProductDetailComponent}
          exact
        />
      </Switch>
    </MainLayout>
  );
}

export default DashboardPage
