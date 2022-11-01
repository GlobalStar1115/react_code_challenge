import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useLocation, Redirect, useHistory } from 'react-router-dom'
import { Modal } from 'rsuite'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import moment from 'moment'

import { SP_BETA, SP_REDIRECT_URI, LOGIN_CLIENT_ID, STRIPE_PUB_KEY } from '../../config/api'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import { signupSPCode, signupADCode, signup, doLogin } from '../../redux/actions/auth'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import CheckboxComponent from '../../components/CommonComponents/CheckboxComponent'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import ProfileSection from './ProfileSection'
import AmazonSection from './AmazonSection'
import BillingSection from './BillingSection'

// Key to sessionStorage to keep the app state.
const STORAGE_KEY_STATE = 'sp_state'

const countryList = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany (Deutschland)' },
  { value: 'in', label: 'India' },
  { value: 'it', label: 'Italy (Italia)' },
  { value: 'jp', label: 'Japan' },
  { value: 'mx', label: 'Mexico (México)' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'sg', label: 'Singapore' },
  { value: 'es', label: 'Spain (España)' },
  { value: 'se', label: 'Sweden' },
  { value: 'tr', label: 'Turkey' },
  { value: 'ae', label: 'United Arab Emirates (U.A.E.)' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
]

const SignupComplete = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const store = useStore().getState()
  const stripe = useStripe()
  const elements = useElements()

  const { auth: {
    isLoggedIn,
    signupBasicInfo,
    isSPCodeGetting,
    spRefreshToken,
    isADCodeGetting,
    adRefreshToken,
  } } = store

  const [profile, setProfile] = useState({
    phone: '',
    birthday: null,
  })
  const [country, setCountry] = useState(countryList[countryList.length - 1])
  const [billing, setBilling] = useState({
    firstName: signupBasicInfo ? signupBasicInfo.firstName : '',
    lastName: signupBasicInfo ? signupBasicInfo.lastName : '',
  })
  const [buyUpsell, setBuyUpsell] = useState(false)
  const [isSigning, setIsSigning] = useState(false)

  // Inject Amazon LWA script.
  useState(() => {
    let amazonRoot = document.getElementById('amazon-root')
    if (!amazonRoot) {
      amazonRoot = document.createElement('div')
      amazonRoot.setAttribute('id', 'amazon-root')
      document.body.appendChild(amazonRoot)

      const script = document.createElement('script')
      script.setAttribute('type', 'text/javascript')
      script.innerHTML = `
        window.onAmazonLoginReady = function() {
          amazon.Login.setClientId('${LOGIN_CLIENT_ID}');
        };
        (function(d) {
          var a = d.createElement('script'); a.type = 'text/javascript';
          a.async = true; a.id = 'amazon-login-sdk';
          a.src = 'https://assets.loginwithamazon.com/sdk/na/login1.js';
          d.getElementById('amazon-root').appendChild(a);
        })(document);
      `
      document.body.appendChild(script)
    }
  }, [])

  // Respond to Amazon returns.
  useState(() => {
    const qs = new URLSearchParams(location.search)
    const callbackUrl = qs.get('amazon_callback_uri')
    const spCode = qs.get('spapi_oauth_code')
    const code = qs.get('code')

    if (callbackUrl) {
      // After authorizing our app, users are redirected to another page
      // to get the LWA (Login with Amazon) code.
      const amazonState = qs.get('amazon_state')
      const state = (new Date()).valueOf()
      // Save state to sessionStorage for later validation.
      window.sessionStorage.setItem(STORAGE_KEY_STATE, state)
      let url = `${callbackUrl}?redirect_uri=${encodeURI(SP_REDIRECT_URI)}&amazon_state=${amazonState}&state=${state}`
      if (SP_BETA) {
        url = `${url}&version=beta`
      }
      window.location.href = url
    } else if (spCode) {
      let state = qs.get('state')
      const savedState = window.sessionStorage.getItem(STORAGE_KEY_STATE)
      if (state === savedState && !isSPCodeGetting) {
        window.sessionStorage.removeItem(STORAGE_KEY_STATE)

        dispatch(signupSPCode(spCode)).then(() => {
          if (typeof window.amazon === 'undefined') {
            return
          }

          state = (new Date()).valueOf()
          // Save state to sessionStorage for later validation.
          window.sessionStorage.setItem(STORAGE_KEY_STATE, state)

          window.amazon.Login.authorize({
            scope: [
              'profile',
              'profile:user_id',
              // 'cpc_advertising:campaign_management',
            ],
            response_type: 'code',
            popup: false,
            state,
          }, `${window.location.origin}${window.location.pathname}`)
        }).catch((error) => {
          toast.show({
            title: 'Danger',
            description: error,
          })
        })
      }
    } else if (code) {
      let state = qs.get('state')
      const savedState = window.sessionStorage.getItem(STORAGE_KEY_STATE)
      if (state === savedState && !isADCodeGetting) {
        window.sessionStorage.removeItem(STORAGE_KEY_STATE)

        const redirectUri = `${window.location.origin}${window.location.pathname}`
        dispatch(signupADCode(code, redirectUri)).catch((error) => {
          toast.show({
            title: 'Danger',
            description: error,
          })
        })
      }
    }
  }, [])

  if (isLoggedIn) {
    return (
      <Redirect to={`${process.env.PUBLIC_URL}/dashboard`} />
    )
  }

  // If user skipped the first step and directly came here,
  // go back to the first step.
  if (!signupBasicInfo) {
    return (
      <Redirect to={`${process.env.PUBLIC_URL}/signup`} />
    )
  }

  const handleProfileChange = (name, value) => {
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBillingChange = (name, value) => {
    setBilling(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleComplete = async () => {
    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)

    setIsSigning(true)
    const { token, error } = await stripe.createToken(cardElement, {
      name: `${billing.firstName} ${billing.lastName}`,
    })

    if (!token) {
      setIsSigning(false)
      toast.show({
        title: 'Danger',
        description: error.message,
      })
      return
    }

    dispatch(signup({
      firstName: signupBasicInfo.firstName,
      lastName: signupBasicInfo.lastName,
      email: signupBasicInfo.email,
      password: signupBasicInfo.password,
      phone: profile.phone,
      birthday: profile.birthday ? moment(profile.birthday).format('YYYY-MM-DD') : null,
      country: country.value,
      adRefreshToken,
      spRefreshToken,
      billingFirstName: billing.firstName,
      billingLastName: billing.lastName,
      stripeToken: token.id,
      buyUpsell,
    })).then(() => {
      dispatch(doLogin({
        email: signupBasicInfo.email,
        pwd: signupBasicInfo.password,
      })).then(() => {
        setIsSigning(false)
        history.push('/tutorial')
      })
    }).catch((error) => {
      setIsSigning(false)
      toast.show({
        title: 'Danger',
        description: error,
      })
    })
  }

  const isFilled = spRefreshToken
    && adRefreshToken
    && billing.firstName
    && billing.lastName
    && !isSigning

  return (
    <div className="signup-complete-page">
      <Modal backdrop="static" show size="sm" className="signup-complete-modal">
        <Modal.Header closeButton={false}>
          <Modal.Title>
            Final Step: Connect with Amazon and Create Your Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { isSigning && <LoaderComponent /> }
          <div className="modal-description">
            <InfoSvg />
            Trusted by thousands of sellers. Money Back Guarantee. Cancel anytime.
          </div>
          <AmazonSection
            isLoading={isSPCodeGetting || isADCodeGetting}
            spRefreshToken={spRefreshToken}
            adRefreshToken={adRefreshToken}
            country={country}
            countryList={countryList}
            onChange={setCountry}
          />
          <ProfileSection
            profile={profile}
            onChange={handleProfileChange}
          />
          <BillingSection
            billing={billing}
            onChange={handleBillingChange}
          />
          <div className="upsell-section">
            <CheckboxComponent
              label="YES, Add One Time Coaching Offer for $97"
              checked={buyUpsell}
              onChange={setBuyUpsell}
            />
            <div className="upsell-contents">
              <div className="upsell-header">
                One Time Offer
              </div>
              <div className="upsell-description">
                Take advantage of our huge one-time discount for new Entourage members
                and become a part of our advanced coaching program for only&nbsp;
                <span className="upsell-price">$97 (normal price $197).</span>
              </div>
              <div className="upsell-warning">
                After you leave this page, you will never see this offer again.
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="rs-btn rs-btn-primary"
            disabled={!isFilled}
            onClick={handleComplete}
          >
            Start My Free Trial
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

const WrapperWithStripe = (props) => {
  const [stripePromise, setStripePromise] = useState(null)

  useEffect(() => {
    setStripePromise(loadStripe(STRIPE_PUB_KEY))
  }, [])

  return (
    <Elements stripe={stripePromise}>
      <SignupComplete {...props} />
    </Elements>
  )
}

export default WrapperWithStripe
