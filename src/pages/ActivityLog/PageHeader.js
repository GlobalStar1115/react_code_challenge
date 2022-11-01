import React from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const PageHeader = () => {
  return (
    <div className="page-header">
      <div className="page-title">
        Activity Log
        <Whisper placement="right" trigger="hover" speaker={(
          <Tooltip>
            This section will show you all changes made to your campaigns on an account-wide level.<br/>
            To delete a log, check the box on the left and click the delete button.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
    </div>
  )
}

export default PageHeader
