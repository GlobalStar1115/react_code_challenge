import React, { useEffect, useState, useMemo } from 'react'
import moment from 'moment'
import Select from 'react-select'
//--assets
import { ReactComponent as SearchSvg } from '../../../assets/svg/search.svg'
import { ReactComponent as HistorySvg } from '../../../assets/svg/history.svg'
import { ReactComponent as FilterSvg } from '../../../assets/svg/filter.svg'
import { ReactComponent as ColumnSvg } from '../../../assets/svg/columns.svg'
import { ReactComponent as MoreDotSvg } from '../../../assets/svg/more-dots.svg'

// components
import PaginationComponent from '../PaginationComponent'
import DateRangeComponent from '../DateRangeComponent'
import CheckboxComponent from '../CheckboxComponent'

// heler
import {
  formatValue,
} from '../../../services/helper'

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = items ? [...items] : []
    if (sortConfig !== null) {
      if (sortConfig.dataType === 'number' || sortConfig.dataType === 'bool') {
        sortableItems.sort((a, b) => {
          if (parseFloat(formatValue(a[sortConfig.key])) - parseFloat(formatValue(b[sortConfig.key])) < 0)
            return sortConfig.direction === 'asc' ? -1 : 1

          if (parseFloat(formatValue(a[sortConfig.key])) - parseFloat(formatValue(b[sortConfig.key])) > 0)
            return sortConfig.direction === 'asc' ? 1 : -1

          return 0
        })
      } else if (sortConfig.dataType === 'string') {
        sortableItems.sort((a, b) => {
          if ( a[sortConfig.key].toUpperCase() < b[sortConfig.key].toUpperCase()) {
            return sortConfig.direction === 'asc' ? -1 : 1
          }
          if (a[sortConfig.key].toUpperCase() > b[sortConfig.key].toUpperCase()) {
            return sortConfig.direction === 'asc' ? 1 : -1
          }
          return 0
        })
      } else {
        sortableItems.sort((a, b) => sortConfig.direction === 'asc' ? a - b : b - a)
      }
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = (column) => {
      const key = column.value
      const { dataType } = column
      let direction = 'desc'
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'desc'
      ) {
        direction = 'asc'
      }
      setSortConfig({ key, direction, dataType })
  }

  return { items: sortedItems, requestSort, sortConfig, setSortConfig };

}
const TableComponent = (props) => {
  const {
    fields,
    rows,
    totals,
    sum,
    startDate,
    endDate,
    showCheckColumn,
    showSearch,
    showCopy,
    showExport,
    showDateRange,
    showTotal,
    showHistory,
    showFilter,
    ShowColumnCustomizer,
    showMore,
    showTools,
    showColumns,
    hideHeaderCheckColumn,
    enableRowClick,
    onClickRow,
    onClickCol,
    checkHandle,
    checkAll,
    pageRows,
    onChangeDateRange,
    onChangeSearchText,
    onChangeCol,
    onCopyData,
    exportContent,
    exportName,
  } = props

  const [ currentStartDate, setCurrentStartDate ] = useState(moment().startOf('day').subtract(29, 'day').toDate())
  const [ currentEndDate, setCurrentEndDate ] = useState(moment().endOf('day').toDate())

  const [ pageStartNum, setPageStartNum ] = useState(0)
  const [ pageEndNum, setPageEndNum ] = useState(10)

  const { items, requestSort, sortConfig, setSortConfig } = useSortableData(rows)

  useEffect(() => {
    if (!fields || fields.length === 0) {
      return
    }
    const primarySortField = fields.find(field => field.sort && field.primarySort)
    if (primarySortField) {
      setSortConfig({
        key: primarySortField.value,
        direction: 'desc',
        dataType: primarySortField.dataType,
      })
    }
    // eslint-disable-next-line
  }, [fields])
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
        return ''
    }
    return sortConfig.key === name ? sortConfig.direction : ''
  }
  const getClassNameForCol = (field) => {
    let strClassName = 'table-col'
    if (field.width) {
      strClassName += ` table-col-width-${field.width}`
    }
    if (field.flex) {
      strClassName += ` table-col-flex-${field.flex}`
    }
    if (field.click) {
      strClassName += ' click'
    }
    if (field.type === 'select') {
      strClassName += ' select'
    }
    return strClassName
  }

  const loadTablePageData = ( pageNum, pageRow ) => {
    setPageStartNum((pageNum - 1) * pageRow)
    setPageEndNum(pageNum * pageRow)
  }

  const onChangeChb = ( val, data ) => {
    checkHandle && checkHandle(val, data)
  }

  const onChangeAllCheck = (val) => {
    checkAll && checkAll(val, items)
  }
  const handleChangeSearchText = (text) => {
    if (!onChangeSearchText) {
      return
    }
    onChangeSearchText(text)
  }
  const handleChangeDateRange = (val) => {
    setCurrentStartDate(val[0])
    setCurrentEndDate(val[1])
    onChangeDateRange({
      startDate: val[0],
      endDate: val[1],
    })
  }
  const handleClickRow = (e, data) => {
    if (!enableRowClick) {
      return
    }
    // if target is button, input or other tags
    if (e.target.tagName !== 'DIV') {
      return
    }
    if (!e.target.className.includes('table-row') && !e.target.className.includes('table-col')) {
      return
    }
    onClickRow && onClickRow(data)
  }
  const handleChangeCol = (data, val, field) => {
    onChangeCol && onChangeCol(data, val, field)
  }
  const handleClickCol = (field, data) => {
    if (!field.click) {
      return
    }
    onClickCol && onClickCol(field, data)
  }
  useEffect(() => {
    if (!startDate || !endDate) {
      return
    }
    setCurrentStartDate(startDate)
    setCurrentEndDate(endDate)
  }, [startDate, endDate])

  const headerElements = fields && fields.map((data, ind) => {
    let className = 'table-col'
    if (data.width) {
      className += ` table-col-width-${data.width}`
    }
    if (data.flex) {
      className += ` table-col-flex-${data.flex}`
    }
    if (data.sort) {
      className += ' ' + getClassNamesFor(data.value)
    }
    if (data.sort) {
      return (
        <div
          className={className}
          key={ind}
          onClick={() => { requestSort(data) }}
        >
          { data['label'] }
        </div>
      )
    }
    return (
      <div
        className={className}
        key={ind}
      >
        { data['label'] }
      </div>
    )
  })

  const bodyElements = items && items.length> 0 && items.slice(pageStartNum, pageEndNum).map((data, ind) => (
    <div
      className={data.className ? `table-row ${data.className}` : `table-row`}
      key={ind}
      onClick={e => { handleClickRow(e, data) }}
    >
      {
        showCheckColumn && (
          <div className="table-col check-col">
            <CheckboxComponent
              checked={data.checked ? data.checked : false}
              onChange={val => onChangeChb(val, data)}
            />
          </div>
        )
      }
      {
        fields && fields.map((field, i) => {
          const colClassName = getClassNameForCol(field)
          if (field['type'] === 'image') {
            return (
              <img
                className={colClassName}
                alt={data[field['value']]}
                src={data[field['value']]}
                key={i}
                onClick={() => { handleClickCol(field, data) }}
              />
            )
          } else if (field['type'] === 'select') {
            return (
              <div
                className={colClassName}
                key={i}
              >
                <Select
                  options={field.options}
                  value={field.options.find(option => option.value === data[field['value']])}
                  onChange={val => { handleChangeCol(data, val, field) }}
                />
              </div>
            )
          } else {
            return (
              <div
                className={colClassName}
                key={i}
              >
                {data[field['value']]}
              </div>
            )
          }
        })
      }
      {
        showMore && (
          <div className="table-col">
            <MoreDotSvg />
          </div>
        )
      }
    </div>
  ))

  return (
    <div className="table">
      {
        showTools &&
          <div className="table-header">
            <div className="table-header-left">
              {
                showSearch && (
                  <div className="flex align-center search-tool">
                    <SearchSvg />
                    <input type="text" className="table-header-search" placeholder="Type to search" onChange={e => { handleChangeSearchText(e.target.value) }}/>
                  </div>
                )
              }
              {
                showCopy && (
                  <div className="copy-tool">
                    <button type="button" className="btn btn-white btn-copy" onClick={() => { onCopyData() }}>Copy to Clipboard</button>
                  </div>
                )
              }
              {
                showExport && (
                  <div className="export-tool">
                    <a href={encodeURI(exportContent)} download={exportName ? exportName : 'download.csv'} className="btn btn-red btn-export">
                      Export
                    </a>
                  </div>
                )
              }
              {
                showDateRange && (
                  <DateRangeComponent
                    onChange={handleChangeDateRange}
                    value={[currentStartDate, currentEndDate]}
                  />
              )
              }
            </div>
            <div className="table-header-right">
              { showHistory && <HistorySvg />}
              { showFilter && <FilterSvg />}
              { ShowColumnCustomizer && <ColumnSvg />}
            </div>
          </div>
      }

      <div className="table-body">
        {
          showColumns &&
            <div className="table-row content-header">
              {
                showCheckColumn && (
                  !hideHeaderCheckColumn ? (
                    <div className="table-col check-col">
                      <CheckboxComponent
                        checked={rows && rows.length > 0 ? rows.length === rows.filter(row => row.checked).length : false}
                        onChange={val => { onChangeAllCheck(val) }}
                      />
                    </div>
                  ) : (
                    <div className="table-col check-col">
                    </div>
                  )
                )
              }
              { headerElements }
              { showMore && <div className="table-col"></div> }
            </div>
        }
        { bodyElements }
      </div>
      <div className="table-footer">
        {
          showTotal && (
            <div className="table-row content-footer">
              <div className="table-col">Totals : {totals}</div>
              {
                fields && fields.map((field, ind) => (
                  <div className={getClassNameForCol(field)} key={ind}>
                    { sum && sum[field['value']] ? sum[field['value']] : '' }
                  </div>
                ))
              }
              {
                showMore && <div className="table-col"></div>
              }
            </div>
          )
        }
      </div>
      {
        items && items.length > 0 && (
          <PaginationComponent
            total={items.length}
            loadData={loadTablePageData}
            pageNeighbours={1}
            pageRows={pageRows ? pageRows : 10}
          />
        )
      }
    </div>
  )
}

export default TableComponent