import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import LoaderComponent from '../../components/CommonComponents/LoaderComponent'

import { getCardList } from '../../redux/actions/auth'

const brandList = {
  visa: 'Visa',
  mastercard: 'MasterCard',
  american_express: 'American Express',
  discover: 'Discover',
  jcb: 'JCB',
  diners_club: 'Diner\'s Club',
}

const statusList = {
  valid: 'Valid',
  expiring: 'Expiring',
  expired: 'Expired',
  invalid: 'Invalid',
  pending_verification: 'Pending Verification',
}

const SectionBilling = () => {
  const dispatch = useDispatch()

  const [isLoading, setIsLoading] = useState(false)
  const [cardList, setCardList] = useState([])

  useEffect(() => {
    setIsLoading(true)
    dispatch(getCardList()).then((response) => {
      setIsLoading(false)
      setCardList(response)
    }).catch(() => {
      setIsLoading(false)
    })
  }, []) // eslint-disable-line

  return (
    <div className={`page-section${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="section-title">Billing</div>
      <div className="section-contents section-billing">
        {
          !isLoading && cardList.length === 0 && (
            <div className="no-card-desc">
              No card information found.
            </div>
          )
        }
        {
          cardList.map(card => (
            <div key={card.id} className="card-wrapper">
              <div className="card-header">
                { brandList[card.card_brand] || 'Other' }
                <span className="card-status">
                  ({ statusList[card.status] })
                </span>
              </div>
              <div className="card-number">
                **** **** **** { card.card_last4 }
              </div>
              <div className="card-info">
                <div className="card-info-field">
                  <div>Cardholder name</div>
                  <div>{ card.card_first_name } { card.card_last_name }</div>
                </div>
                <div className="card-info-field">
                  <div>Expires</div>
                  <div>{ card.card_expiry_month }/{ card.card_expiry_year }</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default SectionBilling
