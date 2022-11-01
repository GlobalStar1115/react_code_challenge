import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'rsuite'

import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import { changeUserInfo } from '../../redux/actions/auth'

const SectionGeneral = () => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const { auth: { user } } = store

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Popuplate user info.
  useEffect(() => {
    if (!user || !Object.keys(user).length) {
      return
    }
    setFirstName(user.firstname)
    setLastName(user.lastname)
    setEmail(user.email)
  }, [user])

  const handleSave = () => {
    if (!firstName) {
      toast.show({
        title: 'Warning',
        description: 'Please enter your first name.',
      })
      return
    }

    if (!lastName) {
      toast.show({
        title: 'Warning',
        description: 'Please enter your last name.',
      })
      return
    }

    if (!email) {
      toast.show({
        title: 'Warning',
        description: 'Please enter your email.',
      })
      return
    }

    setShowPasswordModal(true)
  }

  const handleSaveWithPassword = () => {
    setShowPasswordModal(false)
    setIsSaving(true)
    dispatch(changeUserInfo({
      password,
      firstName,
      lastName,
      email,
    })).then(() => {
      setIsSaving(false)
    })
  }

  return (
    <div className={`page-section${isSaving ? ' loading' : ''}`}>
      { isSaving && <LoaderComponent /> }
      <div className="section-title">General Info</div>
      <div className="section-contents section-general">
        <div className="field-wrapper">
          <label>First name</label>
          <input
            type="text"
            required
            value={firstName}
            onChange={e => { setFirstName(e.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>Last name</label>
          <input
            type="text"
            required
            value={lastName}
            onChange={e => { setLastName(e.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value) }}
          />
        </div>
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      <Modal className="settings-password-modal" backdrop="static" show={showPasswordModal} size="xs">
        <Modal.Body>
          <p>
            To update the user information, you need to enter your password.
          </p>
          <input
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(event) => { setPassword(event.target.value) }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="rs-btn rs-btn-primary"
            disabled={password === ''}
            onClick={handleSaveWithPassword}
          >
            Save
          </button>
          <button type="button" className="rs-btn rs-btn-subtle" onClick={() => { setShowPasswordModal(false) }}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default SectionGeneral
