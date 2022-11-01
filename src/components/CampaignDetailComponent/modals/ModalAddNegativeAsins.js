import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal } from 'rsuite'

import CustomTable from '../../CommonComponents/CustomTableComponent'

import {
  createAdgroupNegativeTargets,
} from '../../../redux/actions/targeting'

const ModalAddNegativeAsins = ({ showModal, currentAdGroupId, terms = [], onClose }) => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const {
    campaignDetail: { currentDetail, currentAdGroups },
  } = store

  const [selectedAsins, setSelectedAsins] = useState([])
  const [selectedAdgroups, setSelectedAdgroups] = useState([])

  useEffect(() => {
    setSelectedAsins(terms.map(term => term.asin))
  }, [terms])

  const handleAdd = () => {
    const negatives = []
    selectedAsins.forEach((asin) => {
      selectedAdgroups.forEach((adGroupId) => {
        negatives.push({
          campaignId: currentDetail.campaign_id,
          adGroupId,
          expressionType: 'manual',
          state: 'enabled',
          expression: [{
            type: 'asinSameAs',
            value: asin,
          }]
        })
      })
    })
    dispatch(createAdgroupNegativeTargets(negatives))
  }

  const renderNegative = negative => (
    <>
      <div className="table-col">
        { negative.asin }
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
          Confirm Negative Asins
        </div>
        <CustomTable
          className="table-negatives"
          records={terms}
          idField="asin"
          noSearch
          selectedRecords={selectedAsins}
          paginationSelectPlacement="top"
          renderRecord={renderNegative}
          onChange={setSelectedAsins}
        >
          <div className="table-col">Name</div>
        </CustomTable>
      </div>
    )
  }

  const renderAdgroups = () => {
    let adgroups = (currentAdGroups || []).filter(adgroup => (
      adgroup.state === 'enabled' && adgroup.targetType === 'products'
    ))
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
    <Modal backdrop="static" className="modal-add-negative-asins" show={showModal} size="lg">
      <Modal.Header onHide={() => { onClose() }}>
        <Modal.Title>
          Add Negative ASINs to Ad Group
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="section-row">
          { renderNegatives() }
          { renderAdgroups() }
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="rs-btn rs-btn-primary"
          disabled={!selectedAsins.length || !selectedAdgroups.length}
          onClick={() => { handleAdd() }}
        >
          Add Negative ASINs
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => { onClose() }}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalAddNegativeAsins
