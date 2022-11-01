import React, { useEffect, useState } from 'react'
import { useStore } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatValue } from '../../services/helper'

const OptimizationSkuComponent = (props) => {
  const store = useStore()

  const { campaign } = store.getState()
  const {
    optSkusBulk,
    isOptSkusBulkLoading,
    isUpdateOptSkuAdListBulk,
  } = campaign

  const { updateBulkData } = props

  const [skuData, setSkuData] = useState([])
  const [selectedSkus, setSelectedSkus] = useState([])

  const fields = [
    { value: 'state', label: 'State' },
    { value: 'sku', label: 'Sku', flex: '2' },
    { value: 'asin', label: 'Asin', flex: '2' },
    { value: 'image_sm', label: 'Product Image', type: 'image' },
    { value: 'campaign_name', label: 'Campaign', flex: '4' },
    { value: 'adgroup_name', label: 'Ad Group', flex: '2' },
    { value: 'revenue', label: 'Rev' },
    { value: 'cost', label: 'Spend' },
    { value: 'impressions', label: 'Impr' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'avcpc', label: 'Ave Cpc' },
    { value: 'conversionrate', label: 'Conv.' },
    { value: 'acos', label: 'Acos.' }
  ]
  const totals = []

  useEffect(() => {
    if (!optSkusBulk || optSkusBulk.length === 0) {
      return
    }
    const newSkus = optSkusBulk.map(sku => {
      return (
        {
          ...sku,
          avcpc: sku.avcpc ? formatValue(sku.avcpc, "number", 2) : 0,
          conversionrate: sku.conversionrate ? formatValue(sku.conversionrate, "number", 2) : 0,
          acos: sku.acos ? formatValue(sku.acos, "number", 2) : 0,
          checked: selectedSkus && selectedSkus.length > 0 ? selectedSkus.filter(selectedSku => selectedSku.id === sku.id).length > 0 : false,
        }
      )
    })
    setSkuData(newSkus)
  }, [optSkusBulk, selectedSkus])

  const checkSkuHandle = (val, data) => {
    val ? setSelectedSkus(prevState => [...prevState, data]) : setSelectedSkus(selectedSkus.filter(sku => sku.id !== data.id))
  }

  const checkSkuAll = (val, data) => {
    val ? setSelectedSkus(data) : setSelectedSkus([])
  }

  const handleChangeSkusState = (type) => {
    updateBulkData('sku', type, selectedSkus)

    setSelectedSkus(selectedSkus.map(selectedSku => ({
      ...selectedSku,
      state: type,
    })))
  }


  return (
    <div className={isOptSkusBulkLoading || isUpdateOptSkuAdListBulk ? "optimization-sku loading" : "optimization-sku"}>
      {(isOptSkusBulkLoading || isUpdateOptSkuAdListBulk) && <LoaderComponent />}
      {
        selectedSkus && selectedSkus.length > 0 &&
        <div className="sku-action">
          {
            selectedSkus.length === 1 &&
            <button
              type="button"
              className="btn btn-active"
              onClick={() => { handleChangeSkusState('enabled') }}
            >
              Unpause
              </button>
          }
          <button
            type="button"
            className="btn btn-pause"
            onClick={() => { handleChangeSkusState('paused') }}
          >
            Pause
            </button>
          <button
            type="button"
            className="btn btn-remove"
            onClick={() => { handleChangeSkusState('archived') }}
          >
            Archive
            </button>
        </div>
      }
      <TableComponent
        fields={fields}
        totals={totals}
        rows={skuData}
        showColumns
        showTools
        showCheckColumn
        showSearch
        showHistory
        showFilter
        ShowColumnCustomizer
        checkHandle={checkSkuHandle}
        checkAll={checkSkuAll}
      />
    </div>
  )
}

export default OptimizationSkuComponent
