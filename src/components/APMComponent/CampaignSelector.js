// Campaign selector to choose multiple campaigns
// to apply smart pilot settings.
import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'

import { getApCampaignsToApply } from '../../redux/actions/ap'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CustomTable from '../CommonComponents/CustomTableComponent'

const CampaignSelector = ({ saveError, onApply, onCancel }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { ap: { campaignsToApply, isLoadingCampaignsToApply, isSaving } } = store.getState()

  const typeNames = {
    sp: 'Sponsored Product',
    sb: 'Sponsored Brand',
    sbv: 'Sponsored Brand Video',
    sd: 'Sponsored Display',
  }

  const filterOpts = Object.keys(typeNames).map(type => ({
    value: type,
    label: typeNames[type],
  }))
  filterOpts.unshift({ value: '', label: 'All' })

  const [selectedCampaignIds, setSelectedCampaignIds] = useState([])
  const [filter, setFilter] = useState(filterOpts[0])

  // Load campaigns of all ad types.
  useEffect(() => {
    if (!campaignsToApply.length && !isLoadingCampaignsToApply)
    dispatch(getApCampaignsToApply())
  }, []) // eslint-disable-line

  const handleFilterChange = (option) => {
    setFilter(option)
    // Whenever filter is changed, un-select all campaigns.
    setSelectedCampaignIds([])
  }

  let filteredCampaigns
  if (!filter.value) {
    filteredCampaigns = campaignsToApply
  } else {
    filteredCampaigns = campaignsToApply.filter(campaign => (
      campaign.type === filter.value
    ))
  }

  const handleApply = () => {
    onApply(selectedCampaignIds)
  }

  const renderFilter = () => (
    <Select
      options={filterOpts}
      value={filter}
      onChange={handleFilterChange}
    />
  )

  const renderCampaign = campaign => (
    <>
      <div className="table-col">
        { campaign.name }
      </div>
      <div className="table-col col-type">
        { typeNames[campaign.type] }
      </div>
    </>
  )

  return (
    <>
      { isLoadingCampaignsToApply && <LoaderComponent /> }
      <div className="pane-body">
        {
          !isLoadingCampaignsToApply && (
            <CustomTable
              className="table-campaigns-apply"
              records={filteredCampaigns}
              selectedRecords={selectedCampaignIds}
              idField="id"
              searchFields={['name']}
              renderRecord={renderCampaign}
              renderTopRight={renderFilter}
              onChange={setSelectedCampaignIds}
            >
              <div className="table-col">Campaign</div>
              <div className="table-col col-type">Type</div>
            </CustomTable>
          )
        }
      </div>
      <div className="pane-footer">
        {
          saveError !== null && (
            <div className="save-error">
              { saveError }
            </div>
          )
        }
        <button
          type="button"
          className="btn btn-blue"
          disabled={selectedCampaignIds.length === 0 || isSaving}
          onClick={handleApply}
        >
          Apply
        </button>
        <button
          type="button"
          className="btn btn-white"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </>
  )
}

export default CampaignSelector
