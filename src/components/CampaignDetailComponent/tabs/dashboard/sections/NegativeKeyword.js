import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'

import { toast } from '../../../../CommonComponents/ToastComponent/toast'
import CustomTable from '../../../../CommonComponents/CustomTableComponent'
import LoaderComponent from '../../../../CommonComponents/LoaderComponent'

import {
  changeNegativeKeywordState,
} from '../../../../../redux/actions/campaignDetail'

import { copyToClipboard } from '../../../../../services/helper'

const NegativeKeywordSection = ({ isLoading, campaignDetail }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    campaignDetail: { isChangingNegativeKeywordState, negativeKeywords },
  } = store.getState()

  const [selectedNegatives, setSelectedNegatives] = useState([])

  const handleCopy = () => {
    const negatives = negativeKeywords.filter(negative => (
      selectedNegatives.indexOf(negative.keywordId) !== -1
    )).map(negative => negative.keywordText.trim())

    copyToClipboard(negatives.join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedNegatives.length} negative keyword${selectedNegatives.length > 1 ? 's' : ''}.`
    })
  }

  const handleArchive = () => {
    const negatives = negativeKeywords.filter(negative => (
      selectedNegatives.indexOf(negative.keywordId) !== -1
    )).map(negative => ({
      ...negative,
      state: 'archived',
    }))

    dispatch(changeNegativeKeywordState(campaignDetail.campaignType, negatives))
  }

  const renderAction = () => {
    if (!selectedNegatives.length) {
      return null
    }

    return (
      <>
        <button type="button" className="btn btn-red" onClick={() => { handleArchive() }}>
          Archive Keywords
        </button>
        <button type="button" className="btn btn-green" onClick={() => { handleCopy() }}>
          Copy Keywords
        </button>
      </>
    )
  }

  const renderNegative = negative => (
    <>
      <div className="table-col col-keyword">
        { negative.keywordText }
      </div>
      {
        campaignDetail && campaignDetail.campaignType === 'Sponsored Products' && (
          <div className="table-col col-level">
            { typeof negative.campaign_level !== 'undefined' ? 'Campaign Level' : 'Ad Group Level' }
          </div>
        )
      }
      <div className="table-col col-match-type">
        { negative.matchType === 'negativePhrase' ? 'Negative Phrase' : 'Negative Exact' }
      </div>
    </>
  )

  return (
    <div className={`section section-negative${isLoading || isChangingNegativeKeywordState ? ' loading' : ''}`}>
      { (isLoading || isChangingNegativeKeywordState) && <LoaderComponent /> }
      <div className="section-header">
        <h4>Negative Keywords</h4>
      </div>
      <CustomTable
        className="table-negatives"
        records={negativeKeywords || []}
        idField="keywordId"
        searchFields={['keywordText']}
        selectedRecords={selectedNegatives}
        paginationSelectPlacement="top"
        renderRecord={renderNegative}
        renderTopRight={renderAction}
        onChange={setSelectedNegatives}
      >
        <div className="table-col col-keyword">Keyword</div>
        {
          campaignDetail && campaignDetail.campaignType === 'Sponsored Products' && (
            <div className="table-col col-level">Campaign/Ad Group Level</div>
          )
        }
        <div className="table-col col-match-type">Match Type</div>
      </CustomTable>
    </div>
  )
}

export default NegativeKeywordSection
