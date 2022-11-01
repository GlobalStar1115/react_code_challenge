import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'

import TableComponent from '../../CommonComponents/TableComponent'
import LoaderComponent from '../../CommonComponents/LoaderComponent'
import PaginationComponent from '../../CommonComponents/PaginationComponent'

import {
  getAdgroupAndNumberOfKeywords,
  getCampaignsByIds,
  getCampaignExKeywordByCampaignAndAdgroup,
  createExBiddableKeywords,
} from '../../../redux/actions/campaign'

import {
  MAX_KEYWORD_SELECTED,
} from '../../../utils/constants/defaultValues'

const ExpansionModalAddKeywordsToExsitingCampaign = ({ pageForAdd, onHideModal, keywords, campaigns, ...props }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { campaign } = store.getState()
  const {
    isExCampaignsByIdsBulkLoading,
    exCampaignsByIdsBulk,
    isExAdgroupNumberKeywordsBulkLoading,
    exAdgroupAndNumberKeywordsBulk,
    isExKeywordsByCampaignIdAndAdgroupIdBulkLoading,
    exKeywordsByCampaignIdAndAdgroupIdBulk,
  } = campaign

  const [ keywordsData, setKeywordsData ] = useState([])
  const [ campaignsData, setCampaignsData ] = useState([])
  const [ selectedCampaign, setSelectedCampaign ] = useState([])
  const [ adgroupsData, setAdgroupsData ] = useState([])
  const [ selectedAdgroup, setSelectedAdgroup ] = useState([])
  const [ step, setStep ] = useState(1)

  const [ pageStartNum, setPageStartNum ] = useState(0)
  const [ pageEndNum, setPageEndNum ] = useState(10)

  const keywordTableFields = [
    { value: 'keyword', label: 'keywordText' },
  ]
  const searchTermTableFields = [
    { value: 'search', label: 'Search Terms' },
  ]
  const campaignTableFiedls = [
    { value: 'name', label: 'campaign' },
  ]

  const adgroupTableFields = [
    { value: 'name', label: 'Adgroup' },
  ]

  const matchOptions = [
    { value: 'broad', label: 'Broad' },
    { value: 'phrase', label: 'Phrase' },
    { value: 'exact', label: 'Exact' },
  ]
  // load campaigns
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      return
    }
    loadCampaigns()
  }, [campaigns]) // eslint-disable-line

  // initial keywords data
  useEffect(() => {
    if (!keywords || keywords.length === 0) {
      return
    }
    setKeywordsData(
      keywords.map(keyword => ({
        ...keyword,
        checked: true,
      }))
    )
  }, [keywords, pageForAdd])

  // initial campaigns data
  useEffect(() => {
    if (!exCampaignsByIdsBulk || exCampaignsByIdsBulk.length === 0) {
      return
    }
    setCampaignsData(exCampaignsByIdsBulk.filter(campaign => campaign.targeting_type !== 'auto').map(campaign => (
      {
        ...campaign,
        checked: selectedCampaign.length > 0 ? campaign.campaign_id === selectedCampaign[0].campaign_id : false,
      }
    )))
  }, [exCampaignsByIdsBulk, selectedCampaign])

  // initial adgroups data
  useEffect(() => {
    if (!exAdgroupAndNumberKeywordsBulk || exAdgroupAndNumberKeywordsBulk.length === 0) {
      return
    }
    setAdgroupsData(exAdgroupAndNumberKeywordsBulk.map(adgroup => (
      {
        ...adgroup,
        checked: selectedAdgroup.length > 0 ? adgroup.adGroupId === selectedAdgroup[0].adGroupId : false,
      }
    )))
  }, [exAdgroupAndNumberKeywordsBulk, selectedAdgroup])

  // load campaigns
  const loadCampaigns = () => {
    if (!campaigns || campaigns.length === 0) {
      return
    }
    let strCampaigns = ''
    campaigns.forEach(campaign=>strCampaigns += `campaigns=${campaign.campaignid}&`)
    // FIXME use current user id
    dispatch(getCampaignsByIds({ userId: 238, campaignIds: strCampaigns }))
  }

  // load adgroups with campaign id
  const loadAdgroups = () => {
    // FIXME use current user id
    dispatch(getAdgroupAndNumberOfKeywords({ userId: 238, campaignId: selectedCampaign[0].campaign_id }))
  }

  // load existing keywords with campaign id and adgroup id
  const loadKeywordsByCampaignIdAndAdgroupId = ({ campaignId, adgroupId }) => {
    dispatch(
      // FIXME: use current user id
      getCampaignExKeywordByCampaignAndAdgroup({ userId: 238, campaignId, adgroupId })
    )
  }

  const checkKeyword = (val, data) => {
    setKeywordsData(keywordsData.map(keyword => {
      if ((pageForAdd === 'Keywords' && keyword.keyword === data.keyword) || (pageForAdd === 'Search Terms' && keyword.search === data.search)) {
        return { ...keyword, checked: val }
      }
      return { ...keyword }
    }))
  }

  const checkAllKeyword = (val) => {
    setKeywordsData(keywordsData.map(keyword => (
      {
        ...keyword,
        checked: val
      }
    )))
  }

  const checkCampaign = (val, data) => {
    if (val) {
      setSelectedCampaign([data])
    } else {
      setSelectedCampaign([])
    }
  }

  const checkAdgroup = (val, data) => {
    if (val) {
      setSelectedAdgroup([data])
      loadKeywordsByCampaignIdAndAdgroupId({
        campaignId: parseInt(selectedCampaign[0].campaign_id, 10),
        adgroupId: parseInt(data.adGroupId, 10),
       })
    } else {
      setSelectedAdgroup([])
    }
  }

  // go to next step
  const handleNextStep = () => {
    if (keywordsData.filter(keyword => keyword.checked).length === 0 || selectedCampaign.length === 0) {
      return
    }
    loadAdgroups()
    setStep(2)
  }

  // go to first step
  const handlePreviousStep = () => {
    setStep(1)
  }

  const handleChangeKeywordBid = (val, keyword) => {
    setKeywordsData(keywordsData.map(oldKeyword => {
      const condition = (pageForAdd === 'Keywords' && oldKeyword.keyword === keyword.keyword) || (pageForAdd === 'Search Terms' && oldKeyword.search === keyword.search)
      if (condition) {
        return {
          ...oldKeyword,
          bid: parseFloat(val),
        }
      }
      return oldKeyword
    }))
  }

  const handleChangeKeywordMatchType = (val, keyword) => {
    setKeywordsData(keywordsData.map(oldKeyword => {
      const condition = (pageForAdd === 'Keywords' && oldKeyword.keyword === keyword.keyword) || (pageForAdd === 'Search Terms' && oldKeyword.search === keyword.search)
      if (!condition) {
        return oldKeyword
      }
      if (pageForAdd === 'Keywords') {
        return {
          ...oldKeyword,
          matchType: val.value
        }
      }
      return {
        ...oldKeyword,
        match1: val.value
      }
    }))
  }

  const loadKeywordsPageData = ( pageNum, pageRow ) => {
    setPageStartNum((pageNum - 1) * pageRow)
    setPageEndNum(pageNum * pageRow)
  }

  // Add Keyowrds to Existing Campaign
  const handleAddKeywordsToCampaign = () => {
    if (!selectedAdgroup || selectedAdgroup.length === 0) {
      return
    }
    if (!isExKeywordsByCampaignIdAndAdgroupIdBulkLoading) {
      return
    }
    if (step !== 2) {
      return
    }
    const keywords = keywordsData.map(keyword => ({
      adGroupId: parseInt(selectedAdgroup[0].adGroupId, 10),
      campaignId: parseInt(selectedCampaign[0].campaign_id, 10),
      state: 'enabled',
      keywordText: pageForAdd === 'Search Terms' ? keyword.search : keyword.keyword,
      matchType: pageForAdd === 'Search Terms' ? keyword.match1.toLowerCase() : keyword.matchType.toLowerCase(),
      bid: keyword.bid ? keyword.bid : selectedAdgroup[0].defaultBid,
    }))

    const existingKeywords = [...exKeywordsByCampaignIdAndAdgroupIdBulk]
    if (existingKeywords.length >= MAX_KEYWORD_SELECTED)
      return
    const duplicateKeywords = []
    existingKeywords.forEach(existKeyword => {
      keywords.forEach(keyword => {
        if (existKeyword.keywordText === keyword.keywordText && existKeyword.matchType === keyword.matchType) {
          duplicateKeywords.push(existKeyword)
        }
      })
    })

    let canAddKeywords = []
    keywords.forEach(keyword => {
      const newList = duplicateKeywords.filter(duplicateKeyword => duplicateKeyword.keywordText === keyword.keywordText && duplicateKeyword.matchType === keyword.matchType)
      if (newList.length > 0 ) {
        return
      }
      canAddKeywords.push(keyword)
    })

    // all keywords are already used
    if (duplicateKeywords.length === keywords.length) {
      return
    }

    if (existingKeywords.length + canAddKeywords.length > MAX_KEYWORD_SELECTED) {
      const amountNeedRemove = Math.abs(MAX_KEYWORD_SELECTED - existingKeywords.length - canAddKeywords.length)
      canAddKeywords = canAddKeywords.slice(amountNeedRemove, canAddKeywords.length)
    }

    dispatch(
      createExBiddableKeywords({ userId: 238, keywords: canAddKeywords })
    )
  }

  const renderFirstStep = () => {
    return (
      <div className="page-row">
        <div className="page-title">
          <h4>Step 1</h4>
        </div>
        <div className="flex page-content">
          <div className="section keyword">
            <div className="section-title">
              <h5>Confirm keywords</h5>
            </div>
            <div className="section-content">
              <TableComponent
                fields = { pageForAdd === 'Keywords' ? keywordTableFields : searchTermTableFields }
                rows = { keywordsData }
                showColumns
                showTools
                showCheckColumn
                showSearch
                checkHandle = { checkKeyword }
                checkAll = { checkAllKeyword }
                pageRows = { 5 }
              />
            </div>
          </div>
          <div className="section campaign">
            <div className="section-title">
              <h5>Select 1 Campaign to add keywords</h5>
            </div>
            <div className={ isExCampaignsByIdsBulkLoading ? "section-content loading" : "section-content" }>
              { isExCampaignsByIdsBulkLoading && <LoaderComponent /> }
              <TableComponent
                fields = { campaignTableFiedls }
                rows = { campaignsData }
                showColumns
                showTools
                showCheckColumn
                showSearch
                checkHandle = { checkCampaign }
                pageRows = { 5 }
              />
            </div>
          </div>
        </div>
        <div className="action">
          <button type="button" className="btn btn-blue" onClick={ handleNextStep }>Next Step</button>
        </div>
      </div>
    )
  }

  const renderSecondStep = () => {
    const selectedKeywords = keywordsData.filter(keyword => keyword.checked).map(keyword => (
      {
        ...keyword,
        bid: keyword.bid ? keyword.bid : selectedAdgroup.length > 0 ? selectedAdgroup[0].defaultBid : 0
      }
    ))
    return (
      <div className="page-row">
        <div className="page-title">
          <h4>Step 2</h4>
        </div>
        <div className="flex page-content">
          <div className="section adgroup">
            <div className="section-title">
              <h5>Select one Adgroup</h5>
            </div>
            <div className={ isExAdgroupNumberKeywordsBulkLoading ? "section-content loading" : "section-content" }>
              { isExAdgroupNumberKeywordsBulkLoading && <LoaderComponent /> }
              <TableComponent
                fields = { adgroupTableFields }
                rows = { adgroupsData }
                showColumns
                showTools
                showCheckColumn
                showSearch
                pageRows = { 5 }
                checkHandle = { checkAdgroup }
              />
            </div>
          </div>
          <div className="section bid">
            <div className="section-title">
              <h5>Confirm Bid Price and Match Type</h5>
            </div>
            <div className="section-content">
              <div className="keywords">
                <div className="item header">
                  <div className="keyword">
                    <span>Keyword</span>
                  </div>
                  <div className="match">
                    <span>Match Type</span>
                  </div>
                  <div className="bid">
                    <span>Bid</span>
                  </div>
                </div>
                {
                  selectedKeywords.slice(pageStartNum, pageEndNum).map(keyword => {
                    const filteredOption = matchOptions.filter(option => (pageForAdd === 'Keywords' && option.value === keyword.matchType.toLowerCase()) || (pageForAdd === 'Search Terms' && option.value === keyword.match1.toLowerCase()))
                    const selectedOption = filteredOption.length > 0 ? filteredOption[0] : {}
                    return (
                      <div className = "item" key = { pageForAdd === 'Keywords' ? keyword.keyword : keyword.search }>
                        <div className = "keyword">
                          <span>{ pageForAdd === 'Keywords' ? keyword.keyword : keyword.search }</span>
                        </div>
                        <div className="match">
                          <Select
                            options = { matchOptions }
                            value = { selectedOption }
                            onChange = { val => { handleChangeKeywordMatchType(val, keyword) }}
                          />
                        </div>
                        <div className="bid">
                          <input type="number" className="bid-input" value={ keyword.bid } onChange={ e => { handleChangeKeywordBid(e.target.value, keyword) }}/>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <PaginationComponent
                total = { selectedKeywords.length }
                loadData = { loadKeywordsPageData }
                pageNeighbours = { 1 }
                pageRows = { 5 }
              />
            </div>
          </div>
        </div>
        <div className="action">
          <button type="button" className="btn btn-blue" onClick={ handlePreviousStep }>Previous Step</button>
          <button type="button" className="btn btn-red" onClick={ handleAddKeywordsToCampaign }>Add</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal existing-campaign-modal">
      <div className="modal-content">
        <button type="button" onClick={ () => { onHideModal() }} className="close">&times;</button>
        <div className="container">
          <div className="title">
            <h3>Add { pageForAdd } to campaign</h3>
          </div>
          { step === 1 && renderFirstStep() }
          { step === 2 && renderSecondStep() }
        </div>
      </div>
    </div>
  )
}
export default ExpansionModalAddKeywordsToExsitingCampaign