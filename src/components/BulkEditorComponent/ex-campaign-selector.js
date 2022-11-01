import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

const ExCampaignSelector = (props) => {
  const store = useStore()

  const {
    campaign: { allCampaigns, isAllCampaignsLoading, campaignsByKeyword, isCampaignsByKeywordLoading }
  } = store.getState()

  const { handleChangeCampaigns, tab } = props
  const [ selectedCampaigns, setSelectedCampaigns ] = useState([])
  const [ showSelector, setShowSelector ] = useState(false)
  const [ campaignData, setCampaignData ] = useState([])

  // show customized campaign select box
  const handleClickShowSelector = () => {
    setShowSelector(!showSelector)
  }

  // select campaign table row
  const checkHandle = (checked, data) => {
    let newSelectedCampaigns = selectedCampaigns
    if (checked) {
      newSelectedCampaigns = [...newSelectedCampaigns, data]
    } else {
      newSelectedCampaigns = newSelectedCampaigns.filter(item => item.id !== data.id)
    }

    setSelectedCampaigns(newSelectedCampaigns)
    handleChangeCampaigns(newSelectedCampaigns)
  }

  const checkAll = (checked, data) => {
    let newSelectedCampaigns = []
    if (checked){
      newSelectedCampaigns = [...data]
    }

    setSelectedCampaigns(newSelectedCampaigns)
    handleChangeCampaigns(newSelectedCampaigns)
  }

  // Load ALl campaigns
  useEffect(() => {
    if (tab === 'keyword-search') {
      const campaignIds = campaignsByKeyword && campaignsByKeyword.length > 0 ? campaignsByKeyword.map(campaign=>campaign.campaignid) : []
      const newCampaigns = campaignIds.length > 0 && allCampaigns && allCampaigns.length > 0 ? allCampaigns.filter(campaign=>campaignIds.includes(campaign.campaignid)) : []
      if (newCampaigns.length === 0) {
        return
      }
      setCampaignData(newCampaigns.map(campaign => ({
        ...campaign,
        checked: selectedCampaigns && selectedCampaigns.length > 0 ? selectedCampaigns.filter(selectedCampaign => selectedCampaign.id === campaign.id).length > 0 : false,
      })))
    } else {
      if (!allCampaigns || allCampaigns.length === 0) {
        return
      }
      setCampaignData(allCampaigns.map(campaign => ({
        ...campaign,
        checked: selectedCampaigns && selectedCampaigns.length > 0 ? selectedCampaigns.filter(selectedCampaign => selectedCampaign.id === campaign.id).length > 0 : false,
      })))
    }
  }, [allCampaigns, selectedCampaigns, campaignsByKeyword, tab])

  // Ad group table fields
  const fields = [
    { label: 'Campaign', value: 'campaign' },
  ]

  return (
    <div className="selector-parent">
      <button type="button" onClick={ handleClickShowSelector }>Choose Campaigns</button>
      {
        showSelector &&
          <div className={ ( tab !== "keyword-search" && isAllCampaignsLoading ) || ( tab === "keyword-search" && (isCampaignsByKeywordLoading || isAllCampaignsLoading) ) ? "selector-container loading" : "selector-container"}>
            { (( tab !== "keyword-search" && isAllCampaignsLoading ) || ( tab === "keyword-search" && (isCampaignsByKeywordLoading || isAllCampaignsLoading) )) && <LoaderComponent /> }
            <div className="content">
              <div className="table-section">
                <TableComponent
                  fields={ fields }
                  rows={ campaignData }
                  totals={[]}
                  showTools
                  showColumns
                  checkHandle={ checkHandle }
                  checkAll={ checkAll }
                  pageRows={ 5 }
                  showCheckColumn
                  showSearch
                  showTotal
                />
              </div>
            </div>
          </div>
      }
    </div>
  )
}
export default ExCampaignSelector