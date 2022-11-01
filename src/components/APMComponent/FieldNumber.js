import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const FieldNumber = (props) => {
  const {
    label = '',
    htmlLabel = false,
    prefix = '',
    suffix = '',
    settings,
    field,
    inline = false,
    min = 0,
    tooltip = null,
    onChange,
  } = props

  const validate = () => {
    if (settings[field] === ''
      || isNaN(settings[field])
      || parseFloat(settings[field]) < min) {
      onChange(field, min)
    }
  }

  return (
    <div className={`field-wrapper ${label ? '' : 'no-label-wrapper'} ${inline ? 'inline-wrapper' : ''}`}>
      <div className="field-name">
        {
          !htmlLabel ? label : (
            <span dangerouslySetInnerHTML={{ __html: label }} />
          )
        }
        {
          tooltip !== null && (
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                { tooltip }
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          )
        }
      </div>
      {
        prefix !== '' && <span className="input-desc">{ prefix }</span>
      }
      <input
        type="number"
        className={(prefix !== '' || suffix !== '') ? 'shrinked-input' : ''}
        min={min}
        value={settings[field]}
        onChange={(event) => { onChange(field, event.target.value) }}
        onBlur={validate}
      />
      {
        suffix !== '' && <span className="input-desc">{ suffix }</span>
      }
    </div>
  )
}

export default FieldNumber
