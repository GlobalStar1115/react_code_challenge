// Add Campaign To New Portfolio.
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'

import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg'
import { hideANPAction } from '../../../redux/actions/pageGlobal'
import { toast } from '../../CommonComponents/ToastComponent/toast'

import {
  createPortfolio
} from "../../../redux/actions/portfolio";

import {
  updatePortfolio
} from '../../../redux/actions/campaignDetail'

const AddCampaignsToNewPortfolio = ({ campaigns }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { portfolio, header } = store.getState()
  const {
    listPortfolios,
    isCreatingPortfolio,
    createdPortfolioResponse,
  } = portfolio // eslint-disable-line
  const { currentUserId } = header
  const portfolioNameRef = useRef()

  const [ step, setStep ] = useState(1)
  const [selectedCampaigns, setSelectedCampaigns] = useState(campaigns)
  const [portfolioName, setPortfolioName] = useState()
  const [saveError, setSaveError] = useState(null)
  const [ isOprNewPortfolio, setIsOprNewPortfolio ] = useState(false)

  // Hide Add to new portfolio model popup.
  const onClose = () => {
    dispatch(hideANPAction())
  }

  const onOutsideClick = (event) => {
    onClose()
  }

  // go to next step
  const handleNextStep = () => {
    setStep(2)
  }

  // go to first step
  const handlePreviousStep = () => {
    setStep(1)
  }

  const removeCampaign = (campaign_id) => {
    setSelectedCampaigns(selectedCampaigns.filter( item => item.campaignid !== campaign_id ))
  }

  const handleDuplicatePortfolio = (value) => {
    let x = listPortfolios.filter(item => item.name === value)
    if( x.length > 0){
      setSaveError("One of your portfolios already uses this name. Please try another.")
      setPortfolioName()
    }else{
      setSaveError()
      setPortfolioName(value)
    }
  }

  const handleANP = () => {
    onClose()

    dispatch(createPortfolio({
      portfolioName: portfolioName,
      user: currentUserId
    }))

    setIsOprNewPortfolio(true)
  }

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

  // update portfolio of campaign
  const handleUpdatePortfolio = (portfolioId, portfolioName) => {
    dispatch(updatePortfolio({
      campaigns: selectedCampaigns.map(item => ({
        campaignId: item.campaignid,
        campaignType: item.campaignType,
        portfolioId,
      })),
      portfolioId,
      portfolioName,
    }))
  }

  const renderFirstStep = () => {
    return (
      <div className="pane-body">
        <div className="section-container">
          <div className="section-header">
            <div className="text-center">
              <div>Step 1 : Confirm Campaigns Add to New Portfolio</div>
              <div>{selectedCampaigns.length} Campaigns Selected</div>
            </div>
            <div className="section-body">
              <div className="campaign-list"> Campaigns
                { selectedCampaigns &&
                  selectedCampaigns.map((data) => (
                    <div className="campaign-list-item" key={data['campaignid']}>
                      <div className="left-column">
                        <div className="pane-title">{data['campaign']}</div>
                      </div>
                      <div className="right-column">
                        <CloseSvg className="close-button" title="Remove campaign" onClick={() => removeCampaign(data['campaignid'])} />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          { selectedCampaigns && selectedCampaigns.length > 0 &&
            <div className="section-footer">
              <button type="button" className="btn btn-red" onClick={ onClose }>Cancel</button>
              <button type="button" className="btn btn-blue" onClick={ handleNextStep }>Confirm</button>
            </div>
          }
        </div>
      </div>
    )
  }

  const renderSecondStep = () => {
    return (
      <div className="pane-body">
        <div className="section-container">
          <div className="section-header">
            <div className="text-center">
              <div>Step 2 : Create New Portfolio</div>
              <div>Organize your campaigns by business line, product category, or season, and manage total spending with budget caps.</div>
            </div>
            <div className="text-center bold"> Portfolio Name </div>
            <div className="text-center">
              <input ref={portfolioNameRef} className="edit-input" onChange={(e) =>handleDuplicatePortfolio(e.target.value)} />
            </div>
          </div>
          {
            saveError && (
              <div className="save-error">
                { saveError }
              </div>
            )
          }
          { selectedCampaigns && selectedCampaigns.length > 0 &&
            <div className="section-footer">
              <button type="button" className="btn btn-gray" onClick={ handlePreviousStep }>Back to Previous Step</button>
              <button type="button" className="btn btn-red" onClick={ onClose }>Cancel</button>
              <button type="button" className="btn btn-blue" disabled={!portfolioName} onClick={ handleANP }>Confirm</button>
            </div>
          }
        </div>
      </div>
    )
  }

  return (
    <OutsideClickHandler onOutsideClick={onOutsideClick}>
      <div className="ap-component">
        <div className="top-container">
          <div className="pane-header">
            <div className="left-column">
              <span className="pane-title">
                Add Campaigns to New Portfolio
              </span>
            </div>
            <div className="right-column">
              <CloseSvg className="close-button" onClick={onClose} />
            </div>
          </div>
        </div>
        { step === 1 && renderFirstStep() }
        { step === 2 && renderSecondStep() }
      </div>
    </OutsideClickHandler>
  )
}

export default AddCampaignsToNewPortfolio
