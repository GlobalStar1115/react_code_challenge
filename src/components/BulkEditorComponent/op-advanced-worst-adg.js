import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatValue } from '../../services/helper'

const OptimizationAdvancedWorstAdgComponent = (props) => {
  const store = useStore()

  const { campaign } = store.getState()
  const {
    opAdvancedWorstAdgsBulk,
    isOptAdvancedWorstAdgsBulkLoading,
    isUpdateOptAdvancedWorstAdgStateBulk,
  } = campaign

  const { updateBulkData } = props

  const [worstAdgData, setWorstAdgData] = useState([])
  const [selectedWorstAdg, setSelectedWorstAdg] = useState({})

  const worstAdFields = [
    { value: 'state', label: 'State' },
    { value: 'campaign', label: 'Campaign', flex: '3' },
    { value: 'name', label: 'Adgroup', flex: '2' },
    { value: 'defaultbid', label: 'Default Bid' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'cost', label: 'Spend' },
    { value: 'impressions', label: 'Impress' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'clickorderratio', label: 'Clicks/Orders' },
    { value: 'acos', label: 'Acos %' },
  ]

  const totals = []

  useEffect(() => {
    if (!opAdvancedWorstAdgsBulk || opAdvancedWorstAdgsBulk.length === 0) {
      return
    }
    setWorstAdgData(
      opAdvancedWorstAdgsBulk.map((worstAdg) => {
        return {
          ...worstAdg,
          avcpc: worstAdg.avcpc ? formatValue(worstAdg.avcpc, 'number', 2) : 0,
          checked: worstAdg && worstAdg.id === selectedWorstAdg.id,
        }
      })
    )
  }, [opAdvancedWorstAdgsBulk, selectedWorstAdg])

  const checkWorstAdgHandle = (val, data) => {
    val ? setSelectedWorstAdg(data) : setSelectedWorstAdg({})
  }

  const handleChangeWorstAdgsState = (type) => {
    updateBulkData('advanced-worst-adg', type, selectedWorstAdg)

    setSelectedWorstAdg({ ...selectedWorstAdg, state: type })
  }

  return (
    <div
      className={
        isUpdateOptAdvancedWorstAdgStateBulk ||
        isOptAdvancedWorstAdgsBulkLoading
          ? 'optimization-advanced-worst-adg loading'
          : 'optimization-advanced-worst-adg'
      }
    >
      {(isUpdateOptAdvancedWorstAdgStateBulk ||
        isOptAdvancedWorstAdgsBulkLoading) && <LoaderComponent />}
      {selectedWorstAdg && selectedWorstAdg.id && (
        <div className='sku-action'>
          <button
            type='button'
            className='btn btn-active'
            onClick={() => {
              handleChangeWorstAdgsState('enabled')
            }}
          >
            Unpause
          </button>
          <button
            type='button'
            className='btn btn-pause'
            onClick={() => {
              handleChangeWorstAdgsState('paused')
            }}
          >
            Pause
          </button>
          <button
            type='button'
            className='btn btn-remove'
            onClick={() => {
              handleChangeWorstAdgsState('archived')
            }}
          >
            Archive
          </button>
        </div>
      )}
      <TableComponent
        fields={worstAdFields}
        totals={totals}
        rows={worstAdgData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkWorstAdgHandle}
      />
    </div>
  )
}

export default OptimizationAdvancedWorstAdgComponent
