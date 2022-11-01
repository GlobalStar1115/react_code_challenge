import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import ImgCheck from '../../assets/img/check.png'
import ImgClipboard from '../../assets/img/clipboard.png'
import ImgList from '../../assets/img/list.png'

import {
  enableKeywordOrganicRankTrackingBulk,
  updateKeywordsState
} from '../../redux/actions/productDetail'

import { copyToClipboard } from '../../services/helper'

const KeywordOptionComponent = ({clipboard, keywordChecking}) => {
  const dispatch = useDispatch()

  const [changeState, setChangeState] = useState()

  const idList = []
  for (const [key, value] of Object.entries(keywordChecking)) {
    if (value) {
      idList.push(key)
    }
  }

  const options = [
    {value: 'enabled', label: 'Active'},
    {value: 'paused', label: 'Pause'},
    {value: 'archived', label: 'Archive'}
  ]

  const onTrackOrganicRank = () => {
    let keywordIds = []

    for (let i in keywordChecking) {
      if (keywordChecking[i]) {
        keywordIds.push(i)
      }
    }

    dispatch(enableKeywordOrganicRankTrackingBulk(keywordIds))
  }
  const onCheckIndex = () => {
    toast.show({
      title: 'Success',
      description: 'Successfully track organic rank for the selected keywords',
    })
  }
  const onChangeState = (st) => {
    setChangeState(st)
    let keywordIds = []

    for (let i in keywordChecking) {
      if (keywordChecking[i]) {
        keywordIds.push(i)
      }
    }

    dispatch(updateKeywordsState({value: st.value, keywordIds}))
  }
  const onCopy = () => {
    copyToClipboard(clipboard)
    toast.show({
      title: 'Success',
      description: 'Successfully copied.',
    })
  }

  return (
    <div className="keyword-option-component">
      <div className="option-col" onClick={onCopy}>
        <img alt="copy-to-clipboard" src={ImgClipboard} />
        <span>Copy to clipboard</span>
      </div>
      <div className="option-col" onClick={onCheckIndex}>
        <img alt="check-index" src={ImgCheck} />
        <span>Check Indexing</span>
      </div>
      <div className="option-col" onClick={onTrackOrganicRank}>
        <img alt="track-organic-rank" src={ImgList} />
        <span>Track Organic Rank</span>
      </div>
      <div className="option-col">
        <Select classNamePrefix="keyword-status-select" options={options} placeholder="Change State" value={changeState} onChange={onChangeState} />
      </div>
    </div>
  )
}

export default KeywordOptionComponent
