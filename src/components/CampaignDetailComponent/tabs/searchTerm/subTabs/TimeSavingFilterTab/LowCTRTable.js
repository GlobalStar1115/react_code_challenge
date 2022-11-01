import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'

import CustomTable from '../../../../../CommonComponents/CustomTableComponent'
import DateRangeComponent from '../../../../../CommonComponents/DateRangeComponent'
import { toast } from '../../../../../CommonComponents/ToastComponent/toast'
import ModalAddNegatives from '../../../../modals/ModalAddNegatives'

import { setDateRange } from '../../../../../../redux/actions/header'

import { formatValue, copyToClipboard } from '../../../../../../services/helper'

const LowCTRTable = ({ campaignType, currentAdGroupId, hideNegatedTerms }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    header: {
      currentStartDate,
      currentEndDate,
    },
    campaignDetail: {
      stData,
      negativeKWData,
    },
  } = store.getState()

  const [searchTerms, setSearchTerms] = useState([])
  const [selectedSearchTerms, setSelectedSearchTerms] = useState([])
  const [showAddNegativesModal, setShowAddNegativesModal] = useState(false)

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

    filteredSTs = filteredSTs.filter(st =>
      parseInt(st.impressions) >= 50 && parseInt(st.clicks, 10) / parseInt(st.impressions, 10) * 100 < 0.4
    )

    filteredSTs = filteredSTs.map((st) => {
      let ctr = 0
      if (parseInt(st.impressions, 10)) {
        ctr = parseInt(st.clicks, 10) / parseInt(st.impressions, 10) * 100
      }

      return {
        ...st,
        impressions: formatValue(st.impressions, 'removeZeroDecimal'),
        orders: formatValue(st.orders, 'removeZeroDecimal'),
        ctr: formatValue(ctr, 'percent'),
      }
    })

    setSearchTerms(filteredSTs)
  }, [stData, currentAdGroupId, negativeKWData, hideNegatedTerms])

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
              <button
                type="button"
                className="btn btn-blue"
                onClick={() => { setShowAddNegativesModal(true) }}
              >
                Add negative{selectedSearchTerms.length > 0 ? 's' : ''} to campaign
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

  const renderST = st => (
    <>
      <div className="table-col col-search-term">
        { st.search }
      </div>
      <div className="table-col">
        { st.orders }
      </div>
      <div className="table-col">
        { st.impressions }
      </div>
      <div className="table-col">
        { st.ctr }
      </div>
    </>
  )

  const selectedSTs = searchTerms.filter(st => (
    selectedSearchTerms.indexOf(st.id) !== -1
  ))

  return (
    <div className="table-container">
      <div className="table-title">
        Low CTR
      </div>
      <CustomTable
        className="table-search-terms"
        records={searchTerms}
        idField="id"
        searchFields={['search']}
        selectedRecords={selectedSearchTerms}
        paginationSelectPlacement="top"
        renderRecord={renderST}
        renderTopRight={renderAction}
        onChange={setSelectedSearchTerms}
      >
        <div className="table-col col-search-term">Search Term</div>
        <div className="table-col">Orders</div>
        <div className="table-col">Impress</div>
        <div className="table-col">CTR</div>
      </CustomTable>
      <ModalAddNegatives
        showModal={showAddNegativesModal}
        terms={selectedSTs}
        modalType="st"
        campaignType={campaignType}
        currentAdGroupId={currentAdGroupId}
        onClose={() => { setShowAddNegativesModal(false) }}
      />
    </div>
  )
}

export default LowCTRTable
