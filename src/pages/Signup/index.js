import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Redirect, Link, useHistory } from 'react-router-dom'

import { signupBasic } from '../../redux/actions/auth'

import SellerPng from '../../assets/img/seller-ben.png'

import AuthSideComponent from '../../components/AuthSideComponent'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

const SignupPage = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const { auth: { isSigningBasic, isLoggedIn } } = store.getState()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (isLoggedIn) {
    return (
      <Redirect
        to={`${process.env.PUBLIC_URL}/dashboard`}
      />
    )
  }

  const handleSignup = (event) => {
    event.preventDefault()

    if (!firstName) {
      toast.show({
        title: 'Danger',
        description: 'Please enter your first name.',
      })
      return
    }

    if (!lastName) {
      toast.show({
        title: 'Danger',
        description: 'Please enter your last name.',
      })
      return
    }

    if (!email) {
      toast.show({
        title: 'Danger',
        description: 'Please enter your email.',
      })
      return
    }

    if (!password) {
      toast.show({
        title: 'Danger',
        description: 'Please enter your password.',
      })
      return
    }

    dispatch(signupBasic(firstName, lastName, email, password)).then((isValid) => {
      if (!isValid) {
        toast.show({
          title: 'Danger',
          description: 'The email address is already taken.',
        })
      } else {
        history.push('/signup-complete')
      }
    }).catch((error) => {
      toast.show({
        title: 'Danger',
        description: error,
      })
    })
  }

  return (
    <div className="auth-layout">
      <AuthSideComponent>
        <div className="testimonial-wrapper">
          <div className="testimonial-contents">
            “It has my highest, strongest endorsement and recommendation...
            This is the most powerful Amazon Sponsored Ads platform software
            that I have ever come across.”
          </div>
          <div className="testimonial-seller">
            <img src={SellerPng} alt="Ben Cummings" />
            <div className="seller-info">
              <div className="seller-name">
                Ben Cummings
              </div>
              <div className="seller-job">
                Amazon Expert & 7 Figure Seller
              </div>
            </div>
          </div>
        </div>
      </AuthSideComponent>
      <div className={`auth-page${isSigningBasic ? ' loading' : ''}`}>
        { isSigningBasic && <LoaderComponent /> }
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="form-title">
            Create new account
          </div>
          <div className="form-note">
            Already have account?&nbsp;
            <Link to="/login">Log in to Entourage.</Link>
          </div>
          <div className="signup-input-container">
            <input
              type="text"
              placeholder="First Name"
              required
              value={firstName}
              onChange={(event) => { setFirstName(event.target.value) }}
            />
          </div>
          <div className="signup-input-container">
            <input
              type="text"
              placeholder="Last Name"
              required
              value={lastName}
              onChange={(event) => { setLastName(event.target.value) }}
            />
          </div>
          <div className="signup-input-container">
            <input
              type="email"
              placeholder="Email Address"
              required
              autoComplete="off"
              value={email}
              onChange={(event) => { setEmail(event.target.value) }}
            />
          </div>
          <div className="signup-input-container">
            <input
              type="password"
              placeholder="Password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(event) => { setPassword(event.target.value) }}
            />
          </div>
          <button type="submit" className="btn btn-red">
            Create account
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
