import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { ReactComponent as MoreApmSvg } from '../../assets/svg/more-apm.svg'

import CustomTable from '../../components/CommonComponents/CustomTableComponent'

import {
  showAPMAction,
} from '../../redux/actions/pageGlobal'

import {
  getNormalizedCampaignType,
} from '../../services/helper'

const LogTable = ({ logs, selectedLogs, onSelect }) => {
  const dispatch = useDispatch()

  const handleAPMShow = campaignId => (event) => {
    event.preventDefault()
    dispatch(showAPMAction(campaignId))
  }

  const renderLog = log => (
    <>
      <div className="table-col col-type">
        { log.type }
      </div>
      <div className="table-col col-created-at">
        { moment(log.created_at).local().format('M/D') }
      </div>
      <div className="table-col col-campaign">
        {
          log.name !== null && (
            <>
              <Link
                to={{
                  pathname: `/campaign/${log.campaign_id}`,
                  state: {
                    params: {
                      campaignType: getNormalizedCampaignType(log.campaign_type),
                    },
                  },
                }}
                title={log.name}
              >
                { log.name }
                <MoreApmSvg
                  title="Open Smart Pilot"
                  onClick={handleAPMShow(log.campaign_id)}
                />
              </Link>
            </>
          )
        }
      </div>
      <div
        className="table-col col-description"
        dangerouslySetInnerHTML={{
          __html: log.description,
        }}
      />
      <div
        className="table-col col-contents"
        dangerouslySetInnerHTML={{
          __html: log.contents,
        }}
      />
    </>
  )

  return (
    <CustomTable
      className="table-logs"
      records={logs}
      idField="id"
      searchFields={['contents']}
      selectedRecords={selectedLogs}
      paginationSelectPlacement="top"
      renderRecord={renderLog}
      onChange={onSelect}
    >
      <div className="table-col col-type">Log Type</div>
      <div className="table-col col-created-at">Date</div>
      <div className="table-col col-campaign">Campaign</div>
      <div className="table-col col-description">Description</div>
      <div className="table-col col-contents">Detail</div>
    </CustomTable>
  )
}

export default LogTable
