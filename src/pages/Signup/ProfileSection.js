import React from 'react'
import { DatePicker } from 'rsuite'

const ProfileSection = ({ profile, onChange }) => {
  return (
    <div className="signup-section">
      <div className="section-name">
        Profile (optional)
      </div>
      <div className="field-row">
        <div className="field-wrapper">
          <label>Phone</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={(event) => { onChange('phone', event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>Birthday</label>
          <DatePicker
            value={profile.birthday}
            format="MMM D, YYYY"
            oneTap
            onChange={(date) => { onChange('birthday', date) }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileSection
