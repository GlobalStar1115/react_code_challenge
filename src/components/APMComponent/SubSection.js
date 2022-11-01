import React, { useRef } from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as CaretUpSvg } from '../../assets/svg/caret-up.svg'
import { ReactComponent as CaretDownSvg } from '../../assets/svg/caret-down.svg'

const SubSection = ({ id, name, tooltip = null, children, activeSubSection, onToggle }) => {
  const ref = useRef(null)

  return (
    <div className="subsection-container" ref={ref}>
      <div className="subsection-header" onClick={() => { onToggle(id, ref) }}>
        { name }
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
        {
          activeSubSection === id
          ? <CaretUpSvg />
          : <CaretDownSvg />
        }
      </div>
      {
        activeSubSection === id && (
          <div className="subsection-body">
            { children }
          </div>
        )
      }
    </div>
  )
}

export default SubSection
