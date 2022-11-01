import React from 'react'

import FlowHeader from './FlowHeader'

const FlowContainer = ({ name, coin = 0, active, onToggle, children }) => {
  return (
    <div className="flow-container">
      <FlowHeader
        name={name}
        coin={coin}
        onToggle={onToggle}
      />
      {
        active && (
          <div className="flow-body">
            { children }
          </div>
        )
      }
    </div>
  )
}

export default FlowContainer
