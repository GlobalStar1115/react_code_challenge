import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import SortableTable from '../../../../../CommonComponents/SortableTableComponent'
import DateRangeComponent from '../../../../../CommonComponents/DateRangeComponent'
import { toast } from '../../../../../CommonComponents/ToastComponent/toast'
import ModalAddNegatives from '../../../../modals/ModalAddNegatives'

import { setDateRange } from '../../../../../../redux/actions/header'

import {
  getSTData,
  getNegativeKWData,
} from '../../../../../../redux/actions/campaignDetail'

import {
  formatValue,
  formatCurrency,
  capitalizeFirstLetter,
  copyToClipboard,
  tableSorter,
} from '../../../../../../services/helper'

const columns = [
  { key: 'search', name: 'Search Term', className: 'col-search-term' },
  { key: 'matchType', name: 'Match Type' },
  { key: 'keyword', name: 'Associated Target', className: 'col-keyword' },
  { key: 'orders', name: 'Orders' },
  { key: 'clickOrder', name: 'Clicks/Orders' },
  { key: 'acos', name: 'ACoS' },
  { key: 'revenue', name: 'Rev' },
  { key: 'cost', name: 'Spend' },
  { key: 'impressions', name: 'Impress' },
  { key: 'clicks', name: 'Clicks' },
  { key: 'ctr', name: 'CTR' },
  { key: 'cpc', name: 'Ave CPC' },
  { key: 'conversion', name: 'Conv' },
]

const STTab = ({ campaignType, currentAdGroupId, hideKeywords, hideAsins, hideNegatedTerms, isProfitable }) => {
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
      currentAdGroups,
      stData,
      negativeKWData,
    },
  } = store.getState()

  const { id: campaignId } = useParams()

  const [searchTerms, setSearchTerms] = useState([])
  const [selectedSearchTerms, setSelectedSearchTerms] = useState([])
  const [showAddNegativesModal, setShowAddNegativesModal] = useState(false)

  // Find search terms.
  useEffect(() => {
    if (!currentStartDate || !currentEndDate) {
      return
    }
    dispatch(getSTData({
      campaignId,
      campaignType,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
      isProfitable,
      stOnly: hideKeywords,
      targetAcos: currentAcos || 0,
    }))
  }, [currentStartDate, currentEndDate, campaignId, currentAcos, hideKeywords]) // eslint-disable-line

  // Find negative keywords.
  useEffect(() => {
    if (!currentStartDate || !currentEndDate || !hideNegatedTerms) {
      return
    }

    let adGroupIds
    if (currentAdGroupId) {
      adGroupIds = currentAdGroupId
    } else if (currentAdGroups && currentAdGroups.length > 0) {
      adGroupIds = currentAdGroups.map(adGroup => adGroup.adgroupid).join()
    }

    dispatch(getNegativeKWData({
      campaignId,
      adGroupIds,
    }))
  }, [currentStartDate, currentEndDate, campaignId, currentAdGroupId, hideNegatedTerms]) // eslint-disable-line

  // Filter found search terms.
  useEffect(() => {
    if (!stData || !stData.length) {
      return
    }

    let filteredSTs = []
    if (!currentAdGroupId) {
      filteredSTs = stData[0]
    } else {
      filteredSTs = stData[1].filter(st => st.adgroup_id === currentAdGroupId)
    }

    // Remove ASINs.
    if (hideAsins) {
      filteredSTs = filteredSTs.filter(st => !(/^[0-9a-z]{10}$/g.test(st.search)))
    }

    // New terms only.
    if (hideNegatedTerms) {
      if (negativeKWData && negativeKWData.length) {
        filteredSTs = filteredSTs.filter(st =>
          !negativeKWData.find(
            negative => negative.keywordText.trim() === st.search.trim()
          )
        )
      }
    }

    filteredSTs = filteredSTs.map((st) => {
      let ctr = 0
      let cpc = 0
      let conversion = 0
      let clickOrder = 0
      if (parseInt(st.impressions, 10)) {
        ctr = parseInt(st.clicks, 10) / parseInt(st.impressions, 10) * 100
      }
      if (parseInt(st.clicks, 10)) {
        cpc = parseFloat(st.cost) / parseInt(st.clicks, 10)
        conversion = parseInt(st.orders, 10) / parseInt(st.clicks, 10) * 100
      }
      if (parseInt(st.orders, 10)) {
        clickOrder = parseInt(st.clicks, 10) / parseInt(st.orders, 10)
      }

      return {
        ...st,
        matchType: capitalizeFirstLetter(st.match_type),
        keywordText: st.keyword === '(_targeting_auto_)' ? '*' : st.keyword,
        ctr,
        cpc,
        conversion,
        clickOrder,
      }
    })

    setSearchTerms(filteredSTs)
  }, [stData, currencyRate, currencySign, currentAdGroupId, negativeKWData, hideAsins, hideNegatedTerms])

  const handleCopy = () => {
    const sts = searchTerms.filter(st => (
      selectedSearchTerms.indexOf(st.id) !== -1
    )).map(st => st.search.trim())

    copyToClipboard([...new Set(sts)].join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedSearchTerms.length} search term${selectedSearchTerms.length > 1 ? 's' : ''}.`
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
          selectedSearchTerms.length > 0 && (
            <>
              {
                !isProfitable && (
                  <button
                    type="button"
                    className="btn btn-blue"
                    onClick={() => { setShowAddNegativesModal(true) }}
                  >
                    Add negative{selectedSearchTerms.length > 0 ? 's' : ''} to campaign
                  </button>
                )
              }
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

  const renderST = st => (
    <>
      <div className="table-col col-search-term">
        { st.search }
      </div>
      <div className="table-col">
        { st.matchType }
      </div>
      <div className="table-col col-keyword">
        { st.keyword }
      </div>
      <div className="table-col">
        { formatValue(st.orders, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(st.clickOrder, 'number', 1) }
      </div>
      <div className="table-col">
        { formatValue(st.acos, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(st.revenue, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatCurrency(st.cost, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(st.impressions, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(st.clicks, 'removeZeroDecimal') }
      </div>
      <div className="table-col">
        { formatValue(st.ctr, 'percent') }
      </div>
      <div className="table-col">
        { formatCurrency(st.cpc, currencySign, currencyRate) }
      </div>
      <div className="table-col">
        { formatValue(st.conversion, 'percent') }
      </div>
    </>
  )

  const selectedSTs = searchTerms.filter(st => (
    selectedSearchTerms.indexOf(st.id) !== -1
  ))

  return (
    <>
      <SortableTable
        columns={columns}
        defaultSort={['cost', 'desc']}
        sorter={tableSorter(['search', 'matchType', 'keyword'])}
        className="table-search-terms"
        records={searchTerms}
        idField="id"
        searchFields={['search']}
        selectedRecords={selectedSearchTerms}
        paginationSelectPlacement="top"
        hasSticky
        renderRecord={renderST}
        renderTopRight={renderAction}
        onChange={setSelectedSearchTerms}
      />
      {
        !isProfitable && (
          <ModalAddNegatives
            showModal={showAddNegativesModal}
            terms={selectedSTs}
            modalType="st"
            campaignType={campaignType}
            currentAdGroupId={currentAdGroupId}
            onClose={() => { setShowAddNegativesModal(false) }}
          />
        )
      }
    </>
  )
}

export default STTab
