import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'

import { toast } from '../../../../CommonComponents/ToastComponent/toast'
import CustomTable from '../../../../CommonComponents/CustomTableComponent'
import LoaderComponent from '../../../../CommonComponents/LoaderComponent'

import {
  changeNegativeTargetState,
} from '../../../../../redux/actions/campaignDetail'

import { copyToClipboard, capitalizeFirstLetter } from '../../../../../services/helper'

const NegativeTargetSection = ({ isLoading, campaignDetail }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    campaignDetail: { isChangingNegativeTargetState, negativeTargets },
  } = store.getState()

  const [selectedNegatives, setSelectedNegatives] = useState([])

  const handleCopy = () => {
    const negatives = negativeTargets.filter(negative => (
      selectedNegatives.indexOf(negative.target_id) !== -1
    )).map((negative) => {
      let expression = negative.resolved_expression
      try {
        const parsed = JSON.parse(negative.resolved_expression)
        if (parsed.length) {
          expression = parsed[0].value
        }
      } catch (e) {
        //
      }
      return expression
    })

    copyToClipboard(negatives.join('\n'))

    toast.show({
      title: 'Success',
      description: `Successfully copied ${selectedNegatives.length} negative target${selectedNegatives.length > 1 ? 's' : ''}.`
    })
  }

  const handleArchive = () => {
    const negatives = negativeTargets.filter(negative => (
      selectedNegatives.indexOf(negative.target_id) !== -1
    )).map(negative => ({
      ...negative,
      state: 'archived',
    }))

    dispatch(changeNegativeTargetState(campaignDetail.campaignType, negatives))
  }

  const renderAction = () => {
    if (!selectedNegatives.length) {
      return null
    }

    return (
      <>
        <button type="button" className="btn btn-red" onClick={() => { handleArchive() }}>
          Archive Targets
        </button>
        <button type="button" className="btn btn-green" onClick={() => { handleCopy() }}>
          Copy Targets
        </button>
      </>
    )
  }

  const renderNegative = (negative) => {
    let expression = negative.resolved_expression
    try {
      const parsed = JSON.parse(negative.resolved_expression)
      if (parsed.length) {
        expression = parsed[0].value
      }
    } catch (e) {
      //
    }
    return (
      <>
        <div className="table-col col-target">
          { expression }
        </div>
        {
          campaignDetail && campaignDetail.campaignType === 'Sponsored Products' && (
            <div className="table-col col-level">
              { typeof negative.campaign_level !== 'undefined' ? 'Campaign Level' : 'Ad Group Level' }
            </div>
          )
        }
        <div className="table-col col-type">
          { capitalizeFirstLetter(negative.targeting_type || 'Manual') }
        </div>
      </>
    )
  }

  return (
    <div className={`section section-negative${isLoading || isChangingNegativeTargetState ? ' loading' : ''}`}>
      { (isLoading || isChangingNegativeTargetState) && <LoaderComponent /> }
      <div className="section-header">
        <h4>Negative Targets</h4>
      </div>
      <CustomTable
        className="table-negatives"
        records={negativeTargets || []}
        idField="target_id"
        searchFields={['resolved_expression']}
        selectedRecords={selectedNegatives}
        paginationSelectPlacement="top"
        renderRecord={renderNegative}
        renderTopRight={renderAction}
        onChange={setSelectedNegatives}
      >
        <div className="table-col col-target">Target</div>
        {
          campaignDetail && campaignDetail.campaignType === 'Sponsored Products' && (
            <div className="table-col col-level">Campaign/Ad Group Level</div>
          )
        }
        <div className="table-col col-type">Match Type</div>
      </CustomTable>
    </div>
  )
}

export default NegativeTargetSection
