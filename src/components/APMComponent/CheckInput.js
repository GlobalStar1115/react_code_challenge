import React from 'react'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'

const CheckInput = ({ label, field, inputField, suffix = null, settings, onChange }) => {
  const validate = () => {
    if (settings[inputField] === ''
      || isNaN(settings[inputField])
      || parseFloat(settings[inputField]) < 0) {
      onChange(inputField, 0)
    }
  }

  return (
    <div className="field-wrapper">
      <div className="field-name">
        { label }
      </div>
      <div className="check-input-container">
        <CheckboxComponent
          checked={settings[field]}
          onChange={(checked) => { onChange(field, checked) }}
        />
        <input
          type="number"
          min="0"
          disabled={!settings[field]}
          value={settings[inputField]}
          onChange={(event) => { onChange(inputField, event.target.value) }}
          onBlur={validate}
        />
        {
          suffix !== '' && <span className="input-desc">{ suffix }</span>
        }
      </div>
    </div>
  )
}

export default CheckInput
