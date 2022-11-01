import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown } from 'rsuite'

import { ReactComponent as MoreApmSvg } from '../../assets/svg/more-apm.svg'
import { ReactComponent as MoreDotsSvg } from '../../assets/svg/more-dots.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import TableCol from './TableCol'

import {
  showAPMAction,
} from '../../redux/actions/pageGlobal'

const campaignTypes = {
  'Sponsored Brands': 'Sponsored Brand',
  'Sponsored Products': 'Sponsored Product',
  'Sponsored Displays': 'Sponsored Display',
  'Sponsored Brands Video': 'Sponsored Brand Video'
}

const stateLabels = {
  enabled: 'Active',
  paused: 'Paused',
  archived: 'Archived',
}

const TableRow = ({ campaign, columns, selectedCampaigns, campaignTableColumns,
  acosCampaignId, acosRef,
  dailyBudgetCampaignId, dailyBudgetRef,
  isShowHistory, currencySign, currencyRate,
  onSelect, onOpenAcosPopup, onSaveAcos, onCancelAcos,
  onOpenDailyBudgetPopup, onSaveDailyBudget, onCancelDailyBudget, onClickHistory, startDate, endDate }) => {
  const dispatch = useDispatch()

  const isSelected = typeof selectedCampaigns.find(selected => (
    selected.campaignid === campaign.campaignid
  )) !== 'undefined'

  let targetingType
  if (campaign.campaignType === 'Sponsored Products') {
    if (campaign.targeting_type === 'auto') {
      targetingType = 'Auto'
    } else {
      targetingType = 'Manual'
    }
  }

  const handleAPMShow = () => {
    dispatch(showAPMAction(campaign.campaignid))
  }

  return (
    <div className="table-row">
      <div className="table-col">
        <CheckboxComponent
          checked={isSelected}
          onChange={(checked) => { onSelect(checked, campaign) } }
        />
      </div>
      <div className="table-col">
        <div className="campaign-status">
          <div className={`status ${campaign.state === 'enabled' ? 'on' : 'off'}`}>
            <div className="bullet"></div>
            <span>{ stateLabels[campaign.state] }</span>
          </div>
          <div className={`status ${campaign.is_ap_active ? 'on' : 'off'}`}>
            <div className="bullet"></div>
            <span>Smart Pilot { campaign.is_ap_active ? 'On' : 'Off' }</span>
          </div>
          <MoreApmSvg title="Open Smart Pilot" onClick={handleAPMShow} />
        </div>
        <Link
          to={{
            pathname: `/campaign/${campaign.campaignid}`,
            state: {
              params: {
                campaignType: campaign.campaignType,
              },
            },
          }}
          className="campaign-name"
          title={campaign.campaign}
        >
          { campaign.campaign }
        </Link>
        <div className="campaign-detail">
          {
            targetingType && <span>{ targetingType }</span>
          }
          <span>
            { campaignTypes[campaign.campaignType] }
          </span>
        </div>
      </div>
      {
        campaignTableColumns.includes('target_acos') && (
          <div className="table-col">
            {
              acosCampaignId === campaign.campaignid
              ? (
                <>
                  <input type="text" ref={acosRef} className="edit-input"/>
                  <div className="action-button-container">
                    <button type="button" className="btn btn-blue" onClick={() => { onSaveAcos(campaign) }}>
                      Save
                    </button>
                    <button type="button" className="btn btn-white" onClick={() => { onCancelAcos() }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <input
                  type="number"
                  className="edit-input"
                  value={parseFloat(campaign.target_acos)}
                  onChange={() => { onOpenAcosPopup(campaign.campaignid) } }
                />
              )
            }
          </div>
        )
      }
      {
        campaignTableColumns.includes('daily_budget') && (
          <div className="table-col">
            {
              dailyBudgetCampaignId === campaign.campaignid
              ? (
                <>
                  <input type="text" ref={dailyBudgetRef} className="edit-input"/>
                  <div className="action-button-container">
                    <button type="button" className="btn btn-blue" onClick={() => { onSaveDailyBudget(campaign) }}>
                      Save
                    </button>
                    <button type="button" className="btn btn-white" onClick={() => { onCancelDailyBudget() }}>
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <input
                  type="number"
                  className="edit-input"
                  value={campaign.daily_budget}
                  onChange={() => { onOpenDailyBudgetPopup(campaign.campaignid) }}
                />
              )
            }
          </div>
        )
      }
      {
        columns.map(column => {
          if (column.name !== 'target_acos' && column.name !== 'daily_budget' && column.name !== 'campaign') {
            if (campaignTableColumns.includes(column.name)) {
              return (
                <TableCol
                  key={campaign.campaign+column.name}
                  campaign={campaign}
                  currencyRate={currencyRate}
                  currencySign={currencySign}
                  showHistory={isShowHistory}
                  fieldValue={column.name}
                  fieldLabel={column.label}
                  onClickHistory={onClickHistory}
                  dataType={column.dataType}
                  decimalLength={column.decimalLength}
                  direct={column.direct}
                  startDate={startDate}
                  endDate={endDate}
                />
              )
            }
          }
          return null
        })
      }
      <div className="table-col action-column">
        <Dropdown
          title={(<MoreDotsSvg />)}
          noCaret
          placement="topEnd"
        >
          <Dropdown.Item
            renderItem={() => (
              <Link
                to={{
                  pathname: `/campaign/${campaign.campaignid}`,
                  state: {
                    params: {
                      campaignType: campaign.campaignType,
                    },
                  },
                }}
                className="rs-dropdown-item-content"
              >
                View Campaign Dashboard
              </Link>
            )}
          >
          </Dropdown.Item>
          <Dropdown.Item onClick={handleAPMShow}>Open Smart Pilot</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  )
}

export default TableRow
