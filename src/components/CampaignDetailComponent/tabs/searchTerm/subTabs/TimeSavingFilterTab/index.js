import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import NoSaleTable from './NoSaleTable'
import LowCTRTable from './LowCTRTable'

import {
  getSTData,
  getNegativeKWData,
} from '../../../../../../redux/actions/campaignDetail'

const TimeSavingFilterTab = ({ campaignType, currentAdGroupId, hideKeywords, hideNegatedTerms }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const {
    header: {
      currentStartDate,
      currentEndDate,
    },
    campaignDetail: { currentAcos, currentAdGroups },
  } = store.getState()

  const { id: campaignId } = useParams()

  // Find search terms.
  useEffect(() => {
    if (!currentStartDate || !currentEndDate) {
      return
    }
    dispatch(getSTData({
      campaignId,
      campaignType,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      isProfitable: false,
      stOnly: hideKeywords,
      targetAcos: currentAcos || 0,
    }))
  }, [currentStartDate, currentEndDate, campaignId, currentAcos, hideKeywords]) // eslint-disable-line


  // Find negative keywords.
  useEffect(() => {
    if (!currentStartDate || !currentEndDate || !hideNegatedTerms) {
      return
    }

    let adGroupIds
    if (currentAdGroupId) {
      adGroupIds = currentAdGroupId
    } else if (currentAdGroups && currentAdGroups.length > 0) {
      adGroupIds = currentAdGroups.map(adGroup => adGroup.adgroupid).join()
    }

    dispatch(getNegativeKWData({
      campaignId,
      adGroupIds,
    }))
  }, [currentStartDate, currentEndDate, campaignId, currentAdGroupId, hideNegatedTerms]) // eslint-disable-line

  return (
    <div className="time-saving-filter-contents">
      <NoSaleTable
        currentAdGroupId={currentAdGroupId}
        campaignType={campaignType}
        hideNegatedTerms={hideNegatedTerms}
      />
      <LowCTRTable
        currentAdGroupId={currentAdGroupId}
        campaignType={campaignType}
        hideNegatedTerms={hideNegatedTerms}
      />
    </div>
  )
}

export default TimeSavingFilterTab
