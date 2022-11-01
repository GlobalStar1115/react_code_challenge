import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const options = [
  { value: '5', label: '5', },
  { value: '10', label: '10', },
  { value: '25', label: '25', },
  { value: '50', label: '50', },
  { value: '100', label: '100', },
  { value: 'all', label: 'All', },
]

const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

const PaginationComponent = (props) => {
  const { total, loadData, pageNeighbours = 2, pageRows: defaultPageRows = 10,
    selectPlacement = "bottom" } = props

  const [pageRows, setPageRows] = useState(defaultPageRows)
  const [pageNumber, setPageNumber] = useState(1)

  useEffect(() => {
    loadData && loadData(pageNumber, pageRows)
  }, [pageNumber, pageRows]) // eslint-disable-line

  const totalPages = Math.ceil(total / pageRows)

  const range = (from, to, step = 1) => {
    let i = from
    const range = []

    while (i <= to) {
      range.push(i)
      i += step
    }

    return range
  }

  const gotoPage = page => {
    const currentPage = Math.max(0, Math.min(page, totalPages))
    setPageNumber(currentPage)
  }

  const handleClick = page => {
    gotoPage(page)
  }

  const handlePrevious = () => {
    gotoPage(pageNumber - (pageNeighbours * 2) - 1)
  }

  const handleNext = () => {
    gotoPage(pageNumber + (pageNeighbours * 2) + 1)
  }

  const changePageRows = (item) => {
    setPageRows(item.value)
  }

  const renderElements = () => {
    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = (pageNeighbours * 2) + 3
    const totalBlocks = totalNumbers + 2

    let liPages = range(1, totalPages)

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, pageNumber - pageNeighbours)
      const endPage = Math.min(totalPages - 1, pageNumber + pageNeighbours)
      let pages = range(startPage, endPage)

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */

      const hasLeftSpill = startPage > 2
      const hasRightSpill = (totalPages - endPage) > 1
      const spillOffset = totalNumbers - (pages.length + 1)

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case (hasLeftSpill && !hasRightSpill): {
          const extraPages = range(startPage - spillOffset, startPage - 1)
          pages = [LEFT_PAGE, ...extraPages, ...pages]
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case (!hasLeftSpill && hasRightSpill): {
          const extraPages = range(endPage + 1, endPage + spillOffset)
          pages = [...pages, ...extraPages, RIGHT_PAGE]
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case (hasLeftSpill && hasRightSpill):
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE]
          break;
        }
      }

      liPages = [1, ...pages, totalPages]
    }

    return (
      liPages.map((page, index) => {
        if (page === LEFT_PAGE) {
          return (
            <li key={index} className="page-item">
              <button type="button" className="page-link" aria-label="Previous" onClick={() => { handlePrevious() }}>
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </button>
            </li>
          )
        }

        if (page === RIGHT_PAGE) {
          return (
            <li key={index} className="page-item">
              <button type="button" className="page-link" aria-label="Next" onClick={() => { handleNext() }}>
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </button>
            </li>
          )
        }

        return (
          <li key={index} className={`page-item${ pageNumber === page ? ' active' : ''}`}>
            <button type="button" className="page-link" onClick={() => { handleClick(page) }}>
              { page }
            </button>
          </li>
        )
      })
    )
  }

  let startNumber = 1
  if (pageRows !== 'all') {
    startNumber = pageNumber * pageRows - pageRows + 1
  }

  return (
    <div className="table-pagination">
      <div className="pagination-left">
        <span>
          { startNumber } to { pageNumber < totalPages ? pageNumber * pageRows : total }
          &nbsp;of total { total } items
        </span>
      </div>
      <div className="pagination-right">
        <ul>
          { renderElements() }
        </ul>
        <Select
          classNamePrefix="select-pagination-pages"
          defaultValue={{ value:pageRows, label: pageRows }}
          menuPlacement={selectPlacement}
          options={options}
          onChange={changePageRows}
        />
      </div>
    </div>
  )
}

export default PaginationComponent
