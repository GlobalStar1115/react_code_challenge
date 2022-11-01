import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'

import ConfirmModal from '../../../../CommonComponents/ConfirmModal'
import { toast } from '../../../../CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../../../CommonComponents/LoaderComponent'

import {
  createPortfolio,
} from '../../../../../redux/actions/portfolio'

import {
  updateName,
  updateAcos,
  updatePortfolio,
  updateBidding,
} from '../../../../../redux/actions/campaignDetail'

const biddingStrategyOptions = [
  {
    value: 'legacyForSales',
    label: 'Dynamic bids - down only',
  },
  {
    value: 'autoForSales',
    label: 'Dynamic bids - up and down',
  },
  {
    value: 'manual',
    label: 'Fixed bids',
  },
]

const CampaignInfo = ({ isLoading, campaignDetail }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    campaignDetail: {
      isUpdatingName,
      isUpdatingAcos,
      isUpdatingPortfolio,
      isUpdatingBidding,
      currentAcos,
    },
    portfolio: {
      listPortfolios,
      isCreatingPortfolio,
      createdPortfolioResponse,
    },
    header: { currentUserId },
  } = store.getState()

  const [ campaignName, setCampaignName ] = useState('')
  const [ acos, setAcos ] = useState(0)
  const [ topSearch, setTopSearch ] = useState(0)
  const [ productPages, setProductPages ] = useState(0)
  const [biddingStrategy, setBiddingStrategy] = useState({
    value: 'legacyForSales',
    label: 'Dynamic bids - down only',
  })
  // operating
  const [ isOprNewPortfolio, setIsOprNewPortfolio ] = useState(false)
  // modal state
  const [ showModal, setShowModal ] = useState(false)
  const [ modalText, setModalText ] = useState('')
  const [ modalType, setModalType ] = useState('')
  const [ selectedPortfolio, setSelectedPortfolio ] = useState()
  const newPortfolioRef = useRef()
  const [ showPortfolioSection, setShowPortfolioSection ] = useState(false)

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  useEffect(() => {
    if (!campaignDetail || Object.keys(campaignDetail).length === 0) {
      return
    }
    if (campaignDetail.bidding) {
      const option = biddingStrategyOptions.find(option => option.value === campaignDetail.bidding.strategy)
      if (option) {
        setBiddingStrategy(option)
      }
    }
    setTopSearch(campaignDetail.topOfSearchPercent)
    setProductPages(campaignDetail.productPagePercent)
    setCampaignName(campaignDetail.campaign)
  }, [campaignDetail]) // eslint-disable-line

  useEffect(() => {
    if (!isOprNewPortfolio || isCreatingPortfolio) {
      return
    }
    if (!createdPortfolioResponse || Object.keys(createdPortfolioResponse).length === 0) {
      return
    }
    if (createdPortfolioResponse.portfolioId) {
      toast.show({
        title: 'Success',
        description: `${createdPortfolioResponse.portfolioName} has been created.`,
      })
      setIsOprNewPortfolio(false)
      handleUpdatePortfolio(
        createdPortfolioResponse.portfolioId,
        createdPortfolioResponse.portfolioName,
      )
    } else if (createdPortfolioResponse.error) {
      toast.show({
        title: 'Danger',
        description: createdPortfolioResponse.error,
      })
    } else {
      toast.show({
        title: 'Warning',
        description: createdPortfolioResponse,
      })
    }
  }, [isOprNewPortfolio, createdPortfolioResponse, isCreatingPortfolio]) // eslint-disable-line

  const portfolioOptions = listPortfolios.map(portfolio => (
    {
      value: portfolio.portfolio_id,
      label: portfolio.name
    }
  ))
  // change campaign name
  const handleChangeCampaignName = e => {
    setCampaignName('')
    if (!e.target.value) {
      return
    }
    setCampaignName(e.target.value)
  }
  // chnage acos
  const handleChangeAcos = e => {
    if (!e.target.value) {
      return
    }
    setAcos(parseFloat(e.target.value))
  }
  // change bidding strategy
  const handleChangeBiddingStrategy = selectedOption => {
    setBiddingStrategy(selectedOption)
  }
  // change top search
  const handleChangeTopSearch = e => {
    if (!e.target.value) {
      return
    }
    setTopSearch(parseFloat(e.target.value))
  }
  // change product page
  const handleChangeProductPages = e => {
    setProductPages()
    if (!e.target.value) {
      return
    }
    setProductPages(parseFloat(e.target.value))
  }
  // save campaign
  const handleSaveCampaign = () => {
    if (campaignDetail.campaignType === 'Sponsored Products') {
      saveBiddingStrategy()
    }

    if (campaignName !== campaignDetail.campaign) {
      dispatch(updateName({
        campaignId: campaignDetail.campaignId,
        campaignType: campaignDetail.campaignType,
        campaignName,
      }))
    }

    if (parseFloat(acos) !== parseFloat(currentAcos)) {
      dispatch(updateAcos({
        campaignId: campaignDetail.campaignId,
        campaignType: campaignDetail.campaignType,
        acos,
      }))
    }
  }

  // get bidding strategy
  const getBiddingStrategy = () => {
    const bidding = {
      strategy: biddingStrategy.value,
      adjustments: [],
    }

    if (topSearch) {
      bidding.adjustments = [...bidding.adjustments, {
        predicate: 'placementTop',
        percentage: parseInt(topSearch)
      }]
    }

    if (productPages) {
      bidding.adjustments = [...bidding.adjustments, {
        predicate: 'placementProductPage',
        percentage: parseInt(productPages)
      }]
    }
    return bidding
  }

  const saveBiddingStrategy = () => {
    if (biddingStrategy.value === campaignDetail.bidding.strategy
      && topSearch === campaignDetail.topOfSearchPercent
      && productPages === campaignDetail.productPagePercent) {
      return
    }

    dispatch(updateBidding({
      campaignId: campaignDetail.campaignId,
      bidding: getBiddingStrategy(),
    }))
  }
  const handleModalConfirm = (val) => {
    switch (modalType) {
      case 'new portfolio':
        handleAddNewPortfolio(val)
        break;
      case 'existing portfolio':
        handleAddExistingPortfolio(val)
        break;
      case 'remove portfolio':
        handleRemovePortfolio(val)
        break;
      default:
        break;
    }
  }
  // add to new portfolio button clicked
  const handleClickAddPortfolio = () => {
    if (!newPortfolioRef.current.value || newPortfolioRef.current.value === '') {
      toast.show({
        title: 'Warning',
        description: 'Portfolio name can not be empty.',
      })
      return
    }
    setModalText('Are you sure you want to create a new portfolio?')
    setModalType('new portfolio')
    setShowModal(true)
  }
  // add new portfolio
  const handleAddNewPortfolio = (val) => {
    setShowModal(false)
    if (val) {
      dispatch(
        createPortfolio({
          user: currentUserId,
          portfolioName: newPortfolioRef.current.value
        })
      )
      setIsOprNewPortfolio(true)
      setShowPortfolioSection(false)
    }
  }
  // add to existing portfolio clicked
  const handleClickAddExistingPortfolio = () => {
    if (!selectedPortfolio) {
      toast.show({
        title: 'Warning',
        description: 'No portfolio is selected.',
      })
      return
    }
    setModalText('Are you sure you want to add to an existing portfolio?')
    setModalType('existing portfolio')
    setShowModal(true)
  }
  const handleAddExistingPortfolio = (val) => {
    setShowModal(false)
    if (val) {
      handleUpdatePortfolio(selectedPortfolio.value, selectedPortfolio.label)
    }
  }
  const handleChangePortfolio = (val) => {
    setSelectedPortfolio(val)
  }
  const handleClickRemovePortfolio = () => {
    setModalText('Really remove from this portfolio?')
    setModalType('remove portfolio')
    setShowModal(true)
  }
  const handleRemovePortfolio = (val) => {
    setShowModal(false)
    if (val) {
      handleUpdatePortfolio(null, null)
    }
  }
  // update portfolio of campaign
  const handleUpdatePortfolio = (portfolioId, portfolioName) => {
    const campaigns = [{
      campaignId: campaignDetail.campaignId,
      campaignType: campaignDetail.campaignType,
      portfolioId: portfolioId,
    }]
    dispatch(updatePortfolio({
      campaigns,
      portfolioId: portfolioId,
      portfolioName: portfolioName,
    }))
    setShowPortfolioSection(false)
  }

  const renderPortfolioSection = () => {
    if (!campaignDetail || campaignDetail.campaignType === 'Sponsored Displays') {
      return null
    }

    return (
      <div className="portfolio-info">
        <h5 className="row-title">Portfolio</h5>
        <div className="selected-portfolio">
          {
            campaignDetail.portfolioId && (
              <div className="flex align-center portfolio-name">
                <p>This campaign is currently in:</p>
                <button type="button" className="btn btn-blue" onClick={() => { setShowPortfolioSection(!showPortfolioSection) }}>{ campaignDetail.portfolioName }</button>
              </div>
            )
          }
          {
            !campaignDetail.portfolioId && (
              <div className="flex align-center portfolio-name">
                <p>This campaign is not currently in a portfolio.</p>
                <button type="button" className="btn btn-blue" onClick={() => { setShowPortfolioSection(!showPortfolioSection) }}>Update Portfolio</button>
              </div>
            )
          }
        </div>
        {
          showPortfolioSection && (
            <div className="flex flex-wrap add-content">
              <div className="add-new">
                <div className="action">
                  <button type="button" className="btn btn-green" onClick={() => { handleClickAddPortfolio() }}>Add to new portfolio</button>
                </div>
                <div className="content">
                  <input type="text" className="input-new-portfolio" placeholder="New portfolio name" ref={newPortfolioRef}/>
                </div>
              </div>
              <div className="add-existing">
                <div className="action">
                  <button type="button" className="btn btn-green" onClick={() => { handleClickAddExistingPortfolio() }}>Add to existing portfolio</button>
                </div>
                <div className="content">
                  <Select
                    classNamePrefix="existing-portfolio"
                    options={portfolioOptions}
                    onChange={handleChangePortfolio}
                  />
                </div>
              </div>
            </div>
          )
        }
        {
          campaignDetail.portfolioId && (
            <div className="remove">
              <button type="button" className="btn btn-red" onClick={() => { handleClickRemovePortfolio() }}>Remove from this portfolio</button>
            </div>
          )
        }
      </div>
    )
  }

  const renderBiddingSection = () => {
    if (!campaignDetail || campaignDetail.campaignType !== 'Sponsored Products') {
      return null
    }
    return (
      <div className="bidding-info">
        <div className="row-title">Bidding Strategy</div>
        <div className="bidding-title">Campaign bidding strategy</div>
        <div className="bidding-select">
          <Select
            classNamePrefix={"bid-select"}
            options={biddingStrategyOptions}
            value={biddingStrategy}
            onChange={handleChangeBiddingStrategy}
          />
        </div>
        <p className="bidding-description">
          In addition to your bidding strategy, you can increase bids by up to 900%.
        </p>
        <div className="flex flex-wrap bidding-values">
          <div className="bidding-col">
            <span>Top of search (first page)</span>
            <input type="text" value={topSearch} onChange={handleChangeTopSearch}/>
          </div>
          <div className="bidding-col">
            <span>Product pages</span>
            <input type="text" value={productPages} onChange={handleChangeProductPages}/>
          </div>
        </div>
      </div>
    )
  }

  let isSame = true
  if (campaignDetail) {
    isSame = (campaignName === campaignDetail.campaign) && (acos === currentAcos)
    if (campaignDetail.campaignType === 'Sponsored Products') {
      isSame = isSame && (biddingStrategy.value === (campaignDetail.bidding ? campaignDetail.bidding.strategy : ''))
        && (topSearch === (campaignDetail.topOfSearchPercent ? campaignDetail.topOfSearchPercent : 0))
        && (productPages === (campaignDetail.productPagePercent ? campaignDetail.productPagePercent : 0))
    }
  }

  const isDataLoading = isLoading
    || isUpdatingAcos
    || isUpdatingPortfolio
    || isUpdatingBidding
    || isUpdatingName

  return (
    <div className={`section section-info${isDataLoading ? ' loading' : ''}`}>
      { isDataLoading && <LoaderComponent /> }
      <div className="section-header">
        <h4>Campaign Details</h4>
      </div>
      <div className="dashboard-tool">
        {
          !isSame && (
            <button
              type="button"
              className="btn btn-red btn-campaign-save"
              onClick={() => { handleSaveCampaign() }}
            >
              Save
            </button>
          )
        }
      </div>
      <div className="block-info">
        <div className="info-row">
          <div className="input-row">
            <span>Name</span>
            <input type="text" value={campaignName} onChange={handleChangeCampaignName}/>
          </div>
          <div className="input-row">
            <span>ACoS Target (%)</span>
            <input type="text" value={acos} onChange={handleChangeAcos}/>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap block-info">
        { renderPortfolioSection() }
        { renderBiddingSection() }
        <ConfirmModal
          show={showModal}
          onConfirm={handleModalConfirm}
          text={modalText}
        />
      </div>
    </div>
  )
}

export default CampaignInfo
