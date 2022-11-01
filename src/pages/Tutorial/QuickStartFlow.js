import React from 'react'

import FlowContainer from './FlowContainer'
import VideoCollection from './VideoCollection'
import AttachmentList from './AttachmentList'

const videoList = [
  {
    name: 'On Campaign Dashboard',
    videoId: 'jr8ywlui23',
    url: '//bigmikeeuconn.wistia.com/medias/jr8ywlui23.jsonp',
  },
  {
    name: 'Using Bulk Engine',
    videoId: 'u416l231t8',
    url: '//fast.wistia.com/embed/medias/u416l231t8.jsonp',
  },
]

const attachments = [
  { name: 'Quick_help.pdf', url: 'http://www.google.com' },
  { name: 'Estimated_formula.xls', url: 'http://www.google.com' },
]

const QuickStartFlow = ({ onWatch, ...props }) => {
  return (
    <FlowContainer
      name="Quick Start Flow"
      coin={25}
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

export default QuickStartFlow
