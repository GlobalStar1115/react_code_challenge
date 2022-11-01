import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'

//--assets
import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'
import { ReactComponent as FilterSvg } from '../../assets/svg/filter.svg'
import { ReactComponent as ColumnSvg } from '../../assets/svg/columns.svg'

import PaginationComponent from '../CommonComponents/PaginationComponent'
import DateRangeComponent from '../CommonComponents/DateRangeComponent'
import EditTableColumnComponent from './edit-column'
import EditTableFilterComponent from './edit-filter'

import { setDateRange, sortPortfolioData } from '../../redux/actions/portfolio'
import { getTopCampaigns } from '../../redux/actions/campaign'
import { showColumnEditorAction, showTableFilterAction } from '../../redux/actions/pageGlobal'

import {
  formatCurrency, formatValue
} from '../../services/helper'

const PortfolioTableComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()

  const { portfolio, pageGlobal, header, campaign } = store.getState()
  const { listPortfolios, startDate, endDate, sortColumnName, sortDirection } = portfolio
  const { showColumnEditor, showTableFilter, portfolioTableColumns, portfolioFilters } = pageGlobal
  const { currencyRate,currencySign } = header
  const { topCampaigns } = campaign

  const [pageStartNum, setPageStartNum] = useState(0)
  const [pageEndNum, setPageEndNum] = useState(10)
  const [searchKey, setSearchKey] = useState('')
  const [portfolioExpanded, setPortfolioExpanded] = useState({})

  const headerRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  const [topPos, setTopPos] = useState(0)

  useEffect(() => {
    dispatch(getTopCampaigns({startDate, endDate}))
  }, [startDate, endDate, dispatch])

  const handleScroll = () => {
    setIsSticky(false)
    if (headerRef.current) {
      const { top } = headerRef.current.getBoundingClientRect()
      if (top <= 0) {
        setIsSticky(true)
        setTopPos(-top)
      }
    }
  }

  useEffect(() => {
    const mainContent = document.querySelector('.main-content')
    mainContent.addEventListener('scroll', handleScroll)

    return () => {
      mainContent.removeEventListener('scroll', () => handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!isSticky) {
      return
    }
    if (!topPos) {
      return
    }
    headerRef.current.style.top = `${topPos}px`
  }, [isSticky, topPos])

  const columns = [
    {
      name: 'portfolio',
      label: 'Portfolio'
    },
    {
      name: 'daily_budget',
      label: 'Daily Budget'
    },
    {
      name: 'start_date',
      label: 'Start Date'
    },
    {
      name: 'end_date',
      label: 'End Date'
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
      label: 'CTR%'
    },
    {
      name: 'spend',
      label: 'Ad Spend'
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
      label: 'ROAS'
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

  const loadPagePortfolios = (pageNum, pageRows) => {
    if (pageRows !== 'all') {
      setPageStartNum((pageNum - 1) * pageRows)
      setPageEndNum(pageNum * pageRows - 1)
    } else {
      setPageStartNum(0)
      setPageEndNum(filteredPortfolios.length)
    }
  }
  const onShowColumnEditor = () => {
    dispatch(showColumnEditorAction())
  }
  const onShowTableFilter = () => {
    dispatch(showTableFilterAction())
  }
  const onChangeDateRange = (data) => {
    dispatch(
      setDateRange({
        startDate: data[0],
        endDate: data[1],
      })
    )
  }
  const sortColumn = (field) => {
    dispatch(sortPortfolioData(field))
  }

  listPortfolios.forEach(data => {
    let campaigns = topCampaigns.filter(p => p.portfolio_id === data.portfolio_id)

    data['daily_budget'] = 0
    data['revenue'] = 0
    data['clicks'] = 0
    data['cost'] = 0
    data['impressions'] = 0
    data['profit'] = 0
    data['orders'] = 0

    campaigns.forEach(c => {
      data['daily_budget'] += c['daily_budget']*1
      data['revenue'] += c['revenue']*1
      data['clicks'] += c['clicks']*1
      data['cost'] += c['cost']*1
      data['impressions'] += c['impressions']*1
      data['profit'] += c['profit']*1
      data['orders'] += c['orders']*1
    })

    data['ctr'] = data['impressions'] ? data['clicks'] / data['impressions'] * 100 : 0
    data['acos'] = data['revenue'] ? data['cost'] / data['revenue'] * 100 : 0
    data['cpc'] = data['clicks'] ? data['cost'] / data['clicks'] * 100 : 0
  })
  const onPortfolioExpanded = (id) => {
    const tmp = {...portfolioExpanded}
    tmp[id] = !tmp[id]

    setPortfolioExpanded(tmp)
  }

  const filteredPortfolios = listPortfolios.filter((data) => {
    let isFiltered = false

    if (!data['name'].toLowerCase().includes(searchKey.toLowerCase())) {
      isFiltered = true
    }
    if (portfolioFilters.dailyBudgetMin) {
      if (data['daily_budget']*1 < portfolioFilters.dailyBudgetMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.dailyBudgetMax) {
      if (data['daily_budget']*1 > portfolioFilters.dailyBudgetMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.impressionsMin) {
      if (data['impressions']*1 < portfolioFilters.impressionsMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.impressionsMax) {
      if (data['impressions']*1 > portfolioFilters.impressionsMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.salesMin) {
      if (data['revenue']*1 < portfolioFilters.salesMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.salesMax) {
      if (data['revenue']*1 > portfolioFilters.salesMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.cpcMin) {
      if (data['cpc']*1 < portfolioFilters.cpcMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.cpcMax) {
      if (data['cpc']*1 > portfolioFilters.cpcMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.ordersMin) {
      if (data['orders']*1 < portfolioFilters.ordersMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.ordersMax) {
      if (data['orders']*1 > portfolioFilters.ordersMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.spendMin) {
      if (data['cost']*1 < portfolioFilters.spendMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.spendMax) {
      if (data['cost']*1 > portfolioFilters.spendMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.clicksMin) {
      if (data['clicks']*1 < portfolioFilters.clicksMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.clicksMax) {
      if (data['clicks']*1 > portfolioFilters.clicksMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.ctrMin) {
      if (data['ctr']*1 < portfolioFilters.ctrMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.ctrMax) {
      if (data['ctr']*1 > portfolioFilters.ctrMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.acosMin) {
      if (data['acos'] < portfolioFilters.acosMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.acosMax) {
      if (data['acos'] > portfolioFilters.acosMax*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.roasMin) {
      if (data['roas']*1 < portfolioFilters.roasMin*1) {
        isFiltered = true
      }
    }
    if (portfolioFilters.roasMax) {
      if (data['roas']*1 > portfolioFilters.roasMax*1) {
        isFiltered = true
      }
    }

    return isFiltered === false
  })

  filteredPortfolios.sort(function (a, b) {
    if (sortDirection) {
      return b[sortColumnName] - a[sortColumnName]
    } else {
      return a[sortColumnName] - b[sortColumnName]
    }
  })
  const portfolioElements = filteredPortfolios.slice(pageStartNum, pageEndNum+1).map(function(data,ind) {
    const campaigns = topCampaigns.filter(p => p.portfolio_id === data.portfolio_id)

    return (
      <>
        <div className="table-row" key={ind} onClick={()=>onPortfolioExpanded(data.portfolio_id)}>
          <div className="table-col product-name">{data.name}</div>
          {portfolioTableColumns.includes('daily_budget') && <div className="table-col">{formatCurrency(data['daily_budget'], currencySign, currencyRate)}</div>}
          {portfolioTableColumns.includes('start_date') && <div className="table-col">No Date</div>}
          {portfolioTableColumns.includes('end_date') && <div className="table-col">No Date</div>}
          {portfolioTableColumns.includes('impression') && <div className="table-col">{formatValue(data['impressions'], 'number', 0)}</div>}
          {portfolioTableColumns.includes('clicks') && <div className="table-col">{formatValue(data['clicks'], 'number', 0)}</div>}
          {portfolioTableColumns.includes('ctr') && <div className="table-col">{formatValue(data['ctr'], 'number', 2)}</div>}
          {portfolioTableColumns.includes('spend') && <div className="table-col">{formatCurrency(data['cost'], currencySign, currencyRate)}</div>}
          {portfolioTableColumns.includes('cpc') && <div className="table-col">{formatCurrency(data['cpc'], currencySign, currencyRate)}</div>}
          {portfolioTableColumns.includes('orders') && <div className="table-col">{formatValue(data['orders'], 'number', 0)}</div>}
          {portfolioTableColumns.includes('sales') && <div className="table-col">{formatCurrency(data['revenue'], currencySign, currencyRate)}</div>}
          {portfolioTableColumns.includes('acos') && <div className="table-col">{formatValue(data['acos'], 'number')}</div>}
          {portfolioTableColumns.includes('roas') && <div className="table-col">0</div>}
          {portfolioTableColumns.includes('ntb-orders') && <div className="table-col">0</div>}
          {portfolioTableColumns.includes('ntb-orders-percent') && <div className="table-col">0</div>}
          {portfolioTableColumns.includes('ntb-sales') && <div className="table-col">0</div>}
          {portfolioTableColumns.includes('ntb-sales-percent') && <div className="table-col">0</div>}
          <div className="table-col"></div>
        </div>
        {portfolioExpanded[data.portfolio_id] && (
          campaigns.length ?
            campaigns.map(cData =>
              <div className="table-row sub-row">
                <div className="table-col product-name">{cData['campaign_name']}</div>
                {portfolioTableColumns.includes('daily_budget') && <div className="table-col">{formatCurrency(cData['daily_budget'], currencySign, currencyRate)}</div>}
                {portfolioTableColumns.includes('start_date') && <div className="table-col">No Date</div>}
                {portfolioTableColumns.includes('end_date') && <div className="table-col">No Date</div>}
                {portfolioTableColumns.includes('impression') && <div className="table-col">{formatValue(cData['impressions'], 'number', 0)}</div>}
                {portfolioTableColumns.includes('clicks') && <div className="table-col">{formatValue(cData['clicks'], 'number', 0)}</div>}
                {portfolioTableColumns.includes('ctr') && <div className="table-col">{formatValue(cData['ctr'], 'number', 2)}</div>}
                {portfolioTableColumns.includes('spend') && <div className="table-col">{formatCurrency(cData['cost'], currencySign, currencyRate)}</div>}
                {portfolioTableColumns.includes('cpc') && <div className="table-col">{formatCurrency(cData['cpc'], currencySign, currencyRate)}</div>}
                {portfolioTableColumns.includes('orders') && <div className="table-col">{formatValue(cData['orders'], 'number', 0)}</div>}
                {portfolioTableColumns.includes('sales') && <div className="table-col">{formatCurrency(cData['revenue'], currencySign, currencyRate)}</div>}
                {portfolioTableColumns.includes('acos') && <div className="table-col">{formatValue(cData['acos'], 'number')}</div>}
                {portfolioTableColumns.includes('roas') && <div className="table-col">0</div>}
                {portfolioTableColumns.includes('ntb-orders') && <div className="table-col">0</div>}
                {portfolioTableColumns.includes('ntb-orders-percent') && <div className="table-col">0</div>}
                {portfolioTableColumns.includes('ntb-sales') && <div className="table-col">0</div>}
                {portfolioTableColumns.includes('ntb-sales-percent') && <div className="table-col">0</div>}
                <div className="table-col"></div>
              </div>
            )
            :
            <div className="table-row sub-row">
              <div className="table-col product-name">No Data</div>
            </div>
          )
        }
      </>
    )
  })

  return (
    <div className="portfolio-table-component">
      { showColumnEditor && <EditTableColumnComponent columns={columns} /> }
      { showTableFilter && <EditTableFilterComponent />}
      <div className="table-header">
        <div className="table-header-left">
          <SearchSvg />
          <input className="table-header-search" placeholder="Type to search" value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
          <DateRangeComponent
            onChange = {onChangeDateRange}
            value = {[startDate, endDate]}
          />
        </div>
        <div className="table-header-right">
          <FilterSvg onClick={onShowTableFilter} />
          <ColumnSvg onClick={onShowColumnEditor} />
        </div>
      </div>
      <div className="table-body">
        <div className={isSticky ? "table-row content-header sticky" : "table-row content-header"} ref={headerRef}>
          <div className="table-col product-name">Portfolio</div>
          {portfolioTableColumns.includes('daily_budget') && <div className="table-col" onClick={()=>sortColumn('daily_budget')}>Daily Budget</div>}
          {portfolioTableColumns.includes('start_date') && <div className="table-col" onClick={()=>sortColumn('start_date')}>Start Date</div>}
          {portfolioTableColumns.includes('end_date') && <div className="table-col" onClick={()=>sortColumn('end_date')}>End Date</div>}
          {portfolioTableColumns.includes('impression') && <div className="table-col" onClick={()=>sortColumn('impressions')}>Impr.</div>}
          {portfolioTableColumns.includes('clicks') && <div className="table-col" onClick={()=>sortColumn('clicks')}>Clicks</div>}
          {portfolioTableColumns.includes('ctr') && <div className="table-col" onClick={()=>sortColumn('ctr')}>CTR %</div>}
          {portfolioTableColumns.includes('spend') && <div className="table-col" onClick={()=>sortColumn('cost')}>Spend</div>}
          {portfolioTableColumns.includes('cpc') && <div className="table-col" onClick={()=>sortColumn('cpc')}>CPC</div>}
          {portfolioTableColumns.includes('orders') && <div className="table-col" onClick={()=>sortColumn('orders')}>Orders</div>}
          {portfolioTableColumns.includes('sales') && <div className="table-col" onClick={()=>sortColumn('revenue')}>Sales</div>}
          {portfolioTableColumns.includes('acos') && <div className="table-col" onClick={()=>sortColumn('acos')}>ACoS</div>}
          {portfolioTableColumns.includes('roas') && <div className="table-col" onClick={()=>sortColumn('roas')}>ROAS</div>}
          {portfolioTableColumns.includes('ntb-orders') && <div className="table-col" onClick={()=>sortColumn('btn-orders')}>NTB Orders</div>}
          {portfolioTableColumns.includes('ntb-orders-percent') && <div className="table-col" onClick={()=>sortColumn('btn-orders-percent')}>NTB Orders %</div>}
          {portfolioTableColumns.includes('ntb-sales') && <div className="table-col" onClick={()=>sortColumn('ntb-sales')}>NTB Sales</div>}
          {portfolioTableColumns.includes('ntb-sales-percent') && <div className="table-col" onClick={()=>sortColumn('ntb-sales-percent')}>NTB Sales Percent</div>}
          <div className="table-col"></div>
        </div>
        {
          portfolioElements
        }
      </div>
      <PaginationComponent
        total={filteredPortfolios.length}
        loadData={loadPagePortfolios}
      />
    </div>
  );
}

export default PortfolioTableComponent
