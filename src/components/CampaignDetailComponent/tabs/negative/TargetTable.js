import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'

import ModalAddNegativeAsins from '../../modals/ModalAddNegativeAsins'

import { setDateRange } from '../../../../redux/actions/header'

import {
  formatValue,
  formatCurrency,
  copyToClipboard,
  tableSorter,
} from '../../../../services/helper'

const columns = [
  { key: 'search', name: 'ASIN / Search Words', className: 'col-word' },
  { key: 'clicks', name: 'Unprofitable Clicks' },
  { key: 'revenue', name: 'Revenue' },
  { key: 'cost', name: 'Wasted AD Spend' },
  { key: 'yearlyCost', name: 'Approximate Yearly Savings' },
  { key: 'impressions', name: 'Impress' },
  { key: 'ctr', name: 'CTR' },
]

const TargetTable = ({ currentAdGroupId, dateDiff }) => {
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
      isNegativeWordDataLoading,
      negativeTargetData,
    },
  } = store.getState()

  const [asins, setAsins] = useState([])
  const [selectedAsins, setSelectedAsins] = useState([])
  const [showAddNegativesModal, setShowAddNegativesModal] = useState(false)

  useEffect(() => {
    const extendedAsins = (negativeTargetData || []).map((asin) => {
      let ctr = 0
      if (parseInt(asin.impressions, 10)) {
        ctr = parseInt(asin.clicks, 10) / parseInt(asin.impressions, 10) * 100
      }

      return {
        ...asin,
        asin: asin.search,
        ctr,
        yearlyCost: parseFloat(asin.cost) / dateDiff * 365,
      }
    })

    setAsins(extendedAsins)
  }, [negativeTargetData]) // eslint-disable-line

  const handleCopy = () => {
    copyToClipboard([...new Set(selectedAsins)].join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedAsins.length} search word${selectedAsins.length > 1 ? 's' : ''}.`
    })
  }

  const handleRangeChange = ([startDate, endDate]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const renderAction = () => {
    return (
      <>
        {
          selectedAsins.length > 0 && (
            <>
              <button
                type="button"
                className="btn btn-blue"
                onClick={() => { setShowAddNegativesModal(true) }}
              >
                Add negative{selectedAsins.length > 0 ? 's' : ''} to campaign
              </button>
              <button type="button" className="btn btn-green" onClick={() => { handleCopy() }}>
                Copy to Clipboard
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

  const renderNegative = record => (
    <>
      <div className="table-col col-word">
        { record.search }
      </div>
      <div className="table-col">
        { formatValue(record.clicks, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatCurrency(record.revenue, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatCurrency(record.cost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatCurrency(record.yearlyCost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(record.impressions, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(record.ctr, 'percent') }
      </div>
    </>
  )

  const selectedWords = asins.filter(negative => (
    selectedAsins.indexOf(negative.search) !== -1
  ))

  return (
    <>
      <div className={`table-content${isNegativeWordDataLoading ? ' loading' : ''}`}>
        { isNegativeWordDataLoading && <LoaderComponent /> }
        <SortableTable
          columns={columns}
          defaultSort={['cost', 'desc']}
          sorter={tableSorter(['search'])}
          className="table-search-words"
          records={asins}
          idField="search"
          searchFields={['search']}
          selectedRecords={selectedAsins}
          paginationSelectPlacement="top"
          hasSticky
          renderRecord={renderNegative}
          renderTopRight={renderAction}
          onChange={setSelectedAsins}
        />
      </div>
      <ModalAddNegativeAsins
        showModal={showAddNegativesModal}
        terms={selectedWords}
        currentAdGroupId={currentAdGroupId}
        onClose={() => { setShowAddNegativesModal(false) }}
      />
    </>
  )
}

export default TargetTable
