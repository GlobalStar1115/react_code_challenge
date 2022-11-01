import React, { useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import TableComponent from '../CommonComponents/TableComponent'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

const OptimizationModalAddKeywordsToExsitingCampaign = ({
  pageForAdd,
  dataToShow,
  onHideModal,
  keywords,
  campaigns,
  addNegativeToCampaignLevel,
  addNegativeToAdGroupsLevel,
  selectedMatchOption,
  tableField,
  ...props
}) => {
  const [step, setStep] = useState(1)

  const searchTermTableFields = [{ value: 'search', label: 'Search Terms' }]
  const negativeSearchTermTableFields = [
    { value: 'Search', label: 'Search Terms' },
  ]

  const renderFirstStep = () => {
    return (
      <div className='pane-body'>
        <div className='section-container'>
          <div className="section-header">
            <div className="text-center">
              <h5>Confirm Negative Targets</h5>
            </div>
            <div className='section-body'>
              <TableComponent
                showSearch
                showColumns
                showRows={campaigns}
                rows={keywords}
                fields={
                  tableField === 'search term'
                    ? searchTermTableFields
                    : negativeSearchTermTableFields
                }
              ></TableComponent>
            </div>
          </div>
        </div>
        <div className='section-footer'>
          <button
            type='button'
            className='btn btn-blue'
            onClick={handleNextStep}
          >
            Next Step
          </button>
        </div>
      </div>
    )
  }

  // go to first step
  const handlePreviousStep = () => {
    setStep(1)
  }

  // go to next step
  const handleNextStep = () => {
    setStep(2)
  }

  const onOutsideClick = (event) => {
    onHideModal()
  }

  // handle confirm

  const onConfirm = () => {
    if (dataToShow === 'Campaign' || dataToShow === 'NegativeCampaign') {
      addNegativeToCampaignLevel(pageForAdd, selectedMatchOption, keywords)
    } else if (dataToShow === 'AdGroup' || dataToShow === 'NegativeAdGroup') {
      addNegativeToAdGroupsLevel(pageForAdd, selectedMatchOption, keywords)
    }
    onHideModal()
  }

  const renderSecondStep = () => {
    return (
      <div className='pane-body'>
        <div className='section-container'>
          <div className='section-header'>
            <div className='text-center'>
              <div>Confirm Negative Match Type and Add Negatives</div>
              <div>
                &nbsp;PPC Entourage will automatically add your negatives ONLY to the
                individual campaigns where Bulk Optimizer found a problem.
              </div>
              <div> ASINs are automatically added as negative Exact</div>
            </div>
            <div className="section-body">
              <div className="campaign-list">
                <div className="campaign-list-item">
                  <div className='left-column'>
                    Add All Negatives Now As Negative Exact
                    <br />* Negative Exact Recommended
                  </div>
                  <div className='right-column'>
                    {selectedMatchOption.value === 'Negative Exact' ? (
                      <input type='checkbox' id='togBtn' defaultChecked></input>
                    ) : (
                      <input type='checkbox'></input>
                    )}
                  </div>
                </div>
                <div className='campaign-list-item'>
                  <div className='left-column'>
                    Add All Negatives Now As Negative Phrase
                    <br />
                    Warning: Negative Phrase Match Is A High Risk Optimization
                  </div>
                  <div className='right-column'>
                    {selectedMatchOption.value === 'Negative Phrase' ? (
                      <input type='checkbox' id='togBtn' defaultChecked></input>
                    ) : (
                      <input type='checkbox'></input>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='section-footer'>
            <button
              type='button'
              className='btn btn-gray'
              onClick={handlePreviousStep}
            >
              Back to Previous Step
            </button>
            <button type='button' className='btn btn-red' onClick={onHideModal}>
              Cancel
            </button>
            <button type='button' className='btn btn-blue' onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        onOutsideClick()
      }}
    >
      <div className='ap-component'>
        <div className='top-container'>
          <div className='pane-header'>
            <div className="left-column">
              <span className="pane-title">
                Add <span>search term(s)</span> As Negative(s)
              </span>
            </div>
            <div className="right-column">
              <CloseSvg className="close-button" onClick={() => { onHideModal() }} />
            </div>
          </div>
        </div>
        {step === 1 && renderFirstStep()}
        {step === 2 && renderSecondStep()}
      </div>
    </OutsideClickHandler>
  )
}

export default OptimizationModalAddKeywordsToExsitingCampaign
