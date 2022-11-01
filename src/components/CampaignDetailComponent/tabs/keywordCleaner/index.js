import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { Tooltip, Whisper } from 'rsuite'
// components
import CampaignKeywordsCleanerKeywordsTable from './keywords-table'
import CampaignKeywordsCleanerSalesTable from './sales-table'
import CampaignKeywordsCleanerNonProfitableTable from './nonprofitable-table'
import CampaignKeywordsCleanerLowCtrTable from './low-ctr-table'
// assets
import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'
// actions
import {
  getCampaignDashboardKeywordCleanerKeywords,
} from '../../../../redux/actions/campaign'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'

const CampaignKeywordCleanerComponent = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const {
    header,
    campaignDetail: { currentAdGroups, currentAcos, currentDetail },
  } = store.getState()
  // header
  const {
    currentStartDate,
    currentEndDate,
    currentUserId,
  } = header

  const [ selectedKeyword, setSelectedKeyword ] = useState({})
  const [ currentAdGroupId, setCurrentAdGroupId ] = useState('')
  const [ isNewTerms ] = useState(true)
  const [acos, setAcos] = useState(0)

  const { id: campaignId } = useParams()
  // click ad group
  const handleChangeAdGroup = (adGroup) => {
    if (adGroup) {
      setCurrentAdGroupId(adGroup.adgroupid)
    } else {
      setCurrentAdGroupId(null)
    }
  }
  const handleClickKeyword = (keyword) => {
    setSelectedKeyword(keyword)
  }

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  // set adgroup and current ad group id
  useEffect(() => {
    if (!currentAdGroups || currentAdGroups.length === 0) {
      return
    }
    setCurrentAdGroupId(currentAdGroups[0].adgroupid)
  }, [currentAdGroups])
  // load keywords
  useEffect(() => {
    if (!currentUserId) {
      return
    }
    if (!campaignId) {
      return
    }
    dispatch(
      getCampaignDashboardKeywordCleanerKeywords({
        user: currentUserId,
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
        campaignId: campaignId,
      })
    )
  }, [currentUserId, currentStartDate, currentEndDate, campaignId, dispatch])

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

  if (campaignType === 'Sponsored Displays'
    || campaignType === 'Sponsored Brands'
    || campaignType === 'Sponsored Brands Video') {
    return null
  }

  return (
    <div className="campaign-detail-keyword-cleaner campaign-detail-tab">
      <div className="tab-info">
        <div className="tab-title">
          Keyword Cleaner
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Keyword Cleaner allows you to research problematic search terms
              on a keyword level - click a keyword below to reveal the search terms
              they’ve connected with.<br />
              You’ll then be able to optimize out any search terms that have clicks without sales,
              high ACoS, or CTR issues.<br />
              This is a great way to reduce the ACoS of a keyword without
              lowering the bid.<br />
              Keyword Cleaner does not work with Exact Match Keywords.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="tab-description">
          Click on a Keyword to See Unprofitable Search Terms Below.
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
      <div className="cleaner-content">
        <div className="keyword-table">
          <CampaignKeywordsCleanerKeywordsTable
            isNewTerms={isNewTerms}
            currentAdGroupId={currentAdGroupId}
            onClickKeyword={handleClickKeyword}
          />
        </div>
        <div className="results-container">
          <h5>Keyword Cleaner Results</h5>
          <div className="flex align-center justify-space-between flex-wrap results-tables">
            <CampaignKeywordsCleanerSalesTable
              currentAdGroupId={currentAdGroupId}
              selectedKeyword={selectedKeyword}
              campaignType={campaignType}
            />
            <CampaignKeywordsCleanerNonProfitableTable
              currentAdGroupId={currentAdGroupId}
              selectedKeyword={selectedKeyword}
              campaignType={campaignType}
            />
            <CampaignKeywordsCleanerLowCtrTable
              currentAdGroupId={currentAdGroupId}
              selectedKeyword={selectedKeyword}
              campaignType={campaignType}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignKeywordCleanerComponent