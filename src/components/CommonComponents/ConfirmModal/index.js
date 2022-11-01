import React, { useState, useEffect } from 'react'
import { Modal } from 'rsuite'

const ConfirmModal = ({ show = false, onConfirm, text = '' }) => {
  const [ showConfirm, setShowConfirm ] = useState(false)

  useEffect(() => {
    if (show === null) {
      return
    }
    setShowConfirm(show)
  }, [show])

  const handleConfirm = (val) => {
    if (!onConfirm) {
      return
    }
    onConfirm(val)
  }
  return (
    <Modal backdrop="static" show={showConfirm} size="xs">
      <Modal.Body>
        { text }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-primary" onClick={() => { handleConfirm(true) }}>
          Yes
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => { handleConfirm(false) }}>
          No
        </button>
      </Modal.Footer>
    </Modal>
  )
}
export default ConfirmModal