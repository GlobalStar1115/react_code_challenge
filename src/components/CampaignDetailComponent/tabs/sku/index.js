import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import moment from 'moment'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../../../assets/svg/info.svg'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'

import { setDateRange } from '../../../../redux/actions/header'

import {
  getSKUData,
  changeSkuState,
} from '../../../../redux/actions/campaignDetail'

import {
  updateAcos,
} from '../../../../redux/actions/campaignDetail'

import {
  formatValue,
  formatCurrency,
  tableSorter,
} from '../../../../services/helper'

const columns = [
  { key: 'state', name: 'State' },
  { key: 'image', name: 'Image', sortable: false },
  { key: 'sku', name: 'SKU', className: 'col-sku' },
  { key: 'cost', name: 'Spend' },
  { key: 'impressions', name: 'Impress' },
  { key: 'clicks', name: 'Clicks' },
  { key: 'ctr', name: 'CTR' },
  { key: 'cpc', name: 'Ave CPC' },
  { key: 'acos', name: 'ACoS' },
  { key: 'orders', name: 'Orders' },
]

const SKUOPTab = ({ campaignType }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    header: {
      currentStartDate,
      currentEndDate,
      currencyRate,
      currencySign,
    },
    campaignDetail: {
      currentAcos,
      currentDetail,
      currentAdGroups,
      isSKUDataLoading,
      isChangingSkuState,
      skuData,
    },
  } = store.getState()

  const [currentAdGroupId, setCurrentAdGroupId] = useState(null)
  const [acos, setAcos] = useState(0)
  const [skus, setSkus] = useState([])
  const [selectedSkus, setSelectedSkus] = useState([])

  // Retrieve SKUs.
  useEffect(() => {
    if (!currentDetail || !currentStartDate || !currentEndDate) {
      return
    }
    dispatch(getSKUData({
      campaignId: currentDetail.campaign_id,
      campaignType,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
    }))
  }, [currentDetail, currentStartDate, currentEndDate]) // eslint-disable-line

  // Filter found SKUs.
  useEffect(() => {
    if (!skuData || !skuData.length) {
      return
    }

    let filteredSKUs = []
    if (!currentAdGroupId) {
      filteredSKUs = skuData[0]
    } else {
      filteredSKUs = skuData[1].filter(sku => sku.adgroup_id === currentAdGroupId)
    }

    setSkus(filteredSKUs.map((sku) => {
      let ctr = 0
      let cpc = 0
      let acos = 0
      if (parseInt(sku.impressions, 10)) {
        ctr = parseInt(sku.clicks, 10) / parseInt(sku.impressions, 10) * 100
      }
      if (parseInt(sku.clicks, 10)) {
        cpc = parseFloat(sku.cost) / parseInt(sku.clicks, 10)
      }
      if (parseFloat(sku.revenue)) {
        acos = parseFloat(sku.cost) / parseFloat(sku.revenue) * 100
      }

      return {
        ...sku,
        ctr,
        cpc,
        acos,
        className: (currentAcos && acos > parseFloat(currentAcos)) || (parseFloat(sku.cost) && !acos)
          ? 'bg-red' : '',
      }
    }))
  }, [currentAdGroups, currentAcos, currentAdGroupId, skuData, isSKUDataLoading]) // eslint-disable-line

  useEffect(() => {
    if (!currentAcos) {
      return
    }
    setAcos(currentAcos)
  }, [currentAcos])

  const handleChangeAdGroup = (adGroup) => {
    setCurrentAdGroupId(adGroup ? adGroup.adgroupid : null)
  }

  const handleRangeChange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleChangeSkuState = (state) => {
    const selected = skus.filter(sku => selectedSkus.indexOf(sku.id) !== -1)
    const productAds =selected.map(sku => ({
      adId: parseInt(sku.adId, 10),
      state,
    }))

    dispatch(changeSkuState({
      campaignType,
      productAds,
      state,
      adGroupId: parseInt(selectedSkus[0].adgroupid, 10),
      adId: parseInt(selectedSkus[0].adId, 10),
    }))
  }

  const handleChangeAcos = e => {
    if (!e.target.value) {
      return
    }
    setAcos(e.target.value)
  }

  const handleSaveAcos = () => {
    dispatch(
      updateAcos({
        campaignId: currentDetail.campaign_id,
        campaignType: campaignType,
        acos,
      })
    )
  }

  const renderAction = () => {
    return (
      <>
        {
          selectedSkus.length > 0 && (
            <>
              <button type="button" className="btn btn-green" onClick={() => { handleChangeSkuState('enabled') }}>
                Enable
              </button>
              <button type="button" className="btn btn-green" onClick={() => { handleChangeSkuState('paused') }}>
                Pause
              </button>
            </>
          )
        }
        <DateRangeComponent
          placement="bottomEnd"
          value={[currentStartDate, currentEndDate]}
          onChange={handleRangeChange}
        />
      </>
    )
  }

  const renderSKU = sku => (
    <>
      <div className="table-col col-state">
        { sku.state }
      </div>
      <div className="table-col">
        <a href={sku.url} target="_blank" rel="noopener noreferrer">
          <img src={sku.image} alt={sku.sku} />
        </a>
      </div>
      <div className="table-col col-sku">
        { sku.sku }
      </div>
      <div className="table-col">
        { formatCurrency(sku.cost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(sku.impressions, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(sku.clicks, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(sku.ctr, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(sku.cpc, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(sku.acos, 'percent') }
      </div>
      <div className="table-col">
        { formatValue(sku.orders, 'removeZeroDecimal') }
      </div>
    </>
  )

  if (campaignType === 'Sponsored Brands' || campaignType === 'Sponsored Brands Video') {
    return null
  }

  const isLoading = isSKUDataLoading || isChangingSkuState
  const isSameAcos = currentAcos === acos

  return (
    <div className={`campaign-detail-sku-op campaign-detail-tab${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="tab-info">
        <div className="tab-title">
          SKU Optimization
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              If a SKU is highlighted in red, its ACoS is above
              your set ACoS Target Zone. Consider pausing that SKU.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <div className="tab-description">
          Find the skus that are above your acos target.
        </div>
      </div>
      <div className="adgroup-selector">
        <div className="adgroup-content">
          Ad group:
          <button
            type="button"
            className={`btn ${!currentAdGroupId ? 'btn-blue' : 'btn-white'}`}
            onClick={() => { handleChangeAdGroup() }}
          >
            All ad groups
          </button>
          {
            currentAdGroups.map(adGroup => (
              <button
              key={adGroup.adgroupid}
              type="button"
                className={`btn ${currentAdGroupId === adGroup.adgroupid ? 'btn-blue' : 'btn-white'}`}
                onClick={() => { handleChangeAdGroup(adGroup) }}
              >
                { adGroup.name }
              </button>
            ))
          }
        </div>
        <div className="acos-container">
          <span>ACOS Target (%)</span>
          <input value={acos} type="number" onChange={handleChangeAcos} />
          {
            !isSameAcos && (
              <button type="button" className="btn btn-red" onClick={handleSaveAcos}>
                Save
              </button>
            )
          }
        </div>
      </div>
      <SortableTable
        columns={columns}
        defaultSort={['cost', 'desc']}
        sorter={tableSorter(['state', 'sku'])}
        className="table-skus"
        records={skus}
        idField="id"
        searchFields={['sku']}
        selectedRecords={selectedSkus}
        paginationSelectPlacement="top"
        hasSticky
        renderRecord={renderSKU}
        renderTopRight={renderAction}
        onChange={setSelectedSkus}
      />
    </div>
  )
}

export default SKUOPTab
