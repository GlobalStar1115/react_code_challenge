// Add Campaign To New Portfolio.
import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import OutsideClickHandler from 'react-outside-click-handler'

import CheckboxComponent from '../../CommonComponents/CheckboxComponent'

import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg'

import { hideAEPAction } from '../../../redux/actions/pageGlobal'
import { addCampaignToExistingPortfolio } from '../../../redux/actions/portfolio'

const AddCampaignsToExistingPortfolio = ({ campaigns }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { portfolio, header } = store.getState()
  const { listPortfolios } = portfolio
  const { currentUserId } = header

  const [ step, setStep ] = useState(1)
  const [ selectedCampaigns, setSelectedCampaigns ] = useState(campaigns);
  const [ selectedPortfolio, setSelectedPortfolo ] = useState()

  // Hide Add to new portfolio model popup.
  const onClose = () => {
    dispatch(hideAEPAction())
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

  const onChange = (value, portfolio) => {
    if(value){
      setSelectedPortfolo(portfolio)
    }else{
      setSelectedPortfolo()
    }
  }

  const handleAEP = () => {
    const listCampaigns = selectedCampaigns.map(item => ({
      campaignId: item.campaignid,
      campaignType: item.campaignType,
      portfolioId: selectedPortfolio.portfolio_id
    }))
    dispatch(addCampaignToExistingPortfolio({
      campaigns: listCampaigns,
      user: currentUserId,
      portfolioId: selectedPortfolio.portfolio_id
    }))
    onClose()
  }

  const renderFirstStep = () => {
    return (
      <div className="pane-body">
        <div className="section-container">
          <div className="section-header">
            <div className="text-center">
              <div>Step 1 : Confirm Campaigns Add to Exisintg Portfolio</div>
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
          <div className="section-footer">
            <button type="button" className="btn btn-red" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-blue" disabled={!selectedCampaigns.length} onClick={ handleNextStep }>Confirm</button>
          </div>
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
              <div>Step 2 : Choose Portfolio to Add Campaign</div>
            </div>
            <div className="table-toolbar">
              <div className="table-toolbar-left">
                {listPortfolios.length} Portfolio Available
              </div>
              <div className="table-toolbar-right"></div>
            </div>
            <div className="section-body">
              <div>Portfolio</div>
              <div className="campaign-list">
                {
                  listPortfolios.map((data) => (
                    <div className="campaign-list-item" key={data['portfolio_id']}>
                      <div className="left-column">
                        <div className="item">{data['name']}</div>
                      </div>
                      <div className="right-column">
                        <CheckboxComponent
                          checked={ data === selectedPortfolio ? true : false}
                          onChange={(e) => { onChange(e, data) }}
                        />
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="section-footer">
            <button type="button" className="btn btn-gray" onClick={ handlePreviousStep }>Back to Previous Step</button>
            <button type="button" className="btn btn-red" onClick={ onClose }>Cancel</button>
            <button type="button" className="btn btn-blue" disabled={!selectedPortfolio} onClick={ handleAEP }>Confirm</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <OutsideClickHandler onOutsideClick={() => { onClose() }}>
      <div className="ap-component">
        <div className="top-container">
          <div className="pane-header">
            <div className="left-column">
              <span className="pane-title">
                Add Campaigns to Existing Portfolio
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

export default AddCampaignsToExistingPortfolio
