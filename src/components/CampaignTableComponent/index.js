/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import Checkbox from 'react-custom-checkbox'
import * as Icon from 'react-icons/fi'

//--components
import APMComponent from '../APMComponent'
import EditTableColumnComponent from './edit-column'
import EditTableFilterComponent from './edit-filter'
import PaginationComponent from '../CommonComponents/PaginationComponent'

import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'
import { ReactComponent as HistorySvg } from '../../assets/svg/history.svg'
import { ReactComponent as FilterSvg } from '../../assets/svg/filter.svg'
import { ReactComponent as ColumnSvg } from '../../assets/svg/columns.svg'
import { ReactComponent as MoreDotSvg } from '../../assets/svg/more-dots.svg'

import {
  showColumnEditorAction,
  showTableFilterAction,
  showAPMAction,
} from '../../redux/actions/pageGlobal'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const CampaignTableComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const location = useLocation()
  const history = useHistory()

  const { campaign, pageGlobal, header } = store.getState()
  const {
    currencyRate,
    currencySign,
  } = header
  const { topCampaigns } = campaign
  const { showColumnEditor, showTableFilter, showAPM, campaignTableColumns, campaignFilters } = pageGlobal

  const [pageStartNum, setPageStartNum] = useState(0)
  const [pageEndNum, setPageEndNum] = useState(10)
  const [searchKey, setSearchKey] = useState('')

  let total = {
    revenue: 0,
    spend: 0,
    imp: 0,
    clicks: 0,
    orders: 0,
  }

  const columns = [
    {
      name: 'campaign',
      label: 'campaign'
    },
    {
      name: 'daily_budget',
      label: 'Daily Budget'
    },
    {
      name: 'impression',
      label: 'Imp.'
    },
    {
      name: 'clicks',
      label: 'Clicks'
    },
    {
      name: 'ctr',
      label: 'CTR %'
    },
    {
      name: 'spend',
      label: 'Spend'
    },
    {
      name: 'cpc',
      label: 'AVE CPC'
    },
    {
      name: 'orders',
      label: 'Orders'
    },
    {
      name: 'sales',
      label: 'Sales'
    },
    {
      name: 'acos',
      label: 'ACoS'
    },
    {
      name: 'roas',
      label: 'Return on Ad spend'
    },
    {
      name: 'ntb-orders',
      label: 'NTB Orders'
    },
    {
      name: 'ntb-orders-percent',
      label: 'NTB Orders %'
    },
    {
      name: 'ntb-sales',
      label: 'NTB Sales'
    },
    {
      name: 'ntb-sales-percent',
      label: 'NTB Sales %'
    }
  ]

  const handleCampaignDetail = campaign => (event) => {
    event.preventDefault()

    if (location.pathname.includes('/dashboard')
      || location.pathname.includes('/campaigns')) {
      history.push({
        pathname: `/campaign/${campaign.campaign_id}`,
        state: {
          params: {
            campaignType: campaign.campaigntype,
          },
        }
      })
    }
  }

  const loadPageCampaigns = (pageNum, pageRows) => {
    setPageStartNum((pageNum - 1) * pageRows)
    setPageEndNum(pageNum * pageRows - 1)
  }
  const onShowColumnEditor = () => {
    dispatch(showColumnEditorAction())
  }
  const onShowTableFilter = () => {
    dispatch(showTableFilterAction())
  }
  const onShowAPM = (campaign) => () => {
    dispatch(showAPMAction(campaign.campaign_id))
  }

  topCampaigns.sort(function (a, b) {
    return b.cost - a.cost
  })
  topCampaigns.forEach((data) => {
    total.revenue += data['revenue'] * 1
    total.spend += data['cost'] * 1
    total.imp += data['impressions'] * 1
    total.clicks += data['clicks'] * 1
    total.orders += data['orders'] * 1
  })
  const campaignElements = topCampaigns.slice(pageStartNum, pageEndNum).map((data, ind) => {
    if (!data['campaign_name'].toLowerCase().includes(searchKey.toLowerCase())) {
      return null
    }
    if (campaignFilters.campaignName) {
      if (!data['campaign_name'].toLowerCase().includes(campaignFilters.campaignName.label.toLowerCase())) {
        return null
      }
    }
    if (campaignFilters.campaignType && campaignFilters.campaignType.value !== 'all') {
      if (data['targeting_type'] !== campaignFilters.campaignType.value) {
        return null
      }
    }
    if (campaignFilters.targetAcosMin) {
      if (data['acos']*1 < campaignFilters.targetAcosMin*1) {
        return null
      }
    }
    if (campaignFilters.targetAcosMax) {
      if (data['acos']*1 > campaignFilters.targetAcosMax*1) {
        return null
      }
    }
    if (campaignFilters.budgetMin) {
      if (data['daily_budget']*1 < campaignFilters.budgetMin*1) {
        return null
      }
    }
    if (campaignFilters.budgetMax) {
      if (data['daily_budget']*1 > campaignFilters.budgetMax*1) {
        return null
      }
    }
    if (campaignFilters.ordersMin) {
      if (data['orders']*1 < campaignFilters.ordersMin*1) {
        return null
      }
    }
    if (campaignFilters.ordersMax) {
      if (data['orders']*1 > campaignFilters.ordersMax*1) {
        return null
      }
    }
    if (campaignFilters.spendMin) {
      if (data['cost']*1 < campaignFilters.spendMin*1) {
        return null
      }
    }
    if (campaignFilters.spendMax) {
      if (data['cost']*1 > campaignFilters.spendMax*1) {
        return null
      }
    }
    if (campaignFilters.impressionMin) {
      if (data['impressions']*1 < campaignFilters.impressionMin*1) {
        return null
      }
    }
    if (campaignFilters.impressionMax) {
      if (data['impressions']*1 > campaignFilters.impressionMax*1) {
        return null
      }
    }
    if (campaignFilters.clicksMin) {
      if (data['clicks']*1 < campaignFilters.clicksMin*1) {
        return null
      }
    }
    if (campaignFilters.clicksMax) {
      if (data['clicks']*1 < campaignFilters.clicksMax*1) {
        return null
      }
    }
    return (
      <div className="table-row" key={ind}>
        <div className="table-col">
          <Checkbox
            icon={
              <div
                style={{
                  backgroundColor: "#246FE1",
                  borderRadius: "3px",
                  maxHeight: "18px",
                  cursor: "pointer"
                }}
              >
                <Icon.FiCheck color="white" size={18} />
              </div>
            }
            borderColor="#CECECE"
            style={{
              cursor: "pointer"
            }}
            size={18}
            borderRadius={3}
          />
        </div>
        <div className="table-col">
          <div className="campaign-status">
            <div className="status on">
              <span className="bullet" />
              <span>Active</span>
            </div>
            <div className="status off">
              <span className="bullet" />
              <span>Smart Pilot Off</span>
            </div>
          </div>
          <a
            href="#"
            className="campaign-name"
            onClick={handleCampaignDetail(data)}
          >
            { data['campaign_name'] }
          </a>
          <div className="campaign-detail">
            <span className="auto">Manaual</span>
            <span className="sponsored">Sponsored Brands</span>
          </div>
        </div>
        {campaignTableColumns.includes('daily_budget') && <div className="table-col">{formatCurrency(data['daily_budget'], currencySign, currencyRate) }</div>}
        {campaignTableColumns.includes('impression') && <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>}
        {campaignTableColumns.includes('clicks') && <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>}
        {campaignTableColumns.includes('ctr') && <div className="table-col">{formatValue(data['ctr']*100, 'number', 2)}</div>}
        {campaignTableColumns.includes('spend') && <div className="table-col">{formatCurrency(data['cost'], currencySign, currencyRate)}</div>}
        {campaignTableColumns.includes('cpc') && <div className="table-col">{formatValue(data['cpc'], 'number', 2)}</div>}
        {campaignTableColumns.includes('orders') && <div className="table-col">{formatValue(data['orders'], 'number', 0)}</div>}
        {campaignTableColumns.includes('sales') && <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>}
        {campaignTableColumns.includes('acos') && <div className="table-col">{formatValue(data['acos'], 'number', 2)}</div>}
        {campaignTableColumns.includes('roas') && <div className="table-col"></div>}
        {campaignTableColumns.includes('ntb-orders') && <div className="table-col"></div>}
        {campaignTableColumns.includes('ntb-orders-percent') && <div className="table-col"></div>}
        {campaignTableColumns.includes('ntb-sales') && <div className="table-col"></div>}
        {campaignTableColumns.includes('ntb-sales-percent') && <div className="table-col"></div>}
        <div className="table-col">
          <MoreDotSvg onClick={onShowAPM(data)} />
        </div>
      </div>
    )
  })

  total = {
    revenue: parseInt(total.revenue * 100) / 100,
    spend: parseInt(total.spend * 100) / 100,
    imp: parseInt(total.imp * 100) / 100,
    clicks: parseInt(total.clicks * 100) / 100,
    orders: parseInt(total.orders * 100) / 100,
  }

  return (
    <>
      <div className="campaign-table-component">
        { showColumnEditor && <EditTableColumnComponent columns={columns} /> }
        { showTableFilter && <EditTableFilterComponent /> }
        <div className="table-header">
          <div className="table-header-left">
            <SearchSvg />
            <input type="text" className="table-header-search" placeholder="Type to search..." value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
          </div>
          <div className="table-header-right">
            <HistorySvg />
            <FilterSvg onClick={onShowTableFilter} />
            <ColumnSvg onClick={onShowColumnEditor} />
          </div>
        </div>
        <div className="table-body">
          <div className="table-row content-header">
            <div className="table-col">
              <Checkbox
                icon={
                  <div
                    style={{
                      backgroundColor: "#246FE1",
                      borderRadius: "3px",
                      maxHeight: "18px",
                      cursor: "pointer"
                    }}
                  >
                    <Icon.FiCheck color="white" size={18} />
                  </div>
                }
                borderColor="#CECECE"
                style={{
                  cursor: "pointer"
                }}
                size={18}
                borderRadius={3}
              />
            </div>
            {campaignTableColumns.includes('campaign') && <div className="table-col">Campaign</div>}
            {campaignTableColumns.includes('daily_budget') && <div className="table-col">Daily Budget</div>}
            {campaignTableColumns.includes('impression') && <div className="table-col">Impressions</div>}
            {campaignTableColumns.includes('clicks') && <div className="table-col">Clicks</div>}
            {campaignTableColumns.includes('ctr') && <div className="table-col">CTR%</div>}
            {campaignTableColumns.includes('spend') && <div className="table-col">Spend</div>}
            {campaignTableColumns.includes('cpc') && <div className="table-col">AVE CPC</div>}
            {campaignTableColumns.includes('orders') && <div className="table-col">Orders</div>}
            {campaignTableColumns.includes('sales') && <div className="table-col">Sales</div>}
            {campaignTableColumns.includes('acos') && <div className="table-col">ACoS</div>}
            {campaignTableColumns.includes('roas') && <div className="table-col">Return on Ad spend</div>}
            {campaignTableColumns.includes('ntb-orders') && <div className="table-col">NTB Orders</div>}
            {campaignTableColumns.includes('ntb-orders-percent') && <div className="table-col">NTB Orders %</div>}
            {campaignTableColumns.includes('ntb-sales') && <div className="table-col">NTB Sales</div>}
            {campaignTableColumns.includes('ntb-sales-percent') && <div className="table-col">NTB Sales Percent</div>}
            <div className="table-col"></div>
          </div>
          {
            campaignElements
          }
          <div className="table-row content-footer">
            <div className="table-col">
            </div>
            <div className="table-col">Totals :</div>
            {campaignTableColumns.includes('daily_budget') && <div className="table-col"></div>}
            {campaignTableColumns.includes('impression') && <div className="table-col">{formatValue(total.imp, 'number', 0)}</div>}
            {campaignTableColumns.includes('clicks') && <div className="table-col">{formatValue(total.clicks, 'number', 0)}</div>}
            {campaignTableColumns.includes('ctr') && <div className="table-col"> </div>}
            {campaignTableColumns.includes('spend') && <div className="table-col">{formatValue(total.spend, 'number', 0)}</div>}
            {campaignTableColumns.includes('cpc') && <div className="table-col"> </div>}
            {campaignTableColumns.includes('orders') && <div className="table-col">{formatValue(total.orders, 'number', 0)}</div>}
            {campaignTableColumns.includes('sales') && <div className="table-col">{formatCurrency(total.revenue, currencySign, currencyRate)}</div>}
            {campaignTableColumns.includes('acos') && <div className="table-col"></div>}
            {campaignTableColumns.includes('roas') && <div className="table-col"></div>}
            {campaignTableColumns.includes('ntb-orders') && <div className="table-col"> </div>}
            {campaignTableColumns.includes('ntb-orders-percent') && <div className="table-col"> </div>}
            {campaignTableColumns.includes('ntb-sales') && <div className="table-col"> </div>}
            {campaignTableColumns.includes('ntb-sales-percent') && <div className="table-col"> </div>}
            <div className="table-col"></div>
          </div>
        </div>
        <PaginationComponent
          total={topCampaigns.length}
          loadData={loadPageCampaigns}
        />
      </div>
      { showAPM && <APMComponent /> }
    </>
  )
}

export default CampaignTableComponent
