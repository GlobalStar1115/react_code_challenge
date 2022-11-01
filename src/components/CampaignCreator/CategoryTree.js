import React, { useState } from 'react'

import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import TreeComponent from '../CommonComponents/TreeComponent'
import CustomTable from '../CommonComponents/CustomTableComponent'
import RefineModal from './RefineModal'

const CategoryTree = ({ actionLabel = 'Target', isLoading, categories, targetings, onTarget, onTargetSearch, onRefine }) => {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [openRefineModal, setOpenRefineModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)

  const getCategoryByName = (categories, parentPath = null) => {
    let results = []
    const keywordLowerCased = keyword.toLowerCase()
    categories.forEach((category) => {
      category = {
        ...category,
        path: parentPath != null ? parentPath : category.na,
      }

      if (category.ch.length) {
        results = [
          ...results,
          ...(getCategoryByName(category.ch, parentPath !== null ? `${category.path}/${category.na}` : category.na))
        ]
      }

      if (category.na.toLowerCase().indexOf(keywordLowerCased) !== -1) {
        results.push(category)
      }
    })
    return results
  }

  const handleKeywordPress = (event) => {
    if (event.key !== 'Enter' || keyword === '') {
      return
    }

    setSearchResults(getCategoryByName(categories))
  }

  const handleRefine = (category) => {
    setCurrentCategory(category)
    setOpenRefineModal(true)
  }

  const renderCategory = (category) => {
    const isExisting = targetings.filter(item => item.type !== 'product').find(item => item.id === category.id)
    return (
      <>
        <div className="table-col col-category">
          <div className="category-path" title={category.path}>
            { category.path }
          </div>
          { category.na }
        </div>
        <div className="table-col">
          {
            isExisting ? (
              <button type="button" className="btn btn-blue disabled">
                { actionLabel }ed
              </button>
            ) : (
              <button type="button" className="btn btn-blue" onClick={() => { onTargetSearch(category) }}>
                { actionLabel }
              </button>
            )
          }
          <button type="button" className="btn btn-green" onClick={() => { handleRefine(category) }}>
            Refine
          </button>
        </div>
      </>
    )
  }

  const renderCategories = () => {
    if (keyword !== '' && searchResults.length) {
      return (
        <CustomTable
          className="table-categories"
          records={searchResults}
          noCheckBox
          noSearch
          idField="id"
          paginationSelectPlacement="top"
          paginationNeighbours={1}
          renderRecord={renderCategory}
        >
          <div className="table-col col-category">Category</div>
          <div className="table-col">
          </div>
        </CustomTable>
      )
    }
    return (
      <TreeComponent
        actionLabel={actionLabel}
        nodes={categories}
        nodesTargeted={targetings}
        onTarget={onTarget}
        onRefine={handleRefine}
      />
    )
  }

  return (
    <div className={`category-tree-container${isLoading ? ' loading' : ''}`}>
      { isLoading && <LoaderComponent /> }
      <div className="search-box-wrapper">
        <SearchSvg />
        <input
          type="text"
          placeholder="Type to search"
          value={keyword}
          onChange={(event) => { setKeyword(event.target.value) }}
          onKeyPress={handleKeywordPress}
        />
      </div>
      { renderCategories() }
      <RefineModal
        show={openRefineModal}
        category={currentCategory}
        onRefine={onRefine}
        onClose={() => { setOpenRefineModal(false) }}
      />
    </div>
  )
}

export default CategoryTree
