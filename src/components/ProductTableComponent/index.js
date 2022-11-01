/*global chrome*/
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from "react-router-dom"
import { Toggle, Radio, Tooltip, Whisper, Dropdown } from 'rsuite'
import moment from 'moment'

import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'
import { ReactComponent as FilterSvg } from '../../assets/svg/filter.svg'
import { ReactComponent as ColumnSvg } from '../../assets/svg/columns.svg'
import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as EyeSvg } from '../../assets/svg/eye.svg'
import ImgBlueArrowRight from '../../assets/img/blue-right.png'
import ImgBlueArrowDown from '../../assets/img/blue-down.png'
import ImgLock from '../../assets/img/lock.png'

import {
  setDateRange,
  updateBulkCogs,
} from '../../redux/actions/product'

import {
  formatCurrency,
  formatValue,
} from '../../services/helper'

import { toast } from '../CommonComponents/ToastComponent/toast'
import ImportFileContent from '../CommonComponents/ImportFileContent'
import PaginationComponent from '../CommonComponents/PaginationComponent'
import DateRangeComponent from '../CommonComponents/DateRangeComponent'

import EditTableColumnComponent from './edit-column'
import EditTableFilterComponent from './edit-filter'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { showColumnEditorAction, showTableFilterAction } from '../../redux/actions/pageGlobal'
import { sortProductData, loadAllProductsData, updateProductCog, disableNotification, getProductKeywords } from '../../redux/actions/product'

import { EXTENSION_ID } from '../../utils/constants/defaultValues'

const ProductTableComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const { product, header, pageGlobal } = store.getState()
  const { currencyRate, currencySign } = header
  const { allSkusWithProfit, sortColumnName, sortDirection, startDate, endDate, isLoading, isUpdateProductCog, isUpdateProductCogSucceed, isLoadingProductKeywords, productKeywords } = product
  const { showColumnEditor, showTableFilter, productTableColumns, productFilters } = pageGlobal

  const [searchKey, setSearchKey] = useState('')
  const [pageStartNum, setPageStartNum] = useState(0)
  const [pageEndNum, setPageEndNum] = useState(10)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [fileImportBtnName, setFileImportBtnName] = useState('Upload Bulk COGS')
  const [changedCogId, setChangedCogId] = useState(0)
  const [changedCogValue, setChangedCogValue] = useState('')
  const [productExpanded, setProductExpanded] = useState()
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)
  const [exportCogCSV, setExportCogCSV] = useState('')
  const headerRef = useRef(null)
  const footerRef = useRef(null)
  const [isSticky, setIsSticky] = useState(false)
  const [topPos, setTopPos] = useState(0)

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(EXTENSION_ID, { type: 'checkIfExtensionInstalled' }, function (response) {
        if (chrome.runtime.lastError) {
          return
        }
        if (response && response.success === true) {
          setIsExtensionInstalled(true)
        }
      });
    }
    setCogDownloadContent()
  })
  const setCogDownloadContent = () => {
    let data = [
      ['SKU', 'COG'],
      ['Light-gray99', 10],
      ['4th-refil', 3],
    ]

    let csvContent = "data:text/csv;charset=utf-8,"
    data.forEach((row, index) => {
      const dataString = row.join(',')
      csvContent += index < data.length ? dataString + '\n' : dataString
    })
    setExportCogCSV(csvContent)
  }

  useEffect(() => {
    if (isUpdateProductCogSucceed) {
      toast.show({
        title: 'Success',
        description: 'COG Updated Successfully!',
      })
      dispatch(disableNotification())
      setChangedCogId(0)
      setChangedCogValue('')
    }
  }, [dispatch, isUpdateProductCogSucceed])

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
    footerRef.current.style.top = `${topPos + headerRef.current.clientHeight}px`
  }, [isSticky, topPos])

  const handleImportFile = () => {
    setShowFileUpload(true)
  }

  const loadUploadedFileContent = (data, fileName) => {
    let results = []
    const products = data.split(/\n/)
    if (products.length > 300) {
      toast.show({
        title: 'Warning',
        description: 'Only 300 rows are allowed at once'
      })
      return
    }
    results = products.map(product => product.split(','))
    const header = results.shift()
    const skuIndex = header.findIndex(col => col.toLowerCase().trim() === 'sku')
    const cogIndex = header.findIndex(col => col.toLowerCase().trim() === 'cog')
    if (skuIndex === -1 || cogIndex === -1) {
      toast.show({
        title: 'Danger',
        description: `Unable to detect the csv headers. Please make sure you have the both ('sku' and 'cog') headers in your file.`,
      })
      return
    }
    const invalidSkus = []
    let successfulSkus = {}
    const insertValues = []
    results.forEach(result => {
      const sku = result[skuIndex]
      const cog = parseFloat(result[cogIndex])
      if (isNaN(cog)) {
        invalidSkus.push({
          sku,
          reason: 'Invalid value for COG.',
        })
      } else if (allSkusWithProfit.findIndex(skuWithProfit => skuWithProfit.sku === sku) === -1) {
        invalidSkus.push({
          sku,
          reason: 'Skus was not found.',
        })
      } else if (successfulSkus[sku] && successfulSkus[sku] !== cog) {
        invalidSkus.push({
          sku,
          reason: 'SKU has duplicate entries and the last value by the order is saved as final one. Please fix it and upload again if you don’t agree.',
        })
      } else {
        successfulSkus[sku] = cog
        insertValues.push({
          sku,
          cog,
        })
      }
    })
    if (insertValues.length === 0) {
      toast.show({
        title: 'Danger',
        description: 'There were no valid items in csv file',
      })
      return
    }
    dispatch(
      updateBulkCogs({
        skus: insertValues,
      })
    )
    setFileImportBtnName(fileName)
    setShowFileUpload(false)
  }

  const hideFileUpload = () => {
    setShowFileUpload(false)
  }

  const columns = [
    {
      name: 'product',
      label: 'Product'
    },
    {
      name: 'cog',
      label: 'Cost of Goods'
    },
    {
      name: 'margin',
      label: 'Profit Margin'
    },
    {
      name: 'cpa',
      label: 'Break Even CPA'
    },
    {
      name: 'click-order',
      label: 'Clicks/Orders'
    },
    {
      name: 'max-cpc',
      label: 'Max CPC'
    },
    {
      name: 'avg-7',
      label: '7 Day Avg'
    },
    {
      name: 'avg-30',
      label: '30 Day Avg'
    },
    {
      name: 'avg-60',
      label: '60 Day Avg'
    },
    {
      name: 'active',
      label: 'Active Campaigns'
    },
    {
      name: 'sales',
      label: 'Total Sales'
    },
    {
      name: 'organic-sales',
      label: 'Organic/PPC Sales'
    },
    {
      name: 'organic-sales-ratio',
      label: 'Organic/PPC ratio'
    },
    {
      name: 'ad-spend-margin-impact',
      label: 'Ad Spend Margin Impact'
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
      name: 'orders',
      label: 'Orders'
    },
    {
      name: 'acos',
      label: 'ACoS'
    }
  ]

  let totalSum = {
    organic: 0,
    spend: 0,
    clicks: 0,
    orders: 0,
    revenue: 0,
    weekly: 0,
    monthly: 0,
    twomonthly: 0,
    max_cpc: 0,
    ctr: 0,
    acos: 0,
    roas: 0,
    active_campaigns: 0,
    cog: 0,
    margin: 0,
    cpa: 0,
    clicks_order_ratio: 0
  }

  useEffect(() => {
    loadAllProductsData({startDate, endDate})
  }, [startDate, endDate])

  const handleProductDetail = (id, sku) => {
    history.push(`/dashboard/product/${id}/${sku}`)
  }

  const loadPageTopProducts = (pageNum, pageRows) => {
    if (pageRows !== 'all') {
      setPageStartNum((pageNum - 1) * pageRows)
      setPageEndNum(pageNum * pageRows - 1)
    } else {
      setPageStartNum(0)
      setPageEndNum(products.length)
    }
  }

  const handleChangeDateRange = (val) => {
    dispatch(
      setDateRange({
        startDate: val[0],
        endDate: val[1]
      })
    )
  }
  const onShowColumnEditor = () => {
    dispatch(showColumnEditorAction())
  }
  const onShowTableFilter = () => {
    dispatch(showTableFilterAction())
  }
  const handleOpenAmazon = (url) => {
    window.open(url)
  }
  const sortColumn = (field) => {
    dispatch(sortProductData(field))
  }
  const onChangeCog = (e, data) => {
    setChangedCogId(data['id'])
    setChangedCogValue(e.target.value)
  }
  const onSaveCogUpdate = (data) => {
    dispatch(updateProductCog({
      cog: changedCogValue,
      product: data
    }))
  }
  const onCancelCogUpdate = () => {
    setChangedCogId(0)
    setChangedCogValue('')
  }
  const onExpandProduct = (id, sku) => {
    setProductExpanded(id)
    dispatch(getProductKeywords({id, sku }))
  }
  const onCollapseProduct = (id) => {
    setProductExpanded()
  }
  const products = allSkusWithProfit.filter((data) => {
    let isFiltered = false

    if (!data['product-name'].toLowerCase().includes(searchKey.toLowerCase())) {
      isFiltered = true
    }
    if (productFilters.cogMin) {
      if (data['cog']*1 < productFilters.cogMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.cogMax) {
      if (data['cog']*1 > productFilters.cogMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.profitMarginMin) {
      if (data['profit_margin']*1 < productFilters.profitMarginMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.profitMarginMax) {
      if (data['profit_margin']*1 > productFilters.profitMarginMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.cpaMin) {
      if (data['break_even_cpa']*1 < productFilters.cpaMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.cpaMax) {
      if (data['break_even_cpa']*1 > productFilters.cpaMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.ordersMin) {
      if (data['orders']*1 < productFilters.ordersMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.ordersMax) {
      if (data['orders']*1 > productFilters.ordersMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.spendMin) {
      if (data['cost']*1 < productFilters.spendMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.spendMax) {
      if (data['cost']*1 > productFilters.spendMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.clicksMin) {
      if (data['total_clicks']*1 < productFilters.clicksMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.clicksMax) {
      if (data['total_clicks']*1 > productFilters.clicksMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.ctrMin) {
      if (data['ctr']*100 < productFilters.ctrMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.ctrMax) {
      if (data['ctr']*100 > productFilters.ctrMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.acosMin) {
      if ((data.revenue ? data.cost/data.revenue*100 : 0) < productFilters.acosMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.acosMax) {
      if ((data.revenue ? data.cost/data.revenue*100 : 0) > productFilters.acosMax*1) {
        isFiltered = true
      }
    }
    if (productFilters.roasMin) {
      if (data['roas']*1 < productFilters.roasMin*1) {
        isFiltered = true
      }
    }
    if (productFilters.roasMax) {
      if (data['roas']*1 > productFilters.roasMax*1) {
        isFiltered = true
      }
    }

    return isFiltered === false
  })

  products.forEach(product => {
    product['acos'] = product.revenue ? product.cost/product.revenue*100 : 0
    totalSum.organic += product['organicrevenue'] ? product['organicrevenue'] : 0
    totalSum.spend += product['cost'] ? product['cost'] : 0
    totalSum.clicks += product['total_clicks'] ? product['total_clicks'] * 1 : 0
    totalSum.orders += product['orders'] ? product['orders'] * 1 : 0
    totalSum.revenue += product['revenue'] ? product['revenue'] * 1 : 0
    totalSum.weekly += product['weeklyorders'] ? product['weeklyorders'] * 1 : 0
    totalSum.monthly += product['monthlyorders'] ? product['monthlyorders'] * 1 : 0
    totalSum.twomonthly += product['twomonthlyorders'] ? product['twomonthlyorders'] * 1 : 0
    totalSum.max_cpc += product['max_cpc'] ? product['max_cpc'] * 1 : 0
    totalSum.ctr += product['ctr'] ? product['ctr'] * 1 : 0
    totalSum.acos += product['acos'] ? product['acos'] * 1 : 0
    totalSum.roas += product['roas'] ? product['roas'] * 1 : 0
    totalSum.active_campaigns += product['active_campaigns'] ? product['active_campaigns'] * 1 : 0
    totalSum.cog += product['cog'] ? product['cog'] * 1 : 0
    totalSum.margin += product['margin'] ? product['margin'] * 1 : 0
    totalSum.cpa += product['cpa'] ? product['cpa'] * 1 : 0
    totalSum.clicks_order_ratio += product['clicks_order_ratio'] ? product['clicks_order_ratio'] * 1 : 0
  })
  products.sort(function (a, b) {
    if (sortDirection) {
      return b[sortColumnName] - a[sortColumnName]
    } else {
      return a[sortColumnName] - b[sortColumnName]
    }
  })

  const productElements = products.slice(pageStartNum, pageEndNum+1).map((data) => (
      <React.Fragment key={data.id}>
        <div className="table-row">
          <div className="table-col product-name">
            <img src={data.image_sm} alt={data.product} />
            <div>
              {data['abtest_status'] === 'running' ?
                <span className="test-on">A/B Test On</span>
                :
                <span className="test-off">A/B Test Off</span>
              }
              <button type="button" onClick={ ()=>handleProductDetail(data['id'], data['sku']) }>{ data['product-name'] }</button>
              <div className="row">
                <span>{data['asin']}</span>
                {productExpanded === data.id ?
                  <img src={ImgBlueArrowDown} alt={data.id} onClick={()=>onCollapseProduct(data.id)} />
                  :
                  <img src={ImgBlueArrowRight} alt={data.id} onClick={()=>onExpandProduct(data.id, data.sku)} />
                }
              </div>
            </div>
          </div>
          {productTableColumns.includes('cog') && <div className="table-col">
            {changedCogId === data['id'] ?
              <>
                <input type="number" value={ changedCogValue } onChange={ (e)=>onChangeCog(e, data) }/>
                <div className="cog-btn-container">
                  <button type="button" onClick={ ()=>onSaveCogUpdate(data) }>Save</button>
                  <button type="button" onClick={ onCancelCogUpdate }>Cancel</button>
                </div>
              </>
              :
              <input type="number" value={ data.cog } onChange={ (e)=>onChangeCog(e, data) }/>
            }
          </div>}
          {productTableColumns.includes('margin') && <div className="table-col">{ formatValue(data.profit_margin, 'number') }</div>}
          {productTableColumns.includes('cpa') && <div className="table-col">{ formatValue(data.break_even_cpa, 'number') }</div>}
          {productTableColumns.includes('click-order') && <div className="table-col">{ formatValue(data.clicks_order_ratio, 'number', 0) }</div>}
          {productTableColumns.includes('max-cpc') && <div className="table-col">{ formatValue(data.max_cpc, 'number', 2) }</div>}
          {productTableColumns.includes('avg-7') && <div className="table-col">{ formatValue(data.weeklyorders, 'number', 0) }</div>}
          {productTableColumns.includes('avg-30') && <div className="table-col">{ formatValue(data.monthlyorders, 'number', 0) }</div>}
          {productTableColumns.includes('avg-60') && <div className="table-col">{ formatValue(data.twomonthlyorders, 'number', 0) }</div>}
          {productTableColumns.includes('active') && <div className="table-col">{ formatValue(data.active_campaigns, 'number', 0) }</div>}
          {productTableColumns.includes('sales') && <div className="table-col">{formatCurrency(data.revenue, currencySign, currencyRate)}</div>}
          {
            productTableColumns.includes('organic-sales') && (
              <div className="table-col organic-sales">
                <span>
                  { formatCurrency(data.totalSales, currencySign, currencyRate) }
                </span>
                <span>
                  { formatCurrency(data.ppcSales, currencySign, currencyRate) }
                </span>
              </div>
            )
          }
          {
            productTableColumns.includes('organic-sales-ratio') && (
              <div className="table-col organic-sales-ratio">
                <span>
                  { formatValue(data.totalSales + data.ppcSales ? data.totalSales / (data.totalSales + data.ppcSales) * 100 : 0, 'percent') }
                </span>
                <span>
                  { formatValue(data.totalSales + data.ppcSales ? data.ppcSales / (data.totalSales + data.ppcSales) * 100 : 0, 'percent') }
                </span>
              </div>
            )
          }
          {productTableColumns.includes('ad-spend-margin-impact') && <div className="table-col ad-spend-margin">{formatValue(data.totalSales + data.ppcSales ? data.cost / (data.totalSales + data.ppcSales) * 100 : 0, 'percent')}</div>}
          {productTableColumns.includes('clicks') && <div className="table-col">{formatValue(data.total_clicks, 'number', 0)}</div>}
          {productTableColumns.includes('ctr') && <div className="table-col">{formatValue(data.ctr*100, 'percent')}</div>}
          {productTableColumns.includes('spend') && <div className="table-col">{formatCurrency(data.cost, currencySign, currencyRate)}</div>}
          {productTableColumns.includes('orders') && <div className="table-col">{formatValue(data.orders, 'number', 0)}</div>}
          {productTableColumns.includes('acos') && <div className="table-col">{formatValue(data.acos, 'number')}</div>}
          <div className="table-col">
            <Dropdown title="..." noCaret placement="leftEnd">
              <Dropdown.Item onClick={()=>handleProductDetail(data['id'], data['sku'])}>View Dashboard</Dropdown.Item>
              <Dropdown.Item onClick={()=>handleOpenAmazon(data['url'])}>Open in Amazon</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        {productExpanded === data.id && (
          <div className="product-detail">
            <div className="keyword-row keyword-header">
              <div className="keyword-col">Keyword</div>
              <div className="keyword-col">Organic Rank</div>
              <div className="keyword-col">Rank Change</div>
              <div className="keyword-col">Spend</div>
              <div className="keyword-col">Impressions</div>
              <div className="keyword-col">Number Of Orders</div>
              <div className="keyword-col">Max CPC</div>
              <div className="keyword-col">Started Tracking On</div>
            </div>
            {productKeywords.length ?
              productKeywords.map((keyword)=> (
                <div className="keyword-row" key={keyword.keyword}>
                  <div className="keyword-col">{keyword['keyword']}</div>
                  <div className="keyword-col">
                    {isExtensionInstalled ?
                      <Toggle checked={keyword['auto_organic_rank_checking'] ? true:false} />
                      :
                      <Whisper
                        trigger="hover"
                        placement="auto"
                        speaker={
                          <Tooltip>
                            Install the 'PPC Entourage Chrome Extension' to enable product rank tracking
                            property
                          </Tooltip>
                        }
                      >
                        <img alt={keyword['keyword']} src={ImgLock} />
                      </Whisper>
                    }
                  </div>
                  <div className="keyword-col">
                    {isExtensionInstalled ?
                      <Radio checked={keyword['indexing_last_check_date'] ? true:false} />
                      :
                      <Whisper
                        trigger="hover"
                        placement="auto"
                        speaker={
                          <Tooltip>
                            Install the 'PPC Entourage Chrome Extension' to see and check the indexing statuses
                            property
                          </Tooltip>
                        }
                      >
                        <img alt={keyword['keyword']} src={ImgLock} />
                      </Whisper>
                    }
                  </div>
                  <div className="keyword-col">{formatCurrency(keyword['cost'], currencySign, currencyRate)}</div>
                  <div className="keyword-col">{formatValue(keyword['impressions'], 'number', 0)}</div>
                  <div className="keyword-col">{formatValue(keyword['orders'], 'number', 0)}</div>
                  <div className="keyword-col">{formatValue(keyword['max_cpc'], 'number')}</div>
                  <div className="keyword-col">{keyword['started_tracking_on'] ? moment(keyword['started_tracking_on']).format('YYYY-MM-DD') : ''}</div>
                </div>
              ))
              :
              <div className="keyword-no-data">
                {isLoadingProductKeywords && <LoaderComponent />}
                No Data
              </div>
            }
          </div>
        )}
      </React.Fragment>
    )
  )

  const productCountWithClicks = products.length && products.filter(product => product.total_clicks).length

  return (
    <div className={`product-table-component${(isLoading || isUpdateProductCog) ? ' loading' : ''}`}>
      { (isLoading || isUpdateProductCog) && <LoaderComponent />}
      { showColumnEditor && <EditTableColumnComponent columns={columns} /> }
      { showTableFilter && <EditTableFilterComponent />}
      <div className="table-header">
        <div className="table-header-left">
          <SearchSvg />
          <input type="text" className="table-header-search" placeholder="Type to search..." value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
          <DateRangeComponent
            onChange = {handleChangeDateRange}
            value = {[startDate, endDate]}
          />
          <button type="button" className="btn btn-green btn-upload" onClick={ handleImportFile }>{fileImportBtnName}</button>
          <ImportFileContent
            showFileUpload = { showFileUpload }
            loadData = { loadUploadedFileContent }
            hideFileUpload = { hideFileUpload }
          />
          <Whisper placement="right" trigger="hover" speaker={(
              <Tooltip>
                Please click on this icon to download the template csv file of cogs.
              </Tooltip>
            )}>
            <a className="download-cog-csv" href={encodeURI(exportCogCSV)} download="cog.csv">
              <EyeSvg />
            </a>
          </Whisper>
        </div>
        <div className="table-header-right">
          <FilterSvg onClick={onShowTableFilter} />
          <ColumnSvg onClick={onShowColumnEditor} />
        </div>
      </div>
      <div className="table-body">
        <div className={isSticky ? "table-row content-header sticky" : "table-row content-header"} ref={headerRef}>
          <div className="table-col product-name" onClick={()=>sortColumn('product-name')}>Product</div>
          {productTableColumns.includes('cog') && <div className="table-col" onClick={()=>sortColumn('cog')}>Cost of Goods</div>}
          {productTableColumns.includes('margin') && <div className="table-col" onClick={()=>sortColumn('profit_margin')}>Profit Margin</div>}
          {
            productTableColumns.includes('cpa') && (
              <div className="table-col" onClick={()=>sortColumn('break_even_cpa')}>
                Break Even CPA
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    Break Even Cost per Acquisition is the amount of money you can spend to get a sale while still breaking even.
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {
            productTableColumns.includes('click-order') && (
              <div className="table-col" onClick={()=>sortColumn('clicks_order_ratio')}>
                Clicks / Orders
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    This measures how many clicks it takes on average to get an order.
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {
            productTableColumns.includes('max-cpc') && (
              <div className="table-col" onClick={()=>sortColumn('max_cpc')}>
                Max CPC
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    The maximum one can spend per click to break even with PPC. Takes into account the products profit margins and the average amount of clicks to get an order.
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {
            productTableColumns.includes('avg-7') && (
              <div className="table-col" onClick={()=>sortColumn('weeklyorders')}>
                7 Day Avg.
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    Advertising only 7 day average (does not include SB/SBV)
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {
            productTableColumns.includes('avg-30') && (
              <div className="table-col" onClick={()=>sortColumn('monthlyorders')}>
                30 Day Avg
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    Advertising only 30 day average (does not include SB//SBV)
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {
            productTableColumns.includes('avg-60') && (
              <div className="table-col" onClick={()=>sortColumn('twomonthlyorders')}>
                60 Day Avg
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    Advertising only 60 day average (does not include SB/SBV)
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {productTableColumns.includes('active') && <div className="table-col" onClick={()=>sortColumn('active_campaigns')}>Active Campaigns</div>}
          {productTableColumns.includes('sales') && <div className="table-col" onClick={()=>sortColumn('revenue')}>Total Sales</div>}
          {
            productTableColumns.includes('organic-sales') && (
              <div className="table-col organic-sales" onClick={()=>sortColumn('totalSales')}>
                <span>
                  Organic
                </span>
                <span>
                  PPC Sales
                </span>
              </div>
            )
          }
          {
            productTableColumns.includes('organic-sales-ratio') && (
              <div className="table-col organic-sales-ratio" onClick={()=>sortColumn('totalSales')}>
                <span>
                  Sales Ratio %
                </span>
                <span>
                  Organic/PPC
                </span>
              </div>
            )
          }
          {
            productTableColumns.includes('ad-spend-margin-impact') && (
              <div className="table-col ad-spend-margin" onClick={()=>sortColumn('totalSales')}>
                Ad Spend<br/> Margin Impact
                <Whisper placement="right" trigger="hover" speaker={(
                  <Tooltip>
                    Also known as TACOS.  The amount of margin impact that your ad dollars are having on this products profitability. (does not include SB//SBV ad spend)
                  </Tooltip>
                )}>
                  <InfoSvg />
                </Whisper>
              </div>
            )
          }
          {productTableColumns.includes('clicks') && <div className="table-col" onClick={()=>sortColumn('total_clicks')}>Clicks</div>}
          {productTableColumns.includes('ctr') && <div className="table-col" onClick={()=>sortColumn('ctr')}>CTR</div>}
          {productTableColumns.includes('spend') && <div className="table-col" onClick={()=>sortColumn('cost')}>Spend</div>}
          {productTableColumns.includes('orders') && <div className="table-col" onClick={()=>sortColumn('orders')}>Orders</div>}
          {productTableColumns.includes('acos') && <div className="table-col" onClick={()=>sortColumn('acos')}>ACoS</div>}
          <div className="table-col"></div>
        </div>
        <div className={isSticky ? "table-row content-footer sticky" : "table-row content-footer"} ref={footerRef}>
          <div className="table-col">Totals :</div>
          {productTableColumns.includes('cog') && <div className="table-col"></div>}
          {productTableColumns.includes('margin') && <div className="table-col"></div>}
          {productTableColumns.includes('cpa') && <div className="table-col"></div>}
          {productTableColumns.includes('click-order') && <div className="table-col">{formatValue(productCountWithClicks ? totalSum.clicks_order_ratio / productCountWithClicks : 0, 'number')}</div>}
          {productTableColumns.includes('max-cpc') && <div className="table-col">{formatValue(productCountWithClicks ? totalSum.max_cpc / productCountWithClicks : 0, 'number')}</div>}
          {productTableColumns.includes('avg-7') && <div className="table-col"></div>}
          {productTableColumns.includes('avg-30') && <div className="table-col"></div>}
          {productTableColumns.includes('avg-60') && <div className="table-col"></div>}
          {productTableColumns.includes('active') && <div className="table-col"></div>}
          {productTableColumns.includes('sales') && <div className="table-col">{formatCurrency(totalSum.revenue, currencySign, currencyRate)}</div>}
          {productTableColumns.includes('organic-sales') && <div className="table-col organic-sales"></div>}
          {productTableColumns.includes('organic-sales-ratio') && <div className="table-col organic-sales-ratio"></div>}
          {productTableColumns.includes('ad-spend-margin-impact') && <div className="table-col ad-spend-margin"></div>}
          {productTableColumns.includes('clicks') && <div className="table-col">{formatValue(totalSum.clicks, 'number', 0) }</div>}
          {productTableColumns.includes('ctr') && <div className="table-col">{formatValue(productCountWithClicks ? totalSum.ctr / productCountWithClicks : 0, 'number')}</div>}
          {productTableColumns.includes('spend') && <div className="table-col">{formatCurrency(totalSum.spend, currencySign, currencyRate)}</div>}
          {productTableColumns.includes('orders') && <div className="table-col">{formatValue(totalSum.orders, 'number', 0) }</div>}
          {productTableColumns.includes('acos') && <div className="table-col">{formatValue(productCountWithClicks ? totalSum.acos / productCountWithClicks : 0, 'number')}</div>}
          <div className="table-col"></div>
        </div>
        {
          productElements
        }
      </div>
      <PaginationComponent
        total={products.length}
        loadData={loadPageTopProducts}
      />
    </div>
  );
}

export default ProductTableComponent
