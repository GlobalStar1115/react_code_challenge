import React, { useState, useEffect } from 'react'
import { useStore } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'
import Select, { components } from 'react-select'

import LoaderComponent from '../CommonComponents/LoaderComponent'

const getCampaignName = (campaign) => {
  let type = ''
  if (campaign.campaign_type === 'sponsoredProducts') {
    type = 'SP'
  } else if (campaign.campaign_type === 'sponsoredDisplays') {
    type = 'SD'
  } else if (campaign.campaign_type === 'headlineSearch') {
    type = 'SBV'
  } else {
    type = 'SB'
  }
  return `${campaign.campaign} (${type})`
}

const Option = (props) => {
  const { innerRef, innerProps, getStyles, data } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles('option', props)}
    >
      { getCampaignName(data) }
    </div>
  )
}

// https://github.com/JedWatson/react-select/issues/4170#issuecomment-682465724
const ValueContainer = (props) => {
  const { options, children, getValue } = props
  const selectCount = getValue().length
  let contents = children
  if (selectCount > 0) {
    if (selectCount === options.length) {
      contents = (
        <>
          All campaigns selected
          { children[1] }
        </>
      )
    } else if (selectCount >= 10) {
      contents = (
        <>
          { selectCount } campaigns selected
          { children[1] }
        </>
      )
    }
  }
  return (
    <components.ValueContainer {...props}>
      { contents }
    </components.ValueContainer>
  )
}

// actions


const CampaignSelectComponent = (props) => {
  const store = useStore()

  const { portfolio, campaign } = store.getState()
  const { listPortfolios } = portfolio

  const { optListCampaigns, isOptListCampaignsLoading } = campaign

  const { loadAdgroupData, onSelectCampaignType, selectedCampaignType } = props
  const [showSelector, setShowSelector] = useState(false)
  const [selectedCampaigns, setSelectedCampaigns] = useState([])
  const [campaignData, setCampaignData] = useState([])

  // PortfolioOptions
  const portfolioOptions = [
    {
      value: -1,
      label: 'All',
    },
    ...listPortfolios.map(data => ({
      value: data.portfolio_id,
      label: data.name,
    })
    )]

  // campaignOptions
  const campaignOptions = [
    { label: 'Choose Campaign Type', value: 'Choose Campaign Type' },
    { label: 'Sponsored Product', value: 'sponsoredProducts' },
    { label: 'Sponsored Display', value: 'sponsoredDisplays' },
    { label: 'Sponsored Brands', value: '' },
    { label: 'Sponsored Brands Video', value: 'headlineSearch' },
  ]

  // activeOptions
  const activeOptions = [
    { label: 'Active or Paused', value: 'active or paused' },
    { label: 'Active', value: 'enabled' },
    { label: 'Paused', value: 'paused' },
  ]
  const [selectedPortfoio, setSelectedPortfolio] = useState(portfolioOptions[0])
  const [selectedActive, setSelectedActive] = useState(activeOptions[1]) // eslint-disable-line

  useEffect(() => {
    setSelectedCampaigns([])
  }, [selectedCampaignType])

  // show customized campaign select box
  const handleClickShowSelector = () => {
    setShowSelector(!showSelector)
  }

  // Portfolio select box changed
  const handleChangePortfolio = (portfolio) => {
    setSelectedCampaigns([])
    setSelectedPortfolio(portfolio)
  }

  useEffect(() => {
    if (!optListCampaigns || !optListCampaigns.listCampaigns || optListCampaigns.listCampaigns.length === 0)
      return
    setCampaignData(optListCampaigns.listCampaigns)
  }, [optListCampaigns])


  const listCampaignTableData = campaignData ? campaignData.filter(filterCampaign => filterCampaign.campaign_type === selectedCampaignType.value).map(campaign =>
    (
      {
        ...campaign,
        checked: selectedCampaigns.filter(selectedCampaign => selectedCampaign === campaign.campaignid).length > 0
      }
    )
  ).filter(campaign => selectedPortfoio.value === -1 || campaign.portfolioid === selectedPortfoio.value)
    .filter(campaign => selectedActive.value === 'active or paused' ? campaign.state === 'enabled' || campaign.state === 'paused' : campaign.state === selectedActive.value) : []

  const handleSelectAll = () => {
    if (selectedCampaigns.length === listCampaignTableData.length) {
      // If all is selected, un-select all.
      loadAdgroupData([], '')
      setSelectedCampaigns([])
    } else {
      // Select all.
      loadAdgroupData(listCampaignTableData.map(campaign => campaign.id), selectedCampaignType.value)
      setSelectedCampaigns(listCampaignTableData.map(campaign => campaign.id))
    }
  }

  const handleChange = (selected) => {
    loadAdgroupData(selected.map(item => item.campaignid), selectedCampaignType.value)
    setSelectedCampaigns(selected.map(campaign => campaign.id))
  }

  const selection = listCampaignTableData.filter(campaign => selectedCampaigns.indexOf(campaign.id) !== -1)

  const onOutsideClick = (event) => {
    setShowSelector(false)
  }

  return (
    <div className="campaign-selector">
      {
        !showSelector && selectedCampaigns.length === 0 &&
        <button type="button" onClick={handleClickShowSelector}>Choose Campaigns</button>
      }
      {
        !showSelector && selectedCampaigns.length > 0 &&
        <div className="header-portfolio">
          <div className="smart-select-wrapper">
            <div className="select-wrapper">
              <Select
                options={listCampaignTableData}
                getOptionLabel={getCampaignName}
                getOptionValue={campaign => campaign.id}
                value={selection}
                components={{ Option, ValueContainer }}
                isMulti
                isLoading={isOptListCampaignsLoading}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                placeholder="Select campaigns..."
                onChange={handleChange}
              />
            </div>
            <div className="btn-wrapper">
              <button
                  type="button"
                  className="btn btn-white"
                  onClick={ handleSelectAll }
                >
                { (listCampaignTableData.length === 0 || listCampaignTableData.length !== selectedCampaigns.length) ? 'Select All' : 'Unselect All' }
              </button>
            </div>
          </div>
        </div>
      }
      {
        showSelector &&
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
          <div className={isOptListCampaignsLoading ? "selector-container loading" : "selector-container"}>
            {isOptListCampaignsLoading && <LoaderComponent />}
            <div className='header'>
              <Select
                options={campaignOptions}
                value={selectedCampaignType}
                onChange={(e) => onSelectCampaignType(e)}
              />
            </div>
            <div className="header-portfolio">
              <span>Portfolio</span>
              <div className="select-wrapper">
                <Select
                  options={portfolioOptions}
                  value={selectedPortfoio}
                  onChange={handleChangePortfolio}
                />
              </div>
            </div>
            <div className="header-portfolio">
              <span>Select Campaigns</span>
              <div className="smart-select-wrapper">
                <div className="select-wrapper">
                  <Select
                    options={listCampaignTableData}
                    getOptionLabel={getCampaignName}
                    getOptionValue={campaign => campaign.id}
                    value={selection}
                    components={{ Option, ValueContainer }}
                    isMulti
                    isLoading={isOptListCampaignsLoading}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    placeholder="Select campaigns..."
                    onChange={handleChange}
                  />
                </div>
                <div className="btn-wrapper">
                  <button
                      type="button"
                      className="btn btn-white"
                      onClick={ handleSelectAll }
                    >
                    { (listCampaignTableData.length === 0 || listCampaignTableData.length !== selectedCampaigns.length) ? 'Select All' : 'Unselect All' }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </OutsideClickHandler>
      }
    </div>
  )
}
export default CampaignSelectComponent
