import React, { useState } from 'react'
import * as Icon from 'react-icons/fi'

const TreeComponent = (props) => {
  const { actionLabel = 'Target', nodes, nodesTargeted, parentNode = null, parentExpandedNodes = {},
    onTarget, onRefine } = props

  const [expandedNodes, setExpandedNodes] = useState(parentExpandedNodes)

  const handleTarget = (node) => {
    onTarget(node, parentNode, expandedNodes)
  }

  const showChild = (node) => {
    if (node.ch.length === 0) {
      return
    }

    const newExpandedNode = {
      ...expandedNodes
    }

    if (newExpandedNode[node.id]) {
      newExpandedNode[node.id].isShow = !newExpandedNode[node.id].isShow
    } else {
      newExpandedNode[node.id] = {
        isShow: true,
        data: node.ch,
        path: parentNode && newExpandedNode[parentNode.id]
          ? `${newExpandedNode[parentNode.id].path}/${node.na}`
          : `/${node.na}`,
      }
    }
    setExpandedNodes(newExpandedNode)
  }

  return (
    <div className="tree-list">
      {
        nodes.map(node => (
          <div className="tree-item" key={node.id} >
            <div className="flex align-center justify-space-between tree-contents">
              <button type="button" className="flex align-center tree-col node-info" onClick={() => { showChild(node) }}>
                {
                  node.ch.length > 0 ? expandedNodes && expandedNodes[node.id] && expandedNodes[node.id].isShow ?
                  <Icon.FiMinus/> : <Icon.FiPlus/> : <></>
                }
                { node.na }
              </button>
              <div className="flex align-center tree-col item-action">
                {
                  nodesTargeted
                    ? nodesTargeted.filter(target => target.type !== 'product').filter(target => target.id === node.id).length === 0
                      ? <button className="btn btn-blue" onClick={() => { handleTarget(node) }}>
                          { actionLabel }
                        </button>
                      : <button type="button" className="btn btn-blue disabled">
                          { actionLabel }ed
                        </button>
                    : <button className="btn btn-blue" onClick={() => { handleTarget(node) }}>
                        { actionLabel }
                    </button>
                }
                <button type="button" className="btn btn-green" onClick={() => { onRefine(node) }}>Refine</button>
              </div>
            </div>
            <div className="tree-child">
              {
                expandedNodes && expandedNodes[node.id] && expandedNodes[node.id].isShow && (
                  <TreeComponent
                    actionLabel={actionLabel}
                    nodes={node.ch}
                    parentNode={node}
                    nodesTargeted={nodesTargeted}
                    parentExpandedNodes={expandedNodes}
                    onTarget={onTarget}
                    onRefine={onRefine}
                  />
                )
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default TreeComponent
