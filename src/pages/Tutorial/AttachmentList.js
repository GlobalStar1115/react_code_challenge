import React from 'react'

import { ReactComponent as FileSvg } from '../../assets/svg/file.svg'

const AttachmentList = ({ attachments }) => {
  return (
    <div className="attachment-list">
      {
        attachments.map(attachment => (
          <span key={attachment.name} className="attachment-item">
            <FileSvg />
            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
              { attachment.name }
            </a>
          </span>
        ))
      }
    </div>
  )
}

export default AttachmentList
