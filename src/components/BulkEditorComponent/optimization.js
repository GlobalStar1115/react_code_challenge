import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'

// Components
import CampaignSelectComponent from './campaign-selector'
import AdgroupsSelectComponent from './adgroups-selector'
import OptimizationSkuComponent from './op-sku'
import OptimizationKeywordComponent from './op-keyword'
import OptimizationSearchTermComponent from '../BulkEditorComponent/op-search-term'
import OptimizationNegativeComponent from './op-negative'
import OptimizationAdvancedComponent from './opt-advanced'

//--actions
import {
  getOptListCampaignsPopup,
  getOptAdGroupByCampaignId,
  getCampaignOptSkusBulk,
  getCampaignOptKeywordsBulk,
  getCampaignOptSearchTermBulk,
  getCampaignOptNegativeBulk,
  getCampaignOptAdvancedKeywordBulk,
  getCampaignOptAdvancedNegativeBulk,
  getCampaignOptAdvancedWorstAdgBulk,
  updateCampaignOptSkuAdListState,
  updateCampaignOptKeywordListState,
  updateCampaignOptKeywordListBid,
  updateCampaignOptAdvancedKeywordListState,
  updateCampaignOptAdvancedKeywordListBid,
  updateCampaignOptAdvancedAdNegativeKeywordListState,
  updateCampaignOptAdvancedCampaignNegativeKeywordListState,
  updateCampaignOptAdvancedWorstAdgState,
  createOptCampaignNegativeKeywords,
  createOptNegativeKeywords,
} from '../../redux/actions/campaign'

import {
  getCampaignOptAdvancedAutoTargetingBulk,
  updateCampaignOptAdvancedAutoTargetListState,
  updateCampaignOptAdvancedAutoTargetListBid,
  createOptCampaignNegativeProductTargets,
  createOptNegativeProductTargeting,
} from '../../redux/actions/targeting'

// Helper
import {
  formatValue,
  parseMoneyAsFloat,
  getSpecialKeywords,
} from '../../services/helper'

const BulkEditorOptimizationComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { auth, header } = store.getState()
  const { token } = auth
  const { currentUserId, currentStartDate, currentEndDate } = header
  const [currentTab, setCurrentTab] = useState('sku')

  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [selectedAdvancedOption, setSelectedAdvancedOption] = useState()
  const [selectedCampaignType, setSelectedCampaignOptions] = useState({
    label: 'Choose Campaign Type',
    value: '',
  })

  const [startDate, setStartDate] = useState(
    moment().subtract(29, 'day').startOf('day').toDate()
  )
  const [endDate, setEndDate] = useState(moment().endOf('day').toDate())

  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
  }
  const onSelectedCampaignOptions = (selectedCamapign) => {
    setSelectedCampaignOptions(selectedCamapign)
  }

  useEffect(() => {
    // Get Campaign Lists
    dispatch(getOptListCampaignsPopup({ token }))
  }, [token, dispatch])

  // on change date range
  useEffect(() => {
    if (
      !currentStartDate ||
      currentStartDate === '' ||
      !currentEndDate ||
      currentEndDate === ''
    ) {
      return
    }
    setStartDate(currentStartDate)
    setEndDate(currentEndDate)
  }, [currentStartDate, currentEndDate])

  // Load Ad Group Data when Click the select button on Campaigns
  const loadAdgroupData = (campaigns, type) => {
    // FIXME use current user id
    const campaignData = {
      campaignId: campaigns,
      user: currentUserId,
      token,
      type,
    }
    setSelectedCampaigns(campaigns)
    dispatch(getOptAdGroupByCampaignId({ campaignData, token }))
  }

  // Load Advanced Data
  const loadOptAdvancedData = (adgroups) => {
    if (!selectedAdvancedOption) return
    if (selectedAdvancedOption.value === 'FindAllNegative') {
      // FIXME use current user id, start data, end data and campaign type
      dispatch(
        getCampaignOptAdvancedNegativeBulk({
          adgroupData: {
            adgroupIds: adgroups.map(
              (selectedAdgroup) => selectedAdgroup.adgroupid
            ),
            campaignIds: selectedCampaigns,
            campaignType: selectedCampaignType.value,
            defaultsBid: adgroups.map((selectedAdgroup) => {
              return {
                adgroupId: selectedAdgroup.adgroupid,
                bid: selectedAdgroup.defaultbid,
              }
            }),
            endDate: endDate,
            startDate: startDate,
            filterOption: selectedAdvancedOption.value,
            token,
            user: currentUserId,
          },
          token,
        })
      )
    } else if (
      selectedAdvancedOption.value === 'FindWorstPerformingAutoTargeting'
    ) {
      let adgroupIds = ''
      adgroups.map((selectedAdgroup) => {
        adgroupIds += 'adGroupIds=' + selectedAdgroup.adgroupid + '&'
        return selectedAdgroup
      })
      // FIXME use current user id, start data, end data and campaign type
      dispatch(
        getCampaignOptAdvancedAutoTargetingBulk({
          adgroupData:
            adgroupIds +
            'campaignType=' +
            selectedCampaignType.value +
            '&endDate=' +
            endDate +
            '&onlyAuto=true&startDate=' +
            startDate +
            '&user=' +
            currentUserId,
          token,
        })
      )
    } else if (selectedAdvancedOption.value === 'FindWorstPerformingAdGroup') {
      // FIXME use current user id, and campaign type
      dispatch(
        getCampaignOptAdvancedWorstAdgBulk({
          adgroupData: {
            adgroups: adgroups.map(
              (selectedAdgroup) => selectedAdgroup.adgroupid
            ),
            campaignId: selectedCampaigns,
            campaignType: selectedCampaignType.value,
            selectedFilterAdGroup: '',
            token,
            user: currentUserId,
            worstPerformingAdGroups: true,
          },
          token,
        })
      )
    } else {
      // FIXME use current user id, start data, end data and campaign type
      dispatch(
        getCampaignOptAdvancedKeywordBulk({
          adgroupData: {
            adgroupIds: adgroups.map(
              (selectedAdgroup) => selectedAdgroup.adgroupid
            ),
            campaignIds: selectedCampaigns,
            campaignType: selectedCampaignType.value,
            defaultsBid: adgroups.map((selectedAdgroup) => {
              return {
                adgroupId: selectedAdgroup.adgroupid,
                bid: selectedAdgroup.defaultbid,
              }
            }),
            endDate: endDate,
            startDate: startDate,
            filterOption: selectedAdvancedOption.value,
            token,
            user: currentUserId,
          },
          token,
        })
      )
    }
  }

  // Load Data except Advanced
  const loadBulkData = (adgroups) => {
    // FIXME use current user id, start data, end data and campaign type
    const adgroupData = {
      adgroups: adgroups.map((selectedAdgroup) => selectedAdgroup.adgroupid),
      dateRangeFrom: startDate,
      dateRangeTo: endDate,
      user: currentUserId,
      token,
      campaignType: selectedCampaignType.value,
    }
    switch (currentTab) {
      case 'sku':
        dispatch(getCampaignOptSkusBulk({ adgroupData, token }))
        break
      case 'keyword':
        dispatch(
          getCampaignOptKeywordsBulk({
            adgroupData: {
              ...adgroupData,
              campaignType: selectedCampaignType.value,
              defaultsBid: adgroups.map((selectedAdgroup) => {
                return {
                  adgroupId: selectedAdgroup.adgroupid,
                  bid: selectedAdgroup.defaultbid,
                }
              }),
            },
            token,
          })
        )
        break
      case 'search-term':
        dispatch(
          getCampaignOptSearchTermBulk({
            adgroupData: {
              ...adgroupData,
              campaignType: selectedCampaignType.value,
              campaigns: selectedCampaigns,
              newTermOnly: false,
            },
            token,
          })
        )
        break
      case 'negative':
        dispatch(getCampaignOptNegativeBulk({ adgroupData, token }))
        break
      case 'advanced':
        loadOptAdvancedData(adgroups)
        break
      default:
        break
    }
  }

  // Selected Advanced Option
  const setSelectOption = (option) => {
    setSelectedAdvancedOption(option)
  }

  // Update Bulk Data: sku, keyword/target, search term, negative word/asisn, advanced
  const updateSkuBulkData = (state, selectedSkus) => {
    const skusChanged = selectedSkus
      .filter((sku) => sku.state !== state)
      .map((sku) => ({
        campaignId: sku.campaign_id,
        adGroupId: parseInt(sku.adgroup_id, 10),
        adId: parseInt(sku.ad_id, 10),
        sku: sku.sku,
        state,
      }))
    if (!skusChanged.length) {
      return
    }

    let strProductAds = ''
    skusChanged.map(
      (sku) => (strProductAds += '&productAds=' + JSON.stringify(sku))
    )

    const adgroupData =
      'campaignType=' +
      selectedCampaignType.value +
      strProductAds +
      '&user=' +
      currentUserId
    // FIXME use current user id, and campaign type
    dispatch(
      updateCampaignOptSkuAdListState({
        adgroupData,
        state,
        token,
      })
    )
  }

  // Update Keyword State
  const updateKeywordBulkData = (state, selectedKeywords) => {
    let keywordsChanged = selectedKeywords
      .filter(
        (keyword) =>
          keyword.keywordtext !== '(_targeting_auto_)' &&
          keyword.state !== 'archived'
      )
      .map((keyword) => ({
        keywordId: keyword.keywordId,
        targetId: keyword.targetId ? keyword.targetId : null,
        state,
      }))

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    // FIXME use current user id, and campaign type
    const keywordData = {
      keywordsArr: keywordsChanged,
      campaignType: selectedCampaignType.value,
      state,
      user: currentUserId,
      token,
    }

    dispatch(updateCampaignOptKeywordListState({ keywordData, token }))
  }

  // Update Advanced Keyword State
  const updateAdvancedKeywordBulkData = (filter, state, selectedKeywords) => {
    let keywordsChanged = selectedKeywords
      .filter(
        (keyword) =>
          keyword.keywordtext !== '(_targeting_auto_)' &&
          keyword.state !== 'archived'
      )
      .map((keyword) => ({
        keywordId: keyword.keywordId,
        targetId: keyword.targetId ? keyword.targetId : null,
        state,
      }))

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }
    // FIXME use current user id, and campaign type
    const keywordData = {
      keywordsArr: keywordsChanged,
      campaignType: selectedCampaignType.value,
      state,
      user: currentUserId,
      token,
    }
    dispatch(
      updateCampaignOptAdvancedKeywordListState({ keywordData, filter, token })
    )
  }

  // Update Advanced Targeting Auto State
  const updateAdvancedAutoTargetBulkData = (type, selectedAutoTargets) => {
    const targetsChange = selectedAutoTargets.map((target) => ({
      targetId: target.targetId,
      state: type,
    }))

    // FIXME use current user id, and campaign type
    const autoTargetData = {
      user: currentUserId,
      targets: targetsChange,
      campaignType: selectedCampaignType.value,
    }

    // updateProductTargeting
    dispatch(
      updateCampaignOptAdvancedAutoTargetListState({
        state: type,
        autoTargetData,
        token,
      })
    )
  }

  // Update Advanced Worst Ads
  const updateAdvancedWorstAdgBulkData = (type, selectedAdg) => {
    // FIXME use current user id, and campaign type
    const adgData =
      'adGroupId=' +
      selectedAdg.adgroupid +
      '&state=' +
      type +
      '&campaignType=' +
      selectedCampaignType.value +
      '&user=' +
      currentUserId
    dispatch(
      updateCampaignOptAdvancedWorstAdgState({ adgData, token, state: type })
    )
  }

  const updateAdvancedNegativeBulkData = (type, selectedNegatives) => {
    let keywordsAdGroupArr = []
    let keywordsCampaignArr = []

    selectedNegatives.map((selectedNegative) => {
      if (selectedNegative.adgroup_name === 'N/A') {
        keywordsCampaignArr = [
          ...keywordsCampaignArr,
          {
            keywordId: parseInt(selectedNegative.keyword_id),
            state: type === 'archived' ? 'deleted' : type,
          },
        ]
      } else {
        keywordsAdGroupArr = [
          ...keywordsAdGroupArr,
          {
            keywordId: parseInt(selectedNegative.keyword_id),
            state: type,
          },
        ]
      }
      return ''
    })

    if (keywordsCampaignArr.length) {
      let strKeywordsCamapgin = ''
      keywordsCampaignArr.map(
        (keyword) =>
          (strKeywordsCamapgin +=
            '&negativeKeywordsIdArr=' + JSON.stringify(keyword))
      )
      // FIXME use current user id
      const negativeData = strKeywordsCamapgin + '&user=' + currentUserId
      dispatch(
        updateCampaignOptAdvancedCampaignNegativeKeywordListState({
          selectedKeywords: keywordsCampaignArr,
          negativeData,
          state: type,
          token,
        })
      )
    }
    if (keywordsAdGroupArr.length) {
      let strKeywordsAdGroup = ''
      keywordsAdGroupArr.map(
        (keyword) =>
          (strKeywordsAdGroup += '&keywordsArr=' + JSON.stringify(keyword))
      )
      // FIXME use current user id
      const negativeData = strKeywordsAdGroup + '&user=' + currentUserId
      dispatch(
        updateCampaignOptAdvancedAdNegativeKeywordListState({
          negativeData,
          state: type,
          token,
        })
      )
    }
    return ''
  }

  // Update Keyword Bid
  const updateKeywordBid = (
    selectedAdjustBidOption,
    bidValue,
    selectedKeywords
  ) => {
    if (bidValue === 'n/a' || isNaN(bidValue) || parseFloat(bidValue) < 0.02) {
      return
    }

    let newBid = formatValue(bidValue, 'number', 2)

    let keywordsChanged = selectedKeywords
      .filter(
        (selectedKeyword) =>
          selectedKeyword.keywordtext !== '(_targeting_auto_)' &&
          selectedKeyword.state !== 'archived'
      )
      .map((selectedKeyword) => {
        newBid = formatValue(bidValue, 'number', 2)

        if (selectedAdjustBidOption.value === 'raiseBid') {
          newBid =
            parseMoneyAsFloat(selectedKeyword.bid, '$') *
            (1 + parseFloat(bidValue) / 100)
        } else if (selectedAdjustBidOption.value === 'lowerBid') {
          newBid =
            parseMoneyAsFloat(selectedKeyword.bid, '$') *
            (1 - parseFloat(bidValue) / 100)
        }

        return {
          keywordId: parseFloat(selectedKeyword.keywordId),
          bid: formatValue(newBid, 'number', 2),
          targetId: selectedKeyword.targetId ? selectedKeyword.targetId : null,
        }
      })

    if (!keywordsChanged.length) {
      return
    }

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    let strKeywordsChanged = ''
    keywordsChanged.map(
      (keyword) =>
        (strKeywordsChanged += '&keywords=' + JSON.stringify(keyword))
    )
    // FIXME use current user id and dynamic campaignType
    const keywordData =
      'adjustType=' +
      selectedAdjustBidOption.value +
      '&campaignType=' +
      selectedCampaignType.value +
      strKeywordsChanged +
      '&changeToNewBid=' +
      false +
      '&newAdjustBid=1&user=' +
      currentUserId

    const type = 'adjustBid'
    dispatch(
      updateCampaignOptKeywordListBid({
        keywordData,
        campaignType: selectedCampaignType.value,
        type,
        adjustType: selectedAdjustBidOption.value,
        newAdjustBid: bidValue,
        token,
      })
    )
  }

  // Update Advanced Keyword Bid
  const updateAdvancedKeywordBid = (
    filter,
    selectedAdjustBidOption,
    bidValue,
    selectedKeywords
  ) => {
    if (bidValue === 'n/a' || isNaN(bidValue) || parseFloat(bidValue) < 0.02)
      return

    let newBid = formatValue(bidValue, 'number', 2)

    let keywordsChanged = selectedKeywords
      .filter(
        (selectedKeyword) =>
          selectedKeyword.keywordtext !== '(_targeting_auto_)' &&
          selectedKeyword.state !== 'archived'
      )
      .map((selectedKeyword) => {
        newBid = formatValue(bidValue, 'number', 2)

        if (selectedAdjustBidOption.value === 'raiseBid') {
          newBid =
            parseMoneyAsFloat(selectedKeyword.bid, '$') *
            (1 + parseFloat(bidValue) / 100)
        } else if (selectedAdjustBidOption.value === 'lowerBid') {
          newBid =
            parseMoneyAsFloat(selectedKeyword.bid, '$') *
            (1 - parseFloat(bidValue) / 100)
        }

        return {
          keywordId: parseFloat(selectedKeyword.keywordId),
          bid: formatValue(newBid, 'number', 2),
          targetId: selectedKeyword.targetId ? selectedKeyword.targetId : null,
        }
      })

    if (!keywordsChanged.length) return

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    let strKeywordsChanged = ''
    keywordsChanged.map(
      (keyword) =>
        (strKeywordsChanged += '&keywords=' + JSON.stringify(keyword))
    )
    // FIXME use current user id and dynamic campaignType
    const keywordData =
      'adjustType=' +
      selectedAdjustBidOption.value +
      '&campaignType=' +
      selectedCampaignType.value +
      strKeywordsChanged +
      '&changeToNewBid=' +
      false +
      '&newAdjustBid=1&user=' +
      currentUserId

    const type = 'adjustBid'
    dispatch(
      updateCampaignOptAdvancedKeywordListBid({
        filter,
        campaignType: selectedCampaignType.value,
        keywordData,
        type,
        adjustType: selectedAdjustBidOption.value,
        newAdjustBid: bidValue,
        token,
      })
    )
  }

  // Update Auto Target Bid
  const updateAutoTargetBid = (
    selectedAdjustBidOption,
    bidValue,
    selectedTargets
  ) => {
    if (bidValue === 'n/a' || isNaN(bidValue) || parseFloat(bidValue) < 0.02)
      return

    let newBid = formatValue(bidValue, 'number', 2)
    let targetsChanged = selectedTargets.map((selectedTarget) => {
      newBid = formatValue(bidValue, 'number', 2)

      if (selectedAdjustBidOption.value === 'raiseBid') {
        newBid =
          parseMoneyAsFloat(selectedTarget.bid, '$') *
          (1 + parseFloat(bidValue) / 100)
      } else if (selectedAdjustBidOption.value === 'lowerBid') {
        newBid =
          parseMoneyAsFloat(selectedTarget.bid, '$') *
          (1 - parseFloat(bidValue) / 100)
      }

      return {
        bid: formatValue(newBid, 'number', 2),
        targetId: selectedTarget.targetId ? selectedTarget.targetId : null,
      }
    })

    if (!targetsChanged.length) return

    // FIXME use current user id and dynamic campaignType
    const autoTargetData = {
      user: currentUserId,
      targets: targetsChanged,
      campaignType: selectedCampaignType.value,
    }

    // updateProductTargeting
    dispatch(
      updateCampaignOptAdvancedAutoTargetListBid({
        adjustType: selectedAdjustBidOption.value,
        newAdjustBid: bidValue,
        autoTargetData,
        token,
      })
    )
  }

  // Change Bid to new bid
  const changeToNewBid = (selectedKeywords) => {
    let keywordsChanged = selectedKeywords
      .filter(
        (keyword) =>
          keyword.keywordtext !== '(_targeting_auto_)' &&
          keyword.newbid !== 'n/a' &&
          keyword.newbid >= 0.02
      )
      .map((keyword) => ({
        keywordId: keyword.keywordId,
        bid: keyword.newbid,
        targetId: keyword.targetId ? keyword.targetId : null,
      }))

    if (!keywordsChanged.length) return

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    let strKeywordsChanged = ''
    keywordsChanged.map(
      (keyword) =>
        (strKeywordsChanged += '&keywords=' + JSON.stringify(keyword))
    )
    const keywordData =
      '&campaignType=' +
      selectedCampaignType.value +
      '&changeToNewBid=' +
      true +
      strKeywordsChanged +
      '&user=' +
      currentUserId

    const type = 'changeToNewBid'
    dispatch(
      updateCampaignOptKeywordListBid({
        type,
        campaignType: selectedCampaignType.value,
        keywordData,
        token,
      })
    )
  }

  // Change Advanced Bid to new Bid
  const changeAdvancedToNewBid = (filter, selectedKeywords) => {
    let keywordsChanged = selectedKeywords
      .filter(
        (keyword) =>
          keyword.keywordtext !== '(_targeting_auto_)' &&
          keyword.newbid !== 'n/a' &&
          keyword.newbid >= 0.02
      )
      .map((keyword) => ({
        keywordId: keyword.keywordId,
        bid: keyword.newbid,
        targetId: keyword.targetId ? keyword.targetId : null,
      }))

    if (!keywordsChanged.length) return

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    let strKeywordsChanged = ''
    keywordsChanged.map(
      (keyword) =>
        (strKeywordsChanged += '&keywords=' + JSON.stringify(keyword))
    )
    // FIXME use current user id and dynamic campaignType
    const keywordData =
      '&campaignType=' +
      selectedCampaignType.value +
      '&changeToNewBid=' +
      true +
      strKeywordsChanged +
      '&user=' +
      currentUserId

    const type = 'changeToNewBid'
    dispatch(
      updateCampaignOptAdvancedKeywordListBid({
        filter,
        campaignType: selectedCampaignType.value,
        type,
        keywordData,
        token,
      })
    )
  }

  // Change Bid to Max Cpc
  const changeToMaxCpc = (selectedKeywords) => {
    let keywordsChanged = selectedKeywords
      .filter(
        (keyword) =>
          keyword.keywordtext !== '(_targeting_auto_)' &&
          keyword.maxcpc &&
          keyword.maxcpc >= 0.02
      )
      .map((keyword) => ({
        keywordId: keyword.keywordId,
        bid: keyword.maxcpc,
        targetId: keyword.targetId ? keyword.targetId : null,
      }))

    if (!keywordsChanged.length) return

    // Get keywordId Unique array
    keywordsChanged = [
      ...new Map(
        keywordsChanged.map((item) => [item['keywordId'], item])
      ).values(),
    ]

    if (!keywordsChanged.length) {
      return
    }

    let strKeywordsChanged = ''
    keywordsChanged.map(
      (keyword) =>
        (strKeywordsChanged += '&keywords=' + JSON.stringify(keyword))
    )
    // FIXME use current user id and dynamic campaignType
    const keywordData =
      '&campaignType=' +
      selectedCampaignType.value +
      '&changeToNewBid=' +
      true +
      strKeywordsChanged +
      '&user=' +
      currentUserId

    const type = 'changeToMaxBid'
    dispatch(
      updateCampaignOptKeywordListBid({
        type,
        campaignType: selectedCampaignType.value,
        keywordData,
        token,
      })
    )
  }

  // Add targets ( search terms and targets ) to Campaign Level Negative
  const addNegativeToCampaignLevel = (
    guideText,
    selectedMatchType,
    selectedTerms
  ) => {
    let negatives = []
    let listNegativeWordsForAdding = []
    let negativesData = []
    let negativeWordsData = []

    selectedTerms.map((term) => {
      const checkedCondition =
        guideText === 'search term'
          ? term.targetingtype !== 'auto'
          : term.targetingtype !== 'auto'

      if (checkedCondition) {
        listNegativeWordsForAdding = [
          ...listNegativeWordsForAdding,
          {
            campaignId: parseInt(term.campaignid),
            keywordText: term.search ? term.search.trim() : '',
            matchType: selectedMatchType.value,
            state: 'enabled',
          },
        ]
      } else {
        negativesData = [...negativesData, term]
        negativesData = negativesData.filter((negativeData) =>
          /^(B|b)([0-9]{2}[0-9a-zA-Z]{7}|[0-9]{9})$/g.test(negativeData.search)
        )
        negativeWordsData = [...negativeWordsData, term]
        negativeWordsData = negativeWordsData.filter(
          (negativeWordData) =>
            !/^(B|b)([0-9]{2}[0-9a-zA-Z]{7}|[0-9]{9})$/g.test(
              negativeWordData.search
            )
        )
        listNegativeWordsForAdding = negativeWordsData.map(
          (negativeWordData) => {
            return {
              campaignId: parseInt(negativeWordData.campaignid),
              keywordText: negativeWordData.search
                ? negativeWordData.search.trim()
                : '',
              matchType:
                selectedMatchType.value === 'exact'
                  ? 'negativeExact'
                  : 'negativePhrase',
              state: 'enabled',
            }
          }
        )
      }

      return ''
    })

    negativesData.map((negativeData) => {
      negatives = [
        ...negatives,
        {
          campaignId: parseInt(negativeData.campaignid),
          expressionType: 'manual',
          state: 'enabled',
          expression: [
            {
              value: negativeData.search.trim(),
              type: 'asinSameAs',
            },
          ],
        },
      ]
      return ''
    })

    const specialKeywords = getSpecialKeywords(listNegativeWordsForAdding)
    const campaignNegativeKeywords = listNegativeWordsForAdding.filter(
      (item) =>
        !specialKeywords.find(
          (keyword) => keyword.keywordText === item.keywordText
        )
    )

    if (negatives.length > 0) {
      // FIXME use current user id
      const negativeData = { userId: currentUserId, negatives }
      // createCampaignNegativeProductTargets
      dispatch(createOptCampaignNegativeProductTargets({ negativeData, token }))
    }

    if (
      campaignNegativeKeywords.length ||
      listNegativeWordsForAdding.length > 0
    ) {
      // FIXME use current user id
      const negativeData = { userId: currentUserId, campaignNegativeKeywords }
      // createCampaignNegativeKeywords
      dispatch(createOptCampaignNegativeKeywords({ negativeData, token }))
    }
  }

  // Add targets ( search terms and targets ) to Campaign Level Negative
  const addNegativeToAdGroupsLevel = (
    guideText,
    selectedMatchType,
    selectedTerms
  ) => {
    let negatives = []
    let listNegativeWordsForAdding = []
    let negativesData = []
    let negativeWordsData = []

    selectedTerms.map((term) => {
      const checkedCondition =
        guideText === 'search term'
          ? term.targetingtype !== 'auto'
          : term.targetingtype !== 'auto'

      if (checkedCondition) {
        listNegativeWordsForAdding = [
          ...listNegativeWordsForAdding,
          {
            campaignId: parseInt(term.campaignid),
            adGroupId: parseInt(term.adgroupid),
            keywordText: term.search ? term.search.trim() : '',
            matchType: selectedMatchType.value,
            state: 'enabled',
          },
        ]
      } else {
        negativesData = [...negativesData, term]
        negativesData = negativesData.filter((negativeData) =>
          /^(B|b)([0-9]{2}[0-9a-zA-Z]{7}|[0-9]{9})$/g.test(negativeData.search)
        )
        negativeWordsData = [...negativeWordsData, term]
        negativeWordsData = negativeWordsData.filter(
          (negativeWordData) =>
            !/^(B|b)([0-9]{2}[0-9a-zA-Z]{7}|[0-9]{9})$/g.test(
              negativeWordData.search
            )
        )
        listNegativeWordsForAdding = negativeWordsData.map(
          (negativeWordData) => {
            return {
              campaignId: parseInt(negativeWordData.campaignid),
              adGroupId: parseInt(negativeWordData.adgroupid),
              keywordText: negativeWordData.search
                ? negativeWordData.search.trim()
                : '',
              matchType:
                selectedMatchType.value === 'exact'
                  ? 'negativeExact'
                  : 'negativePhrase',
              state: 'enabled',
            }
          }
        )
      }
      return ''
    })

    negativesData.map((negativeData) => {
      negatives = [
        ...negatives,
        {
          campaignId: parseInt(negativeData.campaignid),
          adGroupId: parseInt(negativeData.adgroupid),
          expressionType: 'manual',
          state: 'enabled',
          expression: [
            {
              value: negativeData.search.trim(),
              type: 'asinSameAs',
            },
          ],
        },
      ]

      return ''
    })

    const specialKeywords = getSpecialKeywords(listNegativeWordsForAdding)
    const campaignNegativeKeywords = listNegativeWordsForAdding.filter(
      (item) =>
        !specialKeywords.find(
          (keyword) => keyword.keywordText === item.keywordText
        )
    )

    if (negatives.length > 0) {
      // FIXME use current user id
      const negativeData = { userId: currentUserId, negatives }
      // createNegativeProductTargeting
      dispatch(createOptNegativeProductTargeting({ negativeData, token }))
    }

    if (
      campaignNegativeKeywords.length ||
      listNegativeWordsForAdding.length > 0
    ) {
      const negativeData = { userId: currentUserId, campaignNegativeKeywords }
      dispatch(createOptNegativeKeywords({ negativeData, token }))
    }
  }

  const updateBulkData = (page, type, data) => {
    switch (page) {
      case 'sku':
        updateSkuBulkData(type, data)
        break
      case 'keyword':
        updateKeywordBulkData(type, data)
        break
      case 'advanced-most-keyword':
        updateAdvancedKeywordBulkData('FindMost', type, data)
        break
      case 'advanced-zero-keyword':
        updateAdvancedKeywordBulkData('FindZero', type, data)
        break
      case 'advanced-low-keyword':
        updateAdvancedKeywordBulkData('FindLow', type, data)
        break
      case 'advanced-find-keyword':
        updateAdvancedKeywordBulkData('FindKeywords', type, data)
        break
      case 'advanced-high-keyword':
        updateAdvancedKeywordBulkData('FindHigh', type, data)
        break
      case 'advanced-autotarget':
        updateAdvancedAutoTargetBulkData(type, data)
        break
      case 'advanced-worst-adg':
        updateAdvancedWorstAdgBulkData(type, data)
        break
      case 'advanced-negative':
        updateAdvancedNegativeBulkData(type, data)
        break
      default:
        break
    }
  }

  return (
    <div className='bulk-editor-tab-content'>
      <div className='bulk-header'>
        <div className='header-input'>
          <span>Campaigns</span>
          <CampaignSelectComponent
            loadAdgroupData={loadAdgroupData}
            onSelectCampaignType={onSelectedCampaignOptions}
            selectedCampaignType={selectedCampaignType}
          />
        </div>
        <div className='header-input'>
          <span>Ad Groups</span>
          <AdgroupsSelectComponent loadBulkData={loadBulkData} />
        </div>
      </div>
      <div className="bulk-tabs">
        {selectedCampaignType.value === 'Sponsored Brands' ? '' :
          <>
            <div className={currentTab === 'sku' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('sku')}>SKUs</div>
          </>
        }
        <div className={currentTab === 'keyword' ? "bulk-tab selected" : "bulk-tab"} onClick={() => handleChangeTab('keyword')}>Keyword/Target</div>
        {selectedCampaignType.value === 'Sponsored Displays' ? '' :
          <>
            <div
              className={
                currentTab === 'search-term' ? 'bulk-tab selected' : 'bulk-tab'
              }
              onClick={() => handleChangeTab('search-term')}
            >
              Search Terms
            </div>
            <div
              className={
                currentTab === 'negative' ? 'bulk-tab selected' : 'bulk-tab'
              }
              onClick={() => handleChangeTab('negative')}
            >
              Negative Word/ASIN
            </div>
          </>
        }
        <div
          className={
            currentTab === 'advanced' ? 'bulk-tab selected' : 'bulk-tab'
          }
          onClick={() => handleChangeTab('advanced')}
        >
          Advanced
        </div>
      </div>
      {currentTab === 'sku' && (
        <OptimizationSkuComponent updateBulkData={updateBulkData} />
      )}
      {currentTab === 'keyword' && (
        <OptimizationKeywordComponent
          updateBulkData={updateBulkData}
          updateBid={updateKeywordBid}
          changeToNewBid={changeToNewBid}
          changeToMaxCpc={changeToMaxCpc}
        />
      )}
      {currentTab === 'search-term' && (
        <OptimizationSearchTermComponent
          addNegativeToCampaignLevel={addNegativeToCampaignLevel}
          addNegativeToAdGroupsLevel={addNegativeToAdGroupsLevel}
          selectedCampaigns={selectedCampaigns}
        />
      )}
      {currentTab === 'negative' && (
        <OptimizationNegativeComponent
          addNegativeToCampaignLevel={addNegativeToCampaignLevel}
          addNegativeToAdGroupsLevel={addNegativeToAdGroupsLevel}
          selectedCampaigns={selectedCampaigns}
        />
      )}
      {currentTab === 'advanced' && (
        <OptimizationAdvancedComponent
          setSelectOption={setSelectOption}
          updateBulkData={updateBulkData}
          updateBid={updateAdvancedKeywordBid}
          changeToNewBid={changeAdvancedToNewBid}
          updateAutoTargetBid={updateAutoTargetBid}
          campaignType={selectedCampaignType.value}
        />
      )}
    </div>
  )
}

export default BulkEditorOptimizationComponent
