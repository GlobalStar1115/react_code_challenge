import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'

import KeywordTable from './KeywordTable'
import TargetTable from './TargetTable'


import {
  getNegativeWordData,
  getNegativeTargetData,
} from '../../../../redux/actions/campaignDetail'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'

const NegativeOPTab = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    header: {
      currentStartDate,
      currentEndDate,
    },
    campaignDetail: {
      currentDetail,
      currentAcos,
      currentAdGroups,
    },
  } = store.getState()

  const [currentAdGroupId, setCurrentAdGroupId] = useState(null)
  const [targetType, setTargetType] = useState('keywords')
  const [acos, setAcos] = useState(0)

  const handleChangeAdGroup = (adGroup) => {
    if (adGroup) {
      setCurrentAdGroupId(adGroup.adgroupid)
      setTargetType(adGroup.targetType === 'products' ? 'products' : 'keywords')
    } else {
      setCurrentAdGroupId(null)
      setTargetType('keywords')
    }
  }

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  useEffect(() => {
    if (!currentStartDate || !currentEndDate) {
      return
    }
    if (targetType === 'keywords') {
      let adgroupIds
      if (currentAdGroupId) {
        adgroupIds = [currentAdGroupId]
      } else {
        adgroupIds = currentAdGroups.map(adgroup => adgroup.adgroupid)
      }

      dispatch(getNegativeWordData({
        campaignId: currentDetail.campaign_id,
        adgroupIds,
        campaignType,
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      }))
    } else {
      dispatch(getNegativeTargetData({
        campaignId: currentDetail.campaign_id,
        adgroupId: currentAdGroupId,
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
        targetAcos: currentAcos || 0,
      }))
    }
    // eslint-disable-next-line
  }, [
    targetType,
    currentAdGroupId,
    currentAdGroups,
    currentStartDate,
    currentEndDate,
    currentAcos,
  ])

  const handleChangeAcos = e => {
    if (!e.target.value) {
      return
    }
    setAcos(e.target.value)
  }

  const handleSaveAcos = () => {
    dispatch(
      updateAcos({
        campaignId: currentDetail.campaign_id,
        campaignType: campaignType,
        acos,
      })
    )
  }

  const isSameAcos = currentAcos === acos
  if (campaignType === 'Sponsored Displays') {
    return null
  }

  const dateDiff = moment(currentEndDate).diff(moment(currentStartDate), 'day') || 1

  return (
    <div className="campaign-detail-negative-op campaign-detail-tab">
      <div className="tab-info">
        <div className="tab-title">
          Negative Word/ASIN Finder
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Automatically finds individual words that are leading to lost sales. Read through this list carefully and decide which words you want to ad as negative phrase match.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="tab-description">
          Finds Unique Words/ASINS That Have Not Been Profitable.
        </div>
      </div>
      <div className="adgroup-selector">
        <div className="adgroup-content">
          Ad group:
          <button
            type="button"
            className={`btn ${!currentAdGroupId ? 'btn-blue' : 'btn-white'}`}
            onClick={() => { handleChangeAdGroup() }}
          >
            All ad groups
          </button>
          {
            (currentAdGroups || []).map(adGroup => (
              <button
                key={adGroup.adgroupid}
                type="button"
                className={`btn ${currentAdGroupId === adGroup.adgroupid ? 'btn-blue' : 'btn-white'}`}
                onClick={() => { handleChangeAdGroup(adGroup) }}
              >
                { adGroup.name }
              </button>
            ))
          }
        </div>
        <div className="acos-container">
          <span>ACOS Target (%)</span>
          <input value={acos} type="number" onChange={handleChangeAcos} />
          {
            !isSameAcos && (
              <button type="button" className="btn btn-red" onClick={handleSaveAcos}>
                Save
              </button>
            )
          }
        </div>
      </div>
      {
        targetType === 'keywords' && (
          <KeywordTable
            currentAdGroupId={currentAdGroupId}
            campaignType={campaignType}
            dateDiff={dateDiff}
          />
        )
      }
      {
        targetType === 'products' && (
          <TargetTable
            currentAdGroupId={currentAdGroupId}
            dateDiff={dateDiff}
          />
        )
      }
    </div>
  )
}

export default NegativeOPTab
