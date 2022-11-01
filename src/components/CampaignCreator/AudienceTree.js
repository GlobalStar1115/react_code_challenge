import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Tree, Tooltip, Whisper } from 'rsuite'
import * as Icon from 'react-icons/fi'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import { getSDAudiences } from '../../redux/actions/campaignCreator'

const AudienceTree = ({ targetings, onTarget }) => {
  const dispatch = useDispatch()

  const [data, setData] = useState([
    {
      value: 'Lifestyle',
      label: 'Lifestyle',
      description: 'Audiences whose shopping and streaming behaviors suggest certain lifestyle preferences and affinities',
      path: ['Lifestyle'],
      children: [],
    },
    {
      value: 'Interest',
      label: 'Interest',
      description: 'Audiences whose shopping activity suggests a durable interest in specific categories',
      path: ['Interest'],
      children: [],
    },
    {
      value: 'Life event',
      label: 'Life event',
      description: 'Audiences with recent activity around life moments such as moving or getting married',
      path: ['Life event'],
      children: [],
    },
    {
      value: 'In-market',
      label: 'In-market',
      description: 'Audiences whose recent activity suggests they are likely to buy products in a certain category',
      path: ['In-market'],
      children: [],
    },
  ])

  const [loadingValues, setLoadingValues] = useState([])

  const handleOnExpand = async (expandItemValues, activeNode, concat) => {
    if (typeof activeNode.children === 'undefined' || activeNode.children.length) {
      return
    }

    if (loadingValues.includes(activeNode.value)) {
      return
    }

    setLoadingValues([
      ...loadingValues,
      activeNode.value,
    ])

    const response = await dispatch(getSDAudiences(activeNode.path))

    setLoadingValues(loadingValues.filter(
      value => value !== activeNode.value
    ))

    const children = []
    response.categories.forEach((category) => {
      children.push({
        value: category,
        label: category,
        path: activeNode.path.concat(category),
        children: [],
      })
    })

    response.audiences.forEach((audience) => {
      children.push({
        value: audience.value,
        label: audience.label,
        description: audience.description,
      })
    })

    setData(concat(data, children))
  }

  const renderTreeIcon = (node) => {
    if (loadingValues.includes(node.value)) {
      return <Icon.FiLoader size={16} />
    }
    return null
  }

  const renderTreeNode = (node) => {
    const isExisting = targetings.find(targeting => (
      targeting.type === 'audience' && targeting.id === node.value
    ))

    return (
      <span className="audience-tree-node">
        <span className="label-wrapper">
          { node.label }
          {
            node.description && (
              <Whisper placement="right" trigger="hover" speaker={(
                <Tooltip>
                  { node.description }
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            )
          }
        </span>
        {
          typeof node.children === 'undefined' && (
            isExisting ? (
              <button type="button" className="btn btn-blue disabled">
                Added
              </button>
            ) : (
              <button type="button" className="btn btn-blue" onClick={() => { onTarget(node) }}>
                Add
              </button>
            )
          )
        }
      </span>
    )
  }

  return (
    <Tree
      className="audience-tree"
      data={data}
      renderTreeIcon={renderTreeIcon}
      renderTreeNode={renderTreeNode}
      onExpand={handleOnExpand}
    />
  )
}

export default AudienceTree
