import React from 'react'
import Select from 'react-select'
import { useLocation } from 'react-router-dom'

import { SP_APP_ID, SP_BETA } from '../../config/api'

import { ReactComponent as CheckSvg } from '../../assets/svg/check.svg'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'

const sellerCentralUrls = {
  us: 'https://sellercentral.amazon.com',
  ca: 'https://sellercentral.amazon.ca',
  mx: 'https://sellercentral.amazon.com.mx',
  br: 'https://sellercentral.amazon.com.br',

  gb: 'https://sellercentral-europe.amazon.com',
  es: 'https://sellercentral-europe.amazon.com',
  fr: 'https://sellercentral-europe.amazon.com',
  nl: 'https://sellercentral.amazon.nl',
  de: 'https://sellercentral-europe.amazon.com',
  it: 'https://sellercentral-europe.amazon.com',
  se: 'https://sellercentral.amazon.se',
  pl: 'https://sellercentral.amazon.pl',
  tr: 'https://sellercentral.amazon.com.tr',
  ae: 'https://sellercentral.amazon.ae',
  in: 'https://sellercentral.amazon.in',

  jp: 'https://sellercentral.amazon.co.jp',
  au: 'https://sellercentral.amazon.com.au',
  sg: 'https://sellercentral.amazon.sg',
}

const AmazonSection = ({ isLoading, spRefreshToken, adRefreshToken, country, countryList, onChange }) => {
  const location = useLocation()

  const renderContents = () => {
    if (spRefreshToken && adRefreshToken) {
      return (
        <span className="amazon-all-set-label">
          All set
          <CheckSvg />
        </span>
      )
    }

    const qs = new URLSearchParams(location.search)
    const callbackUrl = qs.get('amazon_callback_uri')

    if (isLoading || callbackUrl || spRefreshToken || adRefreshToken) {
      return <LoaderComponent />
    }

    let url = `${sellerCentralUrls[country.value]}/apps/authorize/consent?application_id=${SP_APP_ID}`
    if (SP_BETA) {
      url = `${url}&version=beta`
    }
    return (
      <div className="country-selector">
        <label>
          Choose Country
        </label>
        <Select
          className="country-list"
          value={country}
          options={countryList}
          onChange={onChange}
        />
        <a href={url} className="btn btn-blue">
          Grant Access
        </a>
      </div>
    )
  }

  return (
    <div className="signup-section">
      <div className="section-name">
        Amazon Integration
      </div>
      { renderContents() }
    </div>
  )
}

export default AmazonSection
