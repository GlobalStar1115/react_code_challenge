import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal, Radio, RadioGroup } from 'rsuite'

import CustomTable from '../../CommonComponents/CustomTableComponent'
import LoaderComponent from '../../CommonComponents/LoaderComponent'
import { toast } from '../../CommonComponents/ToastComponent/toast'

import {
  createAdgroupNegativeKeywords,
  createNegativeKeywords,
} from '../../../redux/actions/campaign'

import {
  createAdgroupNegativeTargets,
  createNegativeTargets,
} from '../../../redux/actions/targeting'

import {
  checkSpecialCharater,
} from '../../../services/helper'

const ModalAddNegatives = ({ campaignType, showModal, currentAdGroupId, modalType, terms = [], onClose }) => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const {
    campaignDetail: { currentDetail, currentAdGroups }
  } = store

  const isSB = campaignType === 'Sponsored Brands' || campaignType === 'Sponsored Brands Video'

  const [targetLevel, setTargetLevel] = useState(isSB ? 'campaign' : 'adgroup')
  const [matchType, setMatchType] = useState(modalType === 'negative-finder' ? 'negativePhrase' : 'negativeExact')
  const [selectedNegatives, setSelectedNegatives] = useState([])
  const [selectedAdgroups, setSelectedAdgroups] = useState([])
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setSelectedNegatives(terms.map(term => term.search))
  }, [terms])

  const handleAdd = () => {
    let negativesToAdd = [...selectedNegatives]
    const isAuto = currentDetail && currentDetail.targeting_type === 'auto'
    if (isAuto) {
      // Remove ASINs for auto targeting campaigns because ASINs are added as negative targeting.
      negativesToAdd = negativesToAdd.filter(negative => !(/^[0-9a-z]{10}$/g.test(negative)))
    }

    const negativeKeywords = []
    let validationError = null
    negativesToAdd.forEach(negative => {
      const keywordText = negative.trim()

      if (checkSpecialCharater(keywordText)) {
        validationError = 'One or some keywords contain invalid characters.'
        return
      }
      if (keywordText.length > 80) {
        validationError = 'Character limit exceeded. Negative keywords have a maximum of 80 characters.'
        return
      }

      const wordCount = keywordText.split(/\s+/).length
      if (matchType === 'negativeExact' && wordCount > 10) {
        validationError = 'Word limit exceeded. Negative exact has maximum 10 words.'
        return
      }
      if (matchType === 'negativePhrase' && wordCount > 4) {
        validationError = 'Word limit exceeded. Negative phrase has maximum 4 words.'
        return
      }

      if (targetLevel === 'adgroup') {
        selectedAdgroups.forEach((adGroupId) => {
          negativeKeywords.push({
            campaignId: currentDetail.campaign_id,
            keywordText,
            matchType,
            state: 'enabled',
            adGroupId,
          })
        })
      } else {
        negativeKeywords.push({
          campaignId: currentDetail.campaign_id,
          keywordText,
          matchType,
          state: 'enabled',
        })
      }
    })

    if (validationError) {
      toast.show({
        title: 'Warning',
        description: validationError,
      })
      return
    }

    const negativeTargets = []
    if (isAuto) {
      const asins = selectedNegatives.filter(negative => /^[0-9a-z]{10}$/g.test(negative))
      asins.forEach(negative => {
        if (targetLevel === 'adgroup') {
          selectedAdgroups.forEach((adGroupId) => {
            negativeTargets.push({
              campaignId: currentDetail.campaign_id,
              expressionType: 'manual',
              state: 'enabled',
              expression: [{
                value: negative.trim(),
                type: 'asinSameAs',
              }],
              adGroupId,
            })
          })
        } else {
          negativeTargets.push({
            campaignId: currentDetail.campaign_id,
            expressionType: 'manual',
            state: 'enabled',
            expression: [{
              value: negative.trim(),
              type: 'asinSameAs',
            }],
          })
        }
      })
    }

    if (!negativeKeywords.length && !negativeTargets.length) {
      toast.show({
        title: 'Warning',
        description: 'Nothing to addd.',
      })
      return
    }

    if (targetLevel === 'campaign') {
      if (isAuto && negativeTargets.length) {
        setIsAdding(true)
        dispatch(createNegativeTargets(negativeTargets)).then(() => {
          setIsAdding(false)
        })
      }
      if (negativeKeywords.length > 0) {
        setIsAdding(true)
        let adgroupId = null
        if (currentAdGroups.length) {
          adgroupId = currentAdGroups[0].adgroupid
        }
        dispatch(createNegativeKeywords(campaignType, negativeKeywords, adgroupId)).then(() => {
          setIsAdding(false)
        })
      }
    } else if (targetLevel === 'adgroup') {
      if (isAuto && negativeTargets.length) {
        setIsAdding(true)
        dispatch(createAdgroupNegativeTargets(negativeTargets)).then(() => {
          setIsAdding(false)
        })
      }
      if (negativeKeywords.length > 0) {
        setIsAdding(true)
        dispatch(createAdgroupNegativeKeywords(negativeKeywords)).then(() => {
          setIsAdding(false)
        })
      }
    }
  }

  const renderNegative = negative => (
    <>
      <div className="table-col">
        { negative.search }
      </div>
    </>
  )

  const renderAdgroup = adgroup => (
    <>
      <div className="table-col">
        { adgroup.name }
      </div>
    </>
  )

  const renderNegatives = () => {
    return (
      <div className="section-container">
        <div className="section-title">
          Confirm Negatives
        </div>
        <CustomTable
          className="table-negatives"
          records={terms}
          idField="search"
          noSearch
          selectedRecords={selectedNegatives}
          paginationSelectPlacement="top"
          renderRecord={renderNegative}
          onChange={setSelectedNegatives}
        >
          <div className="table-col">Name</div>
        </CustomTable>
      </div>
    )
  }

  const renderAdgroups = () => {
    if (targetLevel !== 'adgroup') {
      return null
    }

    let adgroups = (currentAdGroups || []).filter(adgroup => adgroup.state === 'enabled')
    if (currentDetail && currentDetail.targeting_type === 'manual'
      && (modalType === 'st' || modalType === 'keyword-cleaner')) {
      adgroups = adgroups.filter(adgroup => adgroup.targetType === 'keywords')
    }
    if (currentAdGroupId) {
      adgroups = adgroups.filter(adgroup => adgroup.adgroupid === currentAdGroupId)
    }

    return (
      <div className="section-container">
        <div className="section-title">
          Select Ad Group
        </div>
        <CustomTable
          className="table-adgroups"
          records={adgroups}
          idField="adgroupid"
          noSearch
          selectedRecords={selectedAdgroups}
          paginationSelectPlacement="top"
          renderRecord={renderAdgroup}
          onChange={setSelectedAdgroups}
        >
          <div className="table-col">Name</div>
        </CustomTable>
      </div>
    )
  }

  return (
    <Modal backdrop="static" className="modal-add-negatives" show={showModal} size="lg">
      <Modal.Header onHide={() => { onClose() }}>
        <Modal.Title>
          Add Negatives to Campaign
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { isAdding && <LoaderComponent /> }
        <div className="top-section">
          <div className="section-container">
            <div className="section-title">
              Choose Ad Group or Campaign Level
            </div>
            <RadioGroup
              value={targetLevel}
              onChange={setTargetLevel}
            >
              <Radio value="adgroup" disabled={isSB}>Ad Group Level</Radio>
              <Radio value="campaign" disabled={isSB}>Campaign Level</Radio>
            </RadioGroup>
          </div>
          <div className="section-container">
            <div className="section-title">
              Confirm Negative Match Type and Add Negatives
            </div>
            <RadioGroup
              value={matchType}
              onChange={setMatchType}
            >
              <Radio value="negativeExact">Add All Negatives As Negative Exact</Radio>
              <Radio value="negativePhrase">Add All Negatives As Negative Phrase</Radio>
            </RadioGroup>
          </div>
        </div>
        <div className="bottom-section">
          { renderNegatives() }
          { renderAdgroups() }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="rs-btn rs-btn-primary"
          disabled={!selectedNegatives.length || (targetLevel === 'adgroup' && !selectedAdgroups.length) || isAdding}
          onClick={() => { handleAdd() }}
        >
          Add Negatives
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => { onClose() }}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalAddNegatives
