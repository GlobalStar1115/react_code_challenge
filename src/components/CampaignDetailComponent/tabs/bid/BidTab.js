import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'

import KeywordTable from './KeywordTable'
import TargetTable from './TargetTable'

import {
  getBidData,
  getBidTargetData,
} from '../../../../redux/actions/campaignDetail'

const BidTab = ({ campaignType, currentAdGroup, isProfitable }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    header: {
      currentStartDate,
      currentEndDate,
    },
    campaignDetail: { currentAcos, currentDetail },
  } = store.getState()

  useEffect(() => {
    if (!campaignType || !currentAdGroup) {
      return
    }

    const params = {
      campaignId: currentDetail.campaign_id,
      adgroupId: currentAdGroup.adgroupid,
      campaignType,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      targetAcos: currentAcos,
      isProfitable,
    }

    if (currentAdGroup.targetType === 'products') {
      dispatch(getBidTargetData(params))
    } else {
      dispatch(getBidData(params))
    }
  }, [campaignType, currentDetail, currentAdGroup, currentStartDate, currentEndDate]) // eslint-disable-line

  if (!currentAdGroup) {
    return null
  }

  if (currentAdGroup.targetType !== 'products') {
    return (
      <KeywordTable campaignType={campaignType} />
    )
  }

  return (
    <TargetTable
      campaignType={campaignType}
      campaignId={currentDetail?.campaign_id}
      adgroupId={currentAdGroup?.adgroupid}
    />
  )
}

export default BidTab
