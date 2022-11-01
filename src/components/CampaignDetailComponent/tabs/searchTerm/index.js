import React, { useState, useEffect } from 'react'
import { useStore, useDispatch } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'

import CheckboxComponent from '../../../CommonComponents/CheckboxComponent'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'
import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'

import STTab from './subTabs/STTab'
import TimeSavingFilterTab from './subTabs/TimeSavingFilterTab'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'


const TAB_BELOW = 'below'
const TAB_ABOVE = 'above'
const TAB_TIME = 'time'

const tabs = [
  {
    value: TAB_BELOW,
    label: 'Below Target ACOS',
  },
  {
    value: TAB_ABOVE,
    label: 'Above Target ACOS',
  },
  {
    value: TAB_TIME,
    label: 'Time Saving Filters',
  },
]

const STOPTab = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const {
    campaignDetail: {
      currentAcos,
      currentDetail,
      currentAdGroups,
      isSTDataLoading,
      isNegativeKWLoading,
    },
  } = store.getState()

  const [currentTab, setCurrentTab] = useState(TAB_ABOVE)
  const [currentAdGroupId, setCurrentAdGroupId] = useState(null)
  const [hideKeywords, setHideKeywords] = useState(true)
  const [hideAsins, setHideAsins] = useState(true)
  const [hideNegatedTerms, setHideNegatedTerms] = useState(true)
  const [acos, setAcos] = useState(0)

  const handleChangeAdGroup = (adGroup) => {
    setCurrentAdGroupId(adGroup ? adGroup.adgroupid : null)
  }

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

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

  const isLoading = isNegativeKWLoading || isSTDataLoading

  return (
    <div className="campaign-detail-st-op campaign-detail-tab">
      <div className="tab-info">
        <h4 className="tab-title">
          Search Term Optimization
          <Whisper placement="right" trigger="click" speaker={(
            <Tooltip style={{ lineHeight: '30px' }}>
              <p style={{ fontSize: '14px' }}>Research and optimize your campaigns at the search term level
              without ever touching a spreadsheet.</p>
              <p style={{ fontSize: '14px' }}>Use the Time Saving Filters section for an easy grouping
              of potentially problematic search terms that you may wish
              to add as negative exacts.</p>
              <p style={{ fontSize: '14px' }}>Use the table on Non-Profitable Search Terms to do a deeper dive
              into search terms causing wasteful ad spend.</p>
              <p style={{ fontSize: '14px' }}>By default, ASINs and search terms already added as negatives
              to your campaign will be hidden.</p>
              <p style={{ fontSize: '14px' }}>Uncheck the Remove ASIN and/or New Terms Only boxes respectively to reveal them.</p>
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </h4>
      </div>
      <div className="tab-list">
        {
          tabs.map((tab) => (
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
      <div className="filter-container">
        <div className="checkbox-wrapper">
          <CheckboxComponent
            label="Remove Keywords"
            onChange={setHideKeywords}
            checked={hideKeywords}
          />
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Sometimes a keyword and search term are the same
              (ex: Exact match types), many times they are not.<br />
              Checking this box means ONLY actual customer search
              terms will be revealed, not keywords.<br />
              Using this will help you find customer search terms that are
              resulting in wasted ad spend.<br/>
              This way you can consider using them as NEGATIVE EXACT for your campaigns.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="checkbox-wrapper">
          <CheckboxComponent
            label="Don't Show Already Negated Terms"
            onChange={setHideNegatedTerms}
            checked={hideNegatedTerms}
          />
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Remove words already added as negative to this campaign and ad group.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        {
          currentTab !== TAB_TIME && (
            <div className="checkbox-wrapper">
              <CheckboxComponent
                label="Remove Asins"
                checked={hideAsins}
                onChange={setHideAsins}
              />
            </div>
          )
        }
      </div>
      <div className={`tab-content${isLoading ? ' loading' : ''}`}>
        { isLoading && <LoaderComponent /> }
        {
          currentTab === TAB_BELOW && (
            <STTab
              isProfitable
              campaignType={campaignType}
              currentAdGroupId={currentAdGroupId}
              hideKeywords={hideKeywords}
              hideNegatedTerms={hideNegatedTerms}
              hideAsins={hideAsins}
            />
          )
        }
        {
          currentTab === TAB_ABOVE && (
            <STTab
              campaignType={campaignType}
              currentAdGroupId={currentAdGroupId}
              hideKeywords={hideKeywords}
              hideNegatedTerms={hideNegatedTerms}
              hideAsins={hideAsins}
            />
          )
        }
        {
          currentTab === TAB_TIME && (
            <TimeSavingFilterTab
              campaignType={campaignType}
              currentAdGroupId={currentAdGroupId}
              hideKeywords={hideKeywords}
              hideNegatedTerms={hideNegatedTerms}
            />
          )
        }
      </div>
    </div>
  )
}

export default STOPTab
