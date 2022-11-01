import React from 'react'

const AdgroupInfo = ({ name, onChange }) => (
  <div className="field-row">
    <div className="field-wrapper">
      <div className="field-name">
        <strong>Ad Group Name</strong>
      </div>
      <input
        type="text"
        value={name}
        onChange={(event) => { onChange(event.target.value) }}
      />
    </div>
    <div className="field-wrapper" />
  </div>
)

export default AdgroupInfo
