import React from 'react'
import { useStore } from 'react-redux'

const SectionAmazon = () => {
  const store = useStore().getState()

  const { auth: { user } } = store

  let initials = ''
  if (user && Object.keys(user).length) {
    initials = (user.firstname || '').charAt(0).toUpperCase()
      + (user.lastname || '').charAt(0).toUpperCase()
  }

  return (
    <div className="page-section">
      <div className="section-title">Amazon Account</div>
      <div className="section-contents section-amazon">
        <span className="initials-display">
          { initials }
        </span>
        <div className="account-info">
          <div>{ user?.firstname } { user?.lastname }</div>
          <div>{ user?.email }</div>
        </div>
        <button type="button" className="btn btn-white">
          +
        </button>
      </div>
    </div>
  )
}

export default SectionAmazon
