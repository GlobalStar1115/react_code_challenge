import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import EditTableColumnLayout from '../../layout/EditTableColumnLayout'

import { applyCampaignColumnChanges } from '../../redux/actions/pageGlobal'
import { defaultCampaignTableColumns, allCampaignTableColumns } from '../../utils/constants/defaultValues'

const EditTableColumnComponent = ({ columns }) => {
  const dispatch = useDispatch()
  const store = useStore().getState()

  const { pageGlobal } = store
  const { campaignTableColumns } = pageGlobal

  const [selectedCols, setSelectedCols] = useState(campaignTableColumns)

  const handleCheck = (checked, data) => {
    const tmpCols = [].concat(selectedCols)

    if (checked) {
      if (!selectedCols.includes(data.name)) {
        tmpCols.push(data.name)
      }
    } else if (data.name !== 'campaign') {
      tmpCols.splice(tmpCols.indexOf(data.name), 1)
    }

    setSelectedCols(tmpCols)
  }

  const handleCheckAll = (checked) => {
    if (checked) {
      setSelectedCols(allCampaignTableColumns)
    } else {
      setSelectedCols([])
    }
  }

  const handleApply = () => {
    dispatch(applyCampaignColumnChanges(selectedCols))
  }

  const handleReset = () => {
    setSelectedCols(defaultCampaignTableColumns)
  }

  return (
    <EditTableColumnLayout count={selectedCols.length} applyColumnChanges={handleApply} resetToDefault={handleReset}>
      <div className="campaign-edit-table-column">
        <div className="column-row">
          <CheckboxComponent
            label="Select all"
            checked={selectedCols.length === allCampaignTableColumns.length}
            onChange={handleCheckAll}
          />
        </div>
        {
          columns.map(column => (
            <div key={column.name} className="column-row">
              <CheckboxComponent
                label={column.label}
                checked={selectedCols.includes(column.name)}
                onChange={(checked) => handleCheck(checked, column)}
              />
            </div>
          ))
        }
      </div>
    </EditTableColumnLayout>
  )
}

export default EditTableColumnComponent
