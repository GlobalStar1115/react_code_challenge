import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import Checkbox from "react-custom-checkbox"
import * as Icon from "react-icons/fi"

import EditTableColumnLayout from '../../layout/EditTableColumnLayout'

import { applyPortfolioColumnChanges } from '../../redux/actions/pageGlobal'
import { defaultPortfolioTableColumns, allPortfolioTableColumns } from '../../utils/constants/defaultValues'

const EditTableColumnComponent = ({ columns }) => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const { pageGlobal } = store
  const { portfolioTableColumns } = pageGlobal
  const [ selectedCols, setSelectedCols ] = useState(portfolioTableColumns)

  const columnRows = columns.map((data, ind) => {
    return (
      <div className="column-row">
        <Checkbox
          icon={
            <div
              style={{ backgroundColor: "#246FE1", borderRadius: "3px", maxHeight: "18px", cursor: "pointer" }}
            >
              <Icon.FiCheck color="white" size={18} />
            </div>
          }
          borderColor="#CECECE"
          style={{ cursor: "pointer" }}
          size={18}
          borderRadius={3}
          label={data.label}
          checked={selectedCols.includes(data.name)}
          onChange={ (value) => onClickCheckBox(value, data) }
        />
      </div>
    )
  })

  const onClickCheckBox = (value, data) => {
    const tmpCols = [].concat(selectedCols)

    if (value) {
      if (!selectedCols.includes(data.name)) {
        tmpCols.push(data.name)
      }
    } else {
      if (data.name !== 'portfolio') {
        tmpCols.splice(tmpCols.indexOf(data.name), 1)
      }
    }

    setSelectedCols(tmpCols)
  }
  const onSelectAll = (value) => {
    if (value) {
      setSelectedCols(allPortfolioTableColumns)
    } else {
      setSelectedCols([])
    }
  }

  const onApply = () => {
    dispatch(applyPortfolioColumnChanges(selectedCols))
  }
  const onReset = () => {
    setSelectedCols(defaultPortfolioTableColumns)
  }

  return (
    <EditTableColumnLayout applyColumnChanges={ onApply } resetToDefault={ onReset } count={ selectedCols.length }>
      <div className="campaign-edit-table-column">
        <div className="column-row">
          <Checkbox
            icon={
              <div
                style={{ backgroundColor: "#246FE1", borderRadius: "3px", maxHeight: "18px", cursor: "pointer" }}
              >
                <Icon.FiCheck color="white" size={18} />
              </div>
            }
            borderColor="#CECECE"
            style={{ cursor: "pointer" }}
            size={18}
            label="Select all"
            borderRadius={3}
            onChange={onSelectAll}
          />
        </div>
        {
          columnRows
        }
      </div>
    </EditTableColumnLayout>
  );
}

export default EditTableColumnComponent
