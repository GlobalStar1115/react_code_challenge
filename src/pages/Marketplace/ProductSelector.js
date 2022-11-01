import React from 'react'

import { ReactComponent as CoachSvg } from '../../assets/svg/market_coach.svg'
import { ReactComponent as BlitzSvg } from '../../assets/svg/market_blitz.svg'
import { ReactComponent as EmsSvg } from '../../assets/svg/market_ems.svg'

const PRODUCT_COACH = 'coach'
const PRODUCT_OP = 'op'
const PRODUCT_EMS = 'ems'

const productList = [
  {
    value: PRODUCT_COACH,
    icon: CoachSvg,
    name: 'Ad Coaching',
    description: 'One on one collaboration with a seasoned ad manager to help you improve your advertising game. Select coaching topics below and let’s get started!',
    buttonLabel: 'Redeem Coins',
    link: 'https://ppcentourage.com/consultation-services/',
  },
  {
    value: PRODUCT_OP,
    icon: BlitzSvg,
    name: 'Optimization Blitz',
    description: 'Have an out of control ACOS with bleeding ad spend? Have one of our experts optimize your account to get it under control!',
    buttonLabel: 'Redeem Coins',
    link: 'https://ppcentourage.com/campaign-optimization-blitz/',
  },
  {
    value: PRODUCT_EMS,
    icon: EmsSvg,
    name: 'Entourage Management Services',
    description: 'Entourage\'s Done-For-You PPC Management will take expert care to maximize your profits at scale, staying current on all the latest strategies and updates so you don\'t have to.',
    buttonLabel: 'Apply Now',
    link: 'https://ppcentourage.com/amazon-ppc-management/',
  },
]

const ProductSelector = ({ selectedProduct, onSelect }) => {
  return (
    <div className="product-selector">
      {
        productList.map(product => (
          <div
            key={product.value}
            className={`product-item${selectedProduct === product.value ? ' selected' : ''}`}
            onClick={() => { onSelect(product.value) }}
          >
            <div className="svg-wrapper">
              <product.icon />
            </div>
            <div className="product-name">
              { product.name }
            </div>
            <div className="product-description">
              { product.description }
            </div>
            <div className="action-wrapper">
              {
                product.value !== PRODUCT_EMS ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-red"
                      onClick={(event) => { event.stopPropagation(); onSelect(product.value, true) }}
                    >
                      { product.buttonLabel }
                    </button>
                    <a href={product.link} target="_blank" rel="noopener noreferrer">
                      Show what{'\''}s included
                    </a>
                  </>
                ) : (
                  <a href={product.link} className="btn btn-red" target="_blank" rel="noopener noreferrer">
                    { product.buttonLabel }
                  </a>
                )
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ProductSelector
