import React, { useState, useEffect, useRef } from 'react'

import PaginationComponent from '../PaginationComponent'
import CheckboxComponent from '../CheckboxComponent'

import { ReactComponent as SearchSvg } from '../../../assets/svg/search.svg'

const DEFAULT_PAGE_SIZE = 10

const CustomTable = (props) => {
  const { className = '', records, selectedRecords = [], idField, searchFields,
    paginationSelectPlacement = "bottom", paginationNeighbours = 2,
    noCheckBox = false, noSearch = false, hasSticky = false,
    renderRecord, renderTopRight, onChange = () => {}, onSearch = null, children } = props

  const [keyword, setKeyword] = useState('')
  const [filteredRecords, setFilteredRecords] = useState(records)
  const [pageStart, setPageStart] = useState(0)
  const [pageEnd, setPageEnd] = useState(DEFAULT_PAGE_SIZE)
  const [stickyOffset, setStickyOffset] = useState(null)

  const refBody = useRef(null)
  const refHeader = useRef(null)

  useEffect(() => {
    setFilteredRecords(records)
  }, [records])

  useEffect(() => {
    if (hasSticky) {
      const mainContent = document.querySelector('.main-content')
      mainContent.addEventListener('scroll', handleScroll)

      return () => {
        mainContent.removeEventListener('scroll', () => handleScroll)
      }
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (stickyOffset === null) {
      return
    }
    refHeader.current.style.top = `${stickyOffset}px`
  }, [stickyOffset])

  // Listen for scroll event on main contents area.
  const handleScroll = () => {
    if (refBody.current) {
      const { top } = refBody.current.getBoundingClientRect()
      if (top < 0) {
        setStickyOffset(-top)
        return
      }
    }
    setStickyOffset(null)
  }

  const onRecordCheck = record => (checked) => {
    const newList = [...selectedRecords]
    if (checked) {
      newList.push(record[idField])
    } else {
      newList.splice(newList.indexOf(record[idField]), 1)
    }
    onChange(newList)
  }

  const onCheckAll = (checked) => {
    if (checked) {
      onChange(filteredRecords.map(record => record[idField]))
    } else {
      onChange([])
    }
  }

  const handleKeywordPress = (event) => {
    if (event.key === 'Enter') {
      if (onSearch) {
        onSearch(keyword)
        return
      }

      if (keyword === '') {
        setFilteredRecords(records)
      } else {
        const lowerCased = keyword.toLowerCase()
        setFilteredRecords(records.filter(record => (
          searchFields.find(field => (
            record[field].toLowerCase().indexOf(lowerCased) !== -1
          ))
        )))
      }

      // Un-check when searching.
      onChange([])

      setPageStart(0)
      setPageEnd(DEFAULT_PAGE_SIZE)
    }
  }

  const loadData = (pageNum, pageRows) => {
    if (pageRows !== 'all') {
      setPageStart((pageNum - 1) * pageRows)
      setPageEnd(pageNum * pageRows - 1)
    } else {
      setPageStart(0)
      setPageEnd(filteredRecords.length)
    }
  }

  const renderRecords = () => {
    if (!filteredRecords.length) {
      return (
        <div className="table-row">
          No records found.
        </div>
      )
    }

    return filteredRecords.slice(pageStart, pageEnd).map((record) => {
      const checked = selectedRecords.indexOf(record[idField]) !== -1
      return (
        <div key={record[idField]} className={`table-row${record.className ? ` ${record.className}` : ''}`}>
          {
            !noCheckBox && (
              <div className="table-col col-check">
                <CheckboxComponent
                  checked={checked}
                  onChange={onRecordCheck(record)}
                />
              </div>
            )
          }
          { renderRecord(record, checked) }
        </div>
      )
    })
  }

  return (
    <div className={className}>
      {
        (!noSearch || renderTopRight) && (
          <div className="table-header">
            {
              !noSearch && (
                <div className="table-header-left">
                  <SearchSvg />
                  <input
                    type="text"
                    className="table-header-search"
                    placeholder="Type to search"
                    value={keyword}
                    onChange={(event) => { setKeyword(event.target.value) }}
                    onKeyPress={handleKeywordPress}
                  />
                </div>
              )
            }
            {
              renderTopRight && (
                <div className="table-header-right">
                  { renderTopRight() }
                </div>
              )
            }
          </div>
        )
      }
      <div className={`table-body${stickyOffset !== null ? ' sticky' : ''}`} ref={refBody}>
        <div className="table-row content-header" ref={refHeader}>
          {
            !noCheckBox && (
              <div className="table-col col-check">
                <CheckboxComponent
                  checked={selectedRecords.length === filteredRecords.length && selectedRecords.length !== 0}
                  onChange={onCheckAll}
                />
              </div>
            )
          }
          { children }
        </div>
        { renderRecords() }
      </div>
      <PaginationComponent
        selectPlacement={paginationSelectPlacement}
        pageNeighbours={paginationNeighbours}
        total={filteredRecords.length}
        loadData={loadData}
      />
    </div>
  )
}

export default CustomTable
