import React from 'react'

import FieldRow from './FieldRow'
import CheckInput from './CheckInput'

const CheckTwoInput = (props) => {
  const { disabled, label1, label2, field,
    inputField1, inputField2, settings, onChange } = props

  const validateField2 = () => {
    if (settings[inputField2] === ''
      || isNaN(settings[inputField2])
      || parseFloat(settings[inputField2]) < 0) {
      onChange(inputField2, 0)
    }
  }

  return (
    <FieldRow disabled={disabled}>
      <CheckInput
        label={label1}
        field={field}
        inputField={inputField1}
        settings={settings}
        onChange={onChange}
      />
      <div className="field-wrapper">
        <div className="field-name">
          { label2 }
        </div>
        <input
          type="number"
          min="0"
          disabled={!settings[field]}
          value={settings[inputField2]}
          onChange={(event) => { onChange(inputField2, event.target.value) }}
          onBlur={validateField2}
        />
      </div>
    </FieldRow>
  )
}

export default CheckTwoInput
