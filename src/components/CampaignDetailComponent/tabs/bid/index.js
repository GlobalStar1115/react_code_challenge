import React, { useState, useEffect } from 'react'
import { useStore, useDispatch } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'

import BidTab from './BidTab'

import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'

const tabList = [
  {
    value: 'all',
    label: 'All Keywords/Targets',
  },
  {
    value: 'below',
    label: 'Below Target ACOS',
  },
  {
    value: 'above',
    label: 'Above Target ACOS',
  },
]

const BidOPTab = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const {
    campaignDetail: {
      currentAdGroups,
      currentAcos,
      currentDetail,
    },
  } = store.getState()

  const [currentTab, setCurrentTab] = useState('above')
  const [currentAdGroup, setCurrentAdGroup] = useState(null)
  const [acos, setAcos] = useState(0)

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  useEffect(() => {
    if (!currentAdGroups || !currentAdGroups.length || currentAdGroup) {
      return
    }
    setCurrentAdGroup(currentAdGroups[0])
  }, [currentAdGroups]) // eslint-disable-line

  const handleChangeAdGroup = (adGroup) => {
    setCurrentAdGroup(adGroup || null)
  }

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

  return (
    <div className="campaign-detail-bid-op campaign-detail-tab">
      <div className="tab-info">
        <div className="tab-title">
          Bid Optimizer
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Bid Optimizer is a tool that suggests a new bid “Genius Bid” based
              on performance and the ACOS Target that you have set.<br />
              A minimum of 3 clicks is required before we suggest a “Genius Bid”.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="tab-description">
          Review target performance and change bid prices below.
        </div>
      </div>
      <div className="tab-list">
        {
          tabList.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={currentTab === tab.value ? "tab selected" : "tab"}
              onClick={() => { setCurrentTab(tab.value)}}
            >
              { tab.label }
            </button>
          ))
        }
      </div>

      <div className="adgroup-selector">
        <div className="adgroup-content">
          Ad group:
          {
            currentAdGroups.map(adGroup => (
              <button
                key={adGroup.adgroupid}
                type="button"
                className={`btn ${currentAdGroup && currentAdGroup.adgroupid === adGroup.adgroupid ? 'btn-blue' : 'btn-white'}`}
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
        currentTab === 'above' && (
          <BidTab
            campaignType={campaignType}
            currentAdGroup={currentAdGroup}
            isProfitable={false}
          />
        )
      }
      {
        currentTab === 'below' && (
          <BidTab
            campaignType={campaignType}
            currentAdGroup={currentAdGroup}
            isProfitable
          />
        )
      }
      {
        currentTab === 'all' && (
          <BidTab
            campaignType={campaignType}
            currentAdGroup={currentAdGroup}
            isProfitable={''}
          />
        )
      }
    </div>
  )
}

export default BidOPTab
