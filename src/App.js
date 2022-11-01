import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Router, Switch, Route } from 'react-router-dom'
import history from './utils/history'

import './styles/index.scss'

import { appStart } from './redux/actions/app'
import MainRouter from './MainRouter'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SignupComplete from './pages/Signup/SignupComplete'

class App extends Component {
  render() {
    return (
      <Router history={history} >
        <Switch>
          <Route
            path={`${process.env.PUBLIC_URL}/login`}
            component={Login}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/signup`}
            component={Signup}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/signup-complete`}
            component={SignupComplete}
          />
          <Route path="/" component={MainRouter} />
        </Switch>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return state
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ appStart }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)