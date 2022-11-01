import React from 'react'

import FlowContainer from './FlowContainer'
import VideoCollection from './VideoCollection'
import AttachmentList from './AttachmentList'

const videoList = [
  {
    name: 'On Campaign Dashboard',
    videoId: 'xtysuuc4e3',
    url: '//fast.wistia.com/embed/medias/xtysuuc4e3.jsonp',
  },
  {
    name: 'Using Bulk Engine',
    videoId: '1jbf2x1arm',
    url: '//bigmikeeuconn.wistia.com/medias/1jbf2x1arm.jsonp',
  },
]

const attachments = [
  { name: 'Quick_help.pdf', url: 'http://www.google.com' },
  { name: 'Estimated_formula.xls', url: 'http://www.google.com' },
]

const SmartPilotFlow = ({ onWatch, ...props }) => {
  return (
    <FlowContainer
      name="Smart Pilot Flow"
      {...props}
    >
      <VideoCollection videoList={videoList} onWatch={onWatch} />
      <div className="flow-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium,
        scelerisque sit massa orci sed lacinia pellentesque. Sit pellentesque
        at id vitae lacinia et morbi aliquam. Nulla sed id augue donec suspendisse.
        Fermentum, velit, viverra cursus nunc tempus. Adipiscing id vel lorem interdum.
        Laoreet amet cursus nec ut suspendisse. Turpis tempor, auctor viverra facilisis.
        Risus sed sit varius varius vitae. Tellus, netus ornare sapien,
        non venenatis leo, mauris gravida eget.
      </div>
      <AttachmentList attachments={attachments} />
    </FlowContainer>
  )
}

export default SmartPilotFlow
