import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import TableComponent from '../../../CommonComponents/TableComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'

import {
  setDateRange,
} from '../../../../redux/actions/header'
import {
  getCampaignDashbaordKeywordsCleanerRelatedTerms,
} from '../../../../redux/actions/campaign'
import {
  getNegativeKWData,
} from '../../../../redux/actions/campaignDetail'

import {
  formatValue,
  capitalizeFirstLetter,
} from "../../../../services/helper"

const CampaignKeywordsCleanerKeywordsTable = ({ isNewTerms, onClickKeyword, currentAdGroupId }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const {
    header,
    campaign,
    campaignDetail: { currentAcos, currentAdGroups },
  } = store.getState()
  // header
  const {
    currentStartDate,
    currentEndDate,
    currentUserId,
  } = header

  const {
    dashboardKeywordCleanerKeywords,
    isDashboardKeywordCleanerKeywordsLoading,
    loadDashboardKeywordCleanerKeywordsResponse,
    // related terms
    isDashboardKeywordCleanerRelatedTermsLoading,
    loadDashboardKeywordCleanerRelatedTermsResponse,
    // update keyword state
    isUpdatingDashboardKeywordCleanerKeywordState,
  } = campaign
  // state
  const [ searchText, setSearchText ] = useState('')
  const [ keywords, setKeywords ] = useState([])
  const { id: campaignId } = useParams()
  // table fields
  const fields = [
    { value: "keyword", label: 'Keyword/Target', flex: 2, sort: true, dataType: 'string', },
    { value: 'matchtype', label: 'Match', sort: true, dataType: 'string', },
    { value: 'acos', label: 'ACoS %', sort: true, dataType: 'number', },
    { value: 'revenue', label: 'Rev', sort: true, dataType: 'number', },
    { value: 'cost', label: 'Spend', sort: true, dataType: 'number', primarySort: true, },
    { value: 'impressions', label: 'Impr', sort: true, dataType: 'number', },
    { value: 'clicks', label: 'Clicks', sort: true, dataType: 'number', },
    { value: 'avcpc', label: 'Ave CPC', sort: true, dataType: 'number', },
  ]
  const handleChangeDateRange = ({ startDate, endDate }) => {
    dispatch(
      setDateRange({
        startDate,
        endDate,
      })
    )
  }
  const handleChangeSearchText = (text) => {
    setSearchText(text)
    if (!text) {
      setSearchText('')
    }
  }
  const handleTableData = (data, search) => {
    let tmpData = []
    if (!currentAdGroupId) {
      tmpData = data[0]
    } else {
      tmpData = data[1].filter(keyword => keyword.adgroupid === currentAdGroupId)
    }
    tmpData = tmpData.filter(keyword => keyword.keyword.toLowerCase().search(search.toLowerCase()) !== -1)
    setKeywords(tmpData.map(keyword => ({
      ...keyword,
      id: keyword.keywordId,
      matchtype: capitalizeFirstLetter(keyword.matchtype),
      acos: formatValue(keyword.acos, 'number'),
      avcpc: formatValue(keyword.avcpc, 'number'),
      clicks: formatValue(keyword.clicks, 'removeZeroDecimal'),
      impressions: formatValue(keyword.impressions, 'removeZeroDecimal'),
      profitAmount: formatValue(parseFloat(keyword.revenue) * parseFloat(keyword.profit) - parseFloat(keyword.cost), 'number'),
    })))
  }
  // scroll to results container
  const scrollToLoadedSection = () => {
    document.querySelector('.main-content').scrollTop = document.querySelector('.results-container').getBoundingClientRect().top
  }
  // clicked keyword row to show related item
  const handleClickKeywordRow = (data) => {
    onClickKeyword(data)
    loadRelatedTerms(data)
    scrollToLoadedSection()
  }
  // load realted terms of keyword
  const loadRelatedTerms = (keyword) => {
    dispatch(
      getCampaignDashbaordKeywordsCleanerRelatedTerms({
        user: currentUserId,
        campaignId: campaignId,
        startDate: moment(currentStartDate).format('YYYY-MM-DD'),
        endDate: moment(currentEndDate).format('YYYY-MM-DD'),
        keyword: keyword.keyword,
        matchType: keyword.matchType,
        acosProfitZone: currentAcos,
      })
    )
    if (isNewTerms) {
      loadNegativeKeywrods()
    }
  }
  const loadNegativeKeywrods = () => {
    let adGroupIds
    if (currentAdGroupId) {
      adGroupIds = currentAdGroupId
    } else {
      if (currentAdGroups && currentAdGroups.length > 0) {
        adGroupIds = currentAdGroups.map(adGroup => adGroup.adgroupid).join()
      }
    }
    dispatch(getNegativeKWData({
      campaignId,
      adGroupIds,
    }))
  }
  // set keywords
  useEffect(() => {
    if (isDashboardKeywordCleanerKeywordsLoading) {
      setKeywords([])
      return
    }
    if (loadDashboardKeywordCleanerKeywordsResponse && loadDashboardKeywordCleanerKeywordsResponse !== '') {
      setKeywords([])
      toast.show({
        title: 'Warning',
        description: 'Failed to get keywords. Server error.',
      })
      return
    }
    if (!dashboardKeywordCleanerKeywords || dashboardKeywordCleanerKeywords.length === 0) {
      setKeywords([])
      return
    }
    if (isUpdatingDashboardKeywordCleanerKeywordState) {
      setKeywords([])
      return
    }

    handleTableData(dashboardKeywordCleanerKeywords, searchText)
    // eslint-disable-next-line
  }, [
    currentAdGroupId,
    isDashboardKeywordCleanerKeywordsLoading,
    loadDashboardKeywordCleanerKeywordsResponse,
    dashboardKeywordCleanerKeywords,
    isUpdatingDashboardKeywordCleanerKeywordState,
    searchText,
  ])
  // notification: load related search terms
  useEffect(() => {
    if (isDashboardKeywordCleanerRelatedTermsLoading) {
      return
    }
    if (loadDashboardKeywordCleanerRelatedTermsResponse && loadDashboardKeywordCleanerRelatedTermsResponse !== '') {
      toast.show({
        title: 'Warning',
        description: 'Failed to get search terms. Server error.',
      })
    }
  }, [
    isDashboardKeywordCleanerRelatedTermsLoading,
    loadDashboardKeywordCleanerRelatedTermsResponse
  ])

  const isLoading = isDashboardKeywordCleanerKeywordsLoading
  return (
    <div className={isLoading || isUpdatingDashboardKeywordCleanerKeywordState ? "table-content loading" : "table-content"}>
      { (isLoading || isUpdatingDashboardKeywordCleanerKeywordState) && <LoaderComponent /> }
      <TableComponent
        fields={fields}
        rows={keywords}
        showColumns
        showTools
        showSearch
        showDateRange
        enableRowClick
        onClickRow={handleClickKeywordRow}
        onChangeDateRange={handleChangeDateRange}
        onChangeSearchText={handleChangeSearchText}
        startDate={currentStartDate}
        endDate={currentEndDate}
      />
    </div>
  )
}
export default CampaignKeywordsCleanerKeywordsTable