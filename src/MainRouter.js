import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

// Pages
import Dashboard from './pages/Dashboard'
import Campaign from './pages/Campaign'
import BulkEditor from './pages/BulkEditor'
import AccountHealth from './pages/AccountHealth'
import Setting from './pages/Setting'
import Tutorial from './pages/Tutorial'
import Marketplace from './pages/Marketplace'
import ActivityLog from './pages/ActivityLog'
import CampaignDetailComponent from './components/CampaignDetailComponent'

import {
  checkAuth
} from './redux/actions/auth'

const MainRouter = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()

  const { auth } = store
  const { isLoggedIn } = auth

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(checkAuth())
    }
  }, [isLoggedIn, dispatch])

  return (
    <div className="main">
      <Switch>
        <Redirect
          from="/"
          to='/login'
          exact
        />
        <Route
          path='/dashboard'
          component={Dashboard}
        />
        <Route
          path='/campaigns'
          component={Campaign}
        />
        <Route
          path='/bulk-engine'
          component={BulkEditor}
        />
        <Route
          path='/account-health'
          component={AccountHealth}
        />
        <Route
          path='/settings'
          component={Setting}
        />
        <Route
          path='/tutorial'
          component={Tutorial}
        />
        <Route
          path='/marketplace'
          component={Marketplace}
        />
        <Route
          path='/activity-log'
          component={ActivityLog}
        />
        <Route
          path="/campaign/:id"
          component={CampaignDetailComponent}
          exact
        />
      </Switch>
    </div>
  )
}

export default MainRouter
