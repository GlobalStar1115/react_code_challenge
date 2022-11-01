import { combineReducers } from 'redux'
import app from './app.js'
import header from './header'
import footer from './footer'
import auth from './auth'
import campaign from './campaign'
import campaignLog from './campaignLog'
import product from './product'
import portfolio from './portfolio'
import dashboard from './dashboard'
import ap from './ap'
import api from './api'
import targeting from './targeting'
import health from './health'
import campaignCreator from './campaignCreator'
import coin from './coin'
import activityLog from './activityLog'
import campaignDetail from './campaignDetail'

import productDetail from './productDetail'
import pageGlobal from './pageGlobal'

const appReducer = combineReducers({
  app,
  header,
  footer,
  auth,
  campaign,
  campaignLog,
  product,
  dashboard,
  portfolio,
  ap,
  api,
  targeting,
  health,
  campaignCreator,
  coin,
  activityLog,
  campaignDetail,
  productDetail,
  pageGlobal,
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer
