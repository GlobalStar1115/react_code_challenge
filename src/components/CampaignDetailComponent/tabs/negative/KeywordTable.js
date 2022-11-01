import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'

import SortableTable from '../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../CommonComponents/DateRangeComponent'
import { toast } from '../../../CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../../CommonComponents/LoaderComponent'

import ModalAddNegatives from '../../modals/ModalAddNegatives'

import { setDateRange } from '../../../../redux/actions/header'

import {
  formatValue,
  formatCurrency,
  copyToClipboard,
  tableSorter,
} from '../../../../services/helper'

const regExpForSpecialChars = new RegExp('&#34;', 'g')

const columns = [
  { key: 'search', name: 'Search Words', className: 'col-word' },
  { key: 'clicks', name: 'Unprofitable Clicks' },
  { key: 'revenue', name: 'Revenue' },
  { key: 'cost', name: 'Wasted AD Spend' },
  { key: 'yearlyCost', name: 'Approximate Yearly Savings' },
  { key: 'impressions', name: 'Impress' },
  { key: 'ctr', name: 'CTR' },
]

const KeywordTable = ({ campaignType, currentAdGroupId, dateDiff }) => {
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
      isNegativeWordDataLoading,
      negativeWordData,
      existingNegativeData,
    },
  } = store.getState()

  const [negatives, setNegatives] = useState([])
  const [selectedNegatives, setSelectedNegatives] = useState([])
  const [showAddNegativesModal, setShowAddNegativesModal] = useState(false)

  useEffect(() => {
    if (!negativeWordData || !negativeWordData.length) {
      return
    }

    let searchTermList = negativeWordData[0]
    if (currentAdGroupId) {
      searchTermList = negativeWordData[1].filter(searchTerm => searchTerm.adgroup_id === currentAdGroupId)
    }

    let positiveWordList = []
    const negativeList = []
    const targetAcos = parseFloat(currentAcos || 40)
    searchTermList.forEach((searchTerm) => {
      if (searchTerm.acos !== null && parseFloat(searchTerm.acos) <= targetAcos) {
        // Get a list of profitable words.
        const search = searchTerm.search.replace(regExpForSpecialChars, '')
        positiveWordList = positiveWordList.concat(search.trim().split(/\s+/g))
      } else {
        negativeList.push(searchTerm)
      }
    })
    positiveWordList = [...new Set(positiveWordList)].map(keyword => keyword.trim())

    // Get a list of unprofitable words.
    let negativeWordList = []
    negativeList.forEach((searchTerm) => {
      const search = searchTerm.search.replace(regExpForSpecialChars, '')
      search.trim().split(/\s+/g).forEach((word) => {
        if (positiveWordList.indexOf(word) !== -1) {
          return
        }

        if (existingNegativeData.indexOf(word.toLowerCase()) !== -1) {
          return
        }

        const existingIndex = negativeWordList.findIndex(negative => (
          negative.search === word
        ))

        if (existingIndex === -1) {
          negativeWordList.push({
            id: searchTerm.id,
            search: word,
            revenue: parseFloat(searchTerm.revenue),
            cost: parseFloat(searchTerm.cost),
            impressions: parseInt(searchTerm.impressions, 10),
            clicks: parseInt(searchTerm.clicks, 10),
            orders: parseInt(searchTerm.orders, 10),
          })
        } else {
          negativeWordList[existingIndex].revenue += parseFloat(searchTerm.revenue)
          negativeWordList[existingIndex].cost += parseFloat(searchTerm.cost)
          negativeWordList[existingIndex].impressions += parseFloat(searchTerm.impressions)
          negativeWordList[existingIndex].clicks += parseFloat(searchTerm.clicks)
          negativeWordList[existingIndex].orders += parseFloat(searchTerm.orders)
        }
      })
    })
    negativeWordList = negativeWordList.map((word) => {
      let ctr = 0
      if (word.impressions) {
        ctr = word.clicks / word.impressions * 100
      }

      return {
        ...word,
        ctr,
        yearlyCost: word.cost / dateDiff * 365,
      }
    })

    setNegatives(negativeWordList)
  }, [currentAdGroupId, currentAcos, negativeWordData, existingNegativeData]) // eslint-disable-line

  const handleCopy = () => {
    copyToClipboard([...new Set(selectedNegatives)].join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedNegatives.length} search word${selectedNegatives.length > 1 ? 's' : ''}.`
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
          selectedNegatives.length > 0 && (
            <>
              <button
                type="button"
                className="btn btn-blue"
                onClick={() => { setShowAddNegativesModal(true) }}
              >
                Add negative{selectedNegatives.length > 0 ? 's' : ''} to campaign
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

  const selectedWords = negatives.filter(negative => (
    selectedNegatives.indexOf(negative.search) !== -1
  ))

  return (
    <>
      <div className={`table-content${isNegativeWordDataLoading ? ' loading' : ''}`}>
        { isNegativeWordDataLoading && <LoaderComponent /> }
        <SortableTable
          columns={columns}
          defaultSort={['cost', 'desc']}
          sorter={tableSorter('search')}
          className="table-search-words"
          records={negatives}
          idField="search"
          searchFields={['search']}
          selectedRecords={selectedNegatives}
          paginationSelectPlacement="top"
          hasSticky
          renderRecord={renderNegative}
          renderTopRight={renderAction}
          onChange={setSelectedNegatives}
        />
      </div>
      <ModalAddNegatives
        terms={selectedWords}
        modalType="negative-finder"
        campaignType={campaignType}
        showModal={showAddNegativesModal}
        currentAdGroupId={currentAdGroupId}
        onClose={() => { setShowAddNegativesModal(false) }}
      />
    </>
  )
}

export default KeywordTable
