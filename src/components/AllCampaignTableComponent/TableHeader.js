import React, { useEffect, useRef, useState } from 'react'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'

const TableHeader = ({ columns, campaignTableColumns, selectedCampaigns, filteredCampaigns, onSelect, onSort }) => {
  const [isSticky, setIsSticky] = useState(false)
  const [topPos, setTopPos] = useState(0)
  const headerRef = useRef(null)
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

  return (
    <div className={isSticky ? "table-row content-header sticky" : "table-row content-header"} ref={headerRef}>
      <div className="table-col">
        <CheckboxComponent
          checked={selectedCampaigns.length > 0 && selectedCampaigns.length === filteredCampaigns.length}
          onChange={(checked) => { onSelect(checked ? filteredCampaigns : []) }}
        />
      </div>
      <div className="table-col" onClick={() => { onSort('campaign') }}>
        Campaign
      </div>
      {
        columns.map((column) => {
          if (column.name === 'campaign' || !campaignTableColumns.includes(column.name)) {
            return null
          }

          return (
            <div key={column.name} className="table-col" onClick={() => { onSort(column.name) }}>
              { column.shortLabel || column.label }
            </div>
          )
        })
      }
      <div className="table-col"></div>
    </div>
  )
}

export default TableHeader
