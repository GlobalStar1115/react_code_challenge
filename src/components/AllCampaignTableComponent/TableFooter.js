import React, { useEffect, useRef, useState } from 'react'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const TableFooter = ({ columns, campaignTableColumns, total, campaignCount, currencySign, currencyRate }) => {
  const [isSticky, setIsSticky] = useState(false)
  const [topPos, setTopPos] = useState(0)
  const totalRef = useRef(null)
  const handleScroll = () => {
    setIsSticky(false)
    if (totalRef.current) {
      const { top } = totalRef.current.getBoundingClientRect()
      if (top <= 0) {
        setIsSticky(true)
        setTopPos(totalRef.current.clientHeight - top)
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
    totalRef.current.style.top = `${topPos}px`
  }, [isSticky, topPos])

  return (
    <div className={isSticky ? "table-row content-footer sticky" : "table-row content-footer"} ref={totalRef}>
      <div className="table-col"></div>
      <div className="table-col">Totals:</div>
      {
        columns.map((column) => {
          if (column.name === 'campaign' || !campaignTableColumns.includes(column.name)) {
            return null
          }

          let value = null
          switch (column.name) {
            case 'cost':
              value = formatCurrency(total.spend, currencySign, currencyRate, 0)
              break
            case 'impressions':
              value = formatValue(total.imp, 'number', 0)
              break
            case 'clicks':
              value = formatValue(total.clicks, 'number', 0)
              break
            case 'ctr':
              value = formatValue(total.imp ? total.clicks / total.imp * 100 : 0, 'number')
              break
            case 'cpc':
              value = formatValue(total.clicks ? total.spend / total.clicks : 0, 'number')
              break
            case 'orders':
              value = formatValue(total.orders, 'number', 0)
              break
            case 'revenue':
              value = formatCurrency(total.revenue, currencySign, currencyRate, 2)
              break
            case 'acos':
              value = formatValue(total.revenue ? total.spend / total.revenue * 100 : 0, 'number', 1)
              break
            case 'roas':
              value = formatValue(total.spend ? total.revenue / total.spend : 0, 'number')
              break
            case 'conversion':
              value = formatValue(total.clicks ? total.orders / total.clicks * 100 : 0, 'number')
              break
            case 'ntb_orders':
              value = formatValue(total.ntbOrders, 'number', 0)
              break
            case 'ntb_orders_percent':
              value = formatValue(total.orders ? total.ntbOrders / total.orders * 100 : 0, 'number')
              break
            case 'ntb_sales':
              value = formatValue(total.ntbSales, 'number')
              break
            case 'ntb_sales_percent':
              value = formatValue(total.revenue ? total.ntbSales / total.revenue * 100 : 0, 'number')
              break
            default:
              break
          }

          return (
            <div key={column.name} className="table-col">
              { value }
            </div>
          )
        })
      }
      <div className="table-col"></div>
    </div>
  )
}
export default TableFooter
