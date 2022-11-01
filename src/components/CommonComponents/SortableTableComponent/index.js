import React, { useState, useMemo } from 'react'
import { BsCaretUpFill, BsCaretDownFill } from 'react-icons/bs'

import CustomTable from '../CustomTableComponent'

const ORDER_ASC = 'asc'
const ORDER_DESC = 'desc'

const SortableTableComponent = ({ columns, defaultSort, sorter, records, ...props }) => {
  const [sortOption, setSortOption] = useState(defaultSort)

  const handleSort = (column) => {
    if (column.sortable === false) {
      return
    }
    setSortOption([column.key, sortBy === column.key && sortOrder === ORDER_ASC ? ORDER_DESC : ORDER_ASC])
  }

  // eslint-disable-next-line
  const sortedRecords = useMemo(() => sorter(records, sortOption), [records, sortOption])

  const [sortBy, sortOrder] = sortOption
  return (
    <CustomTable
      {...props}
      records={sortedRecords}
    >
      {
        columns.map(column => (
          <div
            key={column.key}
            className={`table-col${column.className ? ` ${column.className}` : ''}`}
            onClick={() => { handleSort(column) }}
          >
            { column.name }
            {
              sortBy === column.key && (
                sortOrder === ORDER_ASC ? <BsCaretUpFill /> : <BsCaretDownFill />
              )
            }
          </div>
        ))
      }
    </CustomTable>
  )
}

export default SortableTableComponent
