/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'

import { ReactComponent as HomeSvg } from '../../assets/svg/home.svg'
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg'

import {
  getAllAccount,
  getCurrencyRate,
  setSelectedUserInfo,
  setCurrencyInfo,
} from '../../redux/actions/header'

import {
  loadOutOfBudgetLog,
} from '../../redux/actions/campaignLog'

import { currencyList } from '../../utils/constants/defaultValues'

import CoinComponent from './CoinComponent'
import NotificationComponent from './NotificationComponent'

const getAccountLabel = (account) => {
  if (!account) {
    return 'N/A'
  }

  const country = (account.country_id || 'N/A').toUpperCase()
  let brandName
  if (account.brand_name) {
    brandName = account.brand_name
  } else {
    brandName = account.sellerid || 'N/A'
  }
  return `${country} - ${brandName}`
}

const HeaderComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const history = useHistory()

  const {
    header: {
      currentUserId,
      selectedUserInfo,
      listAccounts,
      currencyRateList,
      isInitialDataLoaded,
    },
    auth: {
      isLoggedIn,
      user,
    },
  } = store

  const [currenctCurrency, setCurrentCurrency] = useState({
    text: 'USD',
    sign: '$',
    flag: 'flag-us',
    code: 'us'
  })

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [calcCurrencyRateList, setCalcCurrencyRateList] = useState({})

  if (!isLoggedIn) {
    history.push('/login')
  }

  useEffect(() => {
    if (!currentUserId || currentUserId === '' || isInitialDataLoaded) {
      return
    }
    dispatch(getAllAccount({ userId: currentUserId }))
    dispatch(getCurrencyRate())
    dispatch(loadOutOfBudgetLog())
  }, [currentUserId]) // eslint-disable-line

  useEffect(() => {
    if (!selectedUserInfo || Object.keys(selectedUserInfo).length === 0) {
      return
    }
    setSelectedAccount(selectedUserInfo)
  }, [selectedUserInfo])

  useEffect(() => {
    if (!currencyRateList || Object.keys(currencyRateList).length === 0) {
      return
    }

    calculateCurrenyRateList('USD')
  }, [currencyRateList]) // eslint-disable-line

  useEffect(() => {
    if (!listAccounts.length) {
      return
    }

    listAccounts.forEach(account => {
      if (parseInt(account.user, 10) === parseInt(currentUserId, 10)
        && parseInt(selectedUserInfo.user || 0, 10) !== parseInt(currentUserId, 10)) {
        const accountCurrency = currencyList.filter(currency => currency.code === account.country_id)[0]
        const accountInfo = {
          ...account,
          baseCurrency: accountCurrency.text,
          currency: accountCurrency,
          user: account.user,
          country_id: account.country_id,
          createdat: account.createdat,
          sellerid: account.sellerid,
          plan_id: account.plan_id,
          label: account.country_id + ' - ' + (account.brand_name || account.sellerid),
          average_acos: account.average_acos,
          average_profit: account.average_profit,
          account_type :account.account_type,
        }
        dispatch(setSelectedUserInfo(accountInfo))
      }
    })
  }, [listAccounts]) // eslint-disable-line

  // calcuate the rate with base currency
  const calculateCurrenyRateList = (baseCurrency) => {
    let calculatedResult = { ...currencyRateList }
    if (baseCurrency !== 'EUR') {
      const baseToEur = parseFloat(calculatedResult.rates[baseCurrency])
      calculatedResult.base = baseCurrency
      Object.keys(calculatedResult.rates).forEach(rate => calculatedResult.rates[rate] = parseFloat(calculatedResult.rates[rate] / baseToEur))
    }
    setCalcCurrencyRateList(calculatedResult)
    return calculatedResult
  }

  const handleCurrencyChange = (e, selectedCurrency) => {
    e.preventDefault()
    setCurrentCurrency(selectedCurrency)

    let accountCurrencyCode = currencyList.filter(currency => (
      currency.code === selectedUserInfo.country_id
    ))[0].text

    let isDefaultCurrency = selectedCurrency.text === accountCurrencyCode

    let calculatedResult = calcCurrencyRateList
    if (!isDefaultCurrency) {
      calculatedResult = calculateCurrenyRateList(accountCurrencyCode)
    }
    selectedUserInfo.currency = selectedCurrency

    const currencyData = {
      currencyRate: isDefaultCurrency ? 1 : calculatedResult.rates[selectedCurrency.text],
      currencySign: selectedCurrency.sign
    }
    dispatch(
      setCurrencyInfo(currencyData)
    )
  }

  const handleAccountChange = (e, account) => {
    e.preventDefault()
    const accountCurrency = currencyList.filter(currency => currency.code === account.country_id)[0]
    const accountInfo = {
      ...account,
      baseCurrency: accountCurrency.text,
      currency: accountCurrency,
      user: account.user,
      country_id: account.country_id,
      createdat: account.createdat,
      sellerid: account.sellerid,
      plan_id: account.plan_id,
      label: account.country_id + ' - ' + (account.brand_name || account.sellerid),
      average_acos: account.average_acos,
      average_profit: account.average_profit,
      account_type :account.account_type,
    }
    dispatch(setSelectedUserInfo(accountInfo))
  }

  const renderAccounts = () => {
    return listAccounts.map(account => (
      <a
        key={account.user}
        href="#"
        onClick={e => handleAccountChange(e, account)}
      >
        { getAccountLabel(account) }
      </a>
    ))
  }

  let initials = ''
  if (user && Object.keys(user).length) {
    initials = (user.firstname || '').charAt(0).toUpperCase()
      + (user.lastname || '').charAt(0).toUpperCase()
  }

  return (
    <div className="header-component">
      <div className="header-left">
        <Link to="/dashboard">
          <HomeSvg />
        </Link>
      </div>
      <div className="header-right">
        <CoinComponent />
        <div className="currency dropdown">
          <button className="dropdown-toggle">
            <span className={`flag ${currenctCurrency.flag}`}>&nbsp;</span>
            <span className="value-text">{currenctCurrency.text}</span>
            <span className="value-text">{currenctCurrency.sign}</span>
          </button>
          <div className="dropdown-content">
            {currencyList.map((currency, ind) =>
              <a href="#" key={ind} onClick={e => handleCurrencyChange(e, currency)}>
                <span className={`flag ${currency.flag}`}>&nbsp;</span>
                <span className="value-text">{currency.text}</span>
                <span className="value-text">{currency.sign}</span>
              </a>
            )}
          </div>
        </div>
        <NotificationComponent />
        <div className="header-avatar">
          <div className="dropdown">
            <button className="dropdown-toggle">
              { getAccountLabel(selectedAccount) }
              <span className="initials-display">
                { initials }
              </span>
              <ArrowDown />
            </button>
            <div className="dropdown-content">
              { renderAccounts() }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderComponent
