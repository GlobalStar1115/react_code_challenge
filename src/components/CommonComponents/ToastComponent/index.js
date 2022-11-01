import React, { useEffect } from 'react'

import CheckIcon from '../../../assets/svg/check.svg'
import WarningIcon from '../../../assets/svg/warning.svg'

const Toast = (props) => {
  const {
    destroy,
    description,
    title = null,
    duration = 2000,
    backgroundColor,
    icon,
  } = props

  const colors = {
    Success: '#5cb85c',
    Danger: '#d9534f',
    Info: '#5bc0de',
    Warning: '#f0ad4e',
  }

  useEffect(() => {
    if (!duration) {
      return
    }

    const timer = setTimeout(() => {
      destroy()
    }, duration)

    return () => clearTimeout(timer)
  }, [destroy, duration])

  let bgColor = colors['Info']
  if (backgroundColor) {
    bgColor = backgroundColor
  } else if (title && colors[title]) {
    bgColor = colors[title]
  }

  let iconToRender
  if (icon) {
    iconToRender = icon
  } else if (title === 'Danger' || title === 'Warning') {
    iconToRender = WarningIcon
  } else {
    iconToRender = CheckIcon
  }

  return (
    <div
      className="notification"
      style={{ backgroundColor: bgColor }}
    >
      <button onClick={destroy}>
        &times;
      </button>
      <div className="notification-image">
        <img src={iconToRender} alt="notification-icon" />
      </div>
      <div className="notification-contents">
        {/* {
          title !== null && (
            <p className="notification-title">
              {title}
            </p>
          )
        } */}
        <p
          className="notification-message"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
    </div>
  )
}

export default Toast