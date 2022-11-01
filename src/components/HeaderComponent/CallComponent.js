import React from 'react'
import { useStore, useDispatch } from 'react-redux'
import moment from 'moment'

import { scheduleCall } from '../../redux/actions/tutorial'

import { ReactComponent as CallSvg } from '../../assets/svg/call.svg'

const CALL_LIMIT = 14 // days since sign up.

const CallComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const { user: currentUser } = store.getState().auth

  if (!currentUser.created_at) {
    return null
  }

  const createdTime = moment.utc(currentUser.created_at).local()
  if (moment().diff(createdTime, 'day', true) > CALL_LIMIT) {
    return null
  }

  const handleScheduleClick = () => {
    dispatch(scheduleCall())
  }

  return (
    <div className="call-component">
      <CallSvg />
      <div className="call-text">
        <div className="call-name">
          Call with Roger
        </div>
        <div className="call-description">
          Learn how to slash ACOS and scale faster using Entourage.
        </div>
      </div>
      <a
        href="https://meetings.hubspot.com/roger150/meet-with-roger-from-ppc-entourage"
        className="btn btn-red"
        onClick={handleScheduleClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        Schedule a call
      </a>
    </div>
  )
}

export default CallComponent
