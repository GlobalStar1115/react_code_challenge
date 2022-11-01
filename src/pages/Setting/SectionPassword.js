import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import { changePassword } from '../../redux/actions/auth'

const SectionPassword = () => {
  const dispatch = useDispatch()

  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    if (!oldPwd || !newPwd) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the current password and new password.',
      })
      return
    }

    setIsSaving(true)
    dispatch(changePassword({
      oldpwd: oldPwd,
      newpwd: newPwd,
    })).then(() => {
      setIsSaving(false)
    })
  }

  return (
    <div className={`page-section${isSaving ? ' loading' : ''}`}>
      { isSaving && <LoaderComponent /> }
      <div className="section-title">Security</div>
      <div className="section-contents section-security">
        <input
          type="password"
          placeholder="Current password"
          value={oldPwd}
          onChange={(event) => { setOldPwd(event.target.value) }}
        />
        <input
          type="password"
          placeholder="New password"
          value={newPwd}
          onChange={(event) => { setNewPwd(event.target.value) }}
        />
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Change
        </button>
      </div>
    </div>
  )
}

export default SectionPassword
