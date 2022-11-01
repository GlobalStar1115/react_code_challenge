import React from 'react'

const FieldRow = ({ className, disabled, children }) => (
  <div className={`field-row ${disabled ? 'disabled' : ''} ${className || ''}`}>
    { children }
  </div>
)

export default FieldRow
