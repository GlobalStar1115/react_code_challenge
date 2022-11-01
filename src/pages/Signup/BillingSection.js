import React from 'react'
import { CardElement } from '@stripe/react-stripe-js'

import CreditCardImage from '../../assets/img/credit-cards.png'

const BillingSection = ({ billing, onChange }) => {
  return (
    <div className="signup-section">
      <div className="section-name billing-section-name">
        Billing Information
        <img src={CreditCardImage} className="credit-card-image" alt="credit cards" />
      </div>
      <div className="field-row">
        <div className="field-wrapper">
          <label>Name on a card</label>
          <div className="input-pair">
            <input
              type="text"
              placeholder="First Name"
              value={billing.firstName}
              onChange={(event) => { onChange('firstName', event.target.value) }}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={billing.lastName}
              onChange={(event) => { onChange('lastName', event.target.value) }}
            />
          </div>
        </div>
      </div>
      <CardElement
        className="stripe-wrapper"
        options={{
          style: {
            base: {
              fontSize: '14px',
            },
          },
        }}
      />
    </div>
  )
}

export default BillingSection
