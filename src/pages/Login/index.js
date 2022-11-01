import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'

import { doLogin } from '../../redux/actions/auth'

import EmailSvg from '../../assets/svg/login/email.svg'
import LockSvg from '../../assets/svg/login/lock.svg'
import AmazonSvg from '../../assets/svg/login/amazon.svg'
import PilotSvg from '../../assets/svg/login/pilot.svg'

import AuthSideComponent from '../../components/AuthSideComponent'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

const LoginPage = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { isLoggedIn, isLoading } = store.getState().auth

  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  const onLogin = (event) => {
    event.preventDefault()

    dispatch(doLogin({
      email,
      pwd
    })).catch(() => {
      toast.show({
        title: 'Danger',
        description: 'Incorrect email or password.',
      })
    })
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const onPwdChange = (e) => {
    setPwd(e.target.value)
  }

  if (isLoggedIn) {
    return (
      <Redirect
        to={`${process.env.PUBLIC_URL}/dashboard`}
      />
    )
  }

  return (
    <div className="auth-layout">
      <AuthSideComponent>
        <img src={PilotSvg} alt="Smart Pilot Manager" />
        <div className="side-pilot-title">Smart Pilot Manager</div>
        <div>
          Now with customizable templates, the all new Smart Pilot allows you
          to make smarter and faster bid optimizations.
        </div>
      </AuthSideComponent>
      <div className={`auth-page${isLoading ? ' loading' : ''}`}>
        {isLoading && <LoaderComponent />}
        <form className="auth-form" onSubmit={onLogin}>
          <div className="form-title">
            Welcome back
          </div>
          <div className="form-note">
            Don't have an account yet?&nbsp;
            <Link to="/signup">Sign up to Entourage</Link>
          </div>
          <div className="login-email">
            <img src={EmailSvg} alt="email" />
            <input className="login-input-email" placeholder="Email Address" value={email} onChange={onEmailChange} />
          </div>
          <div className="login-password">
            <img src={LockSvg} alt="locked" />
            <input className="login-input-password" type="password" placeholder="Password" value={pwd} onChange={onPwdChange} />
          </div>
          <button type="submit" className="btn btn-red" disabled={isLoading}>
            Login
          </button>
          <div className="login-or-hr">
            OR
          </div>
          <div className="login-btn-amazon">
            <img src={AmazonSvg} alt="amazon" />
            <span>Login with Amazon</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
