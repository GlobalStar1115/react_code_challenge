import React from 'react'

const OpKeywordIgnore = ({ field, settings, onChange }) => {
  const handleChange = (event) => {
    onChange(field, event.target.value.split(/\r?\n/))
  }

  return (
    <div className="keyword-ignore-container">
      <label className="container-label">
        Ignore Keywords/Targets
      </label>
      <ul>
        <li>
          Enter one keyword per line to tell Entourage which targets
          you do <u>NOT</u> want to apply keyword optimization automation rules to.
          An example may be your brand name or a main keyword
          you’re willing to take a slight loss on.
        </li>
        <li>
          Remember to enter singular, plural, and stemmed versions of
          keywords you want to ensure the system ignores.
        </li>
      </ul>
      <textarea
        value={settings[field].join('\n')}
        onChange={handleChange}
      />
    </div>
  )
}

export default OpKeywordIgnore
