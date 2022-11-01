import React from 'react'
import Checkbox from 'react-custom-checkbox'
import * as Icon from 'react-icons/fi'

const CheckboxComponent = ({ label, disabled, ...props }) => (
  <div className="checkbox-component">
    <Checkbox
      icon={
        <div
          style={{
            backgroundColor: "#246FE1",
            borderRadius: "3px",
            maxHeight: "18px",
            cursor: "pointer"
          }}
        >
          <Icon.FiCheck color="white" size={18} />
        </div>
      }
      label={label}
      disabled={disabled}
      borderColor="#CECECE"
      style={{
        cursor: 'pointer',
      }}
      size={18}
      borderRadius={3}
      {...props}
    />
  </div>
)

export default CheckboxComponent
