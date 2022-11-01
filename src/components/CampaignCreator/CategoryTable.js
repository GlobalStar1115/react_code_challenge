import React, { useState } from 'react'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CustomTable from '../CommonComponents/CustomTableComponent'
import RefineModal from './RefineModal'

const CategoryTable = ({ actionLabel = 'Target', isLoading, categories, targetings, onTarget, onTargetAll, onRefine }) => {
  const [openRefineModal, setOpenRefineModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)

  const handleRefine = (category) => {
    setCurrentCategory(category)
    setOpenRefineModal(true)
  }

  const renderCategory = (category) => {
    const isExisting = targetings
      .filter(item => (item.type === 'category' || item.type === 'refine'))
      .find(item => item.id === category.id)
    return (
      <>
        <div className="table-col col-category">
          <div className="category-path" title={category.path}>
            { category.path }
          </div>
          { category.name }
        </div>
        <div className="table-col">
          {
            isExisting ? (
              <button type="button" className="btn btn-blue disabled">
                { actionLabel }ed
              </button>
            ) : (
              <button type="button" className="btn btn-blue" onClick={() => { onTarget(category) }}>
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

  return (
    <div className="category-table-container">
      { isLoading && <LoaderComponent /> }
      <CustomTable
        className="table-categories"
        records={categories}
        noCheckBox
        idField="id"
        searchFields={['name']}
        paginationSelectPlacement="top"
        paginationNeighbours={1}
        renderRecord={renderCategory}
      >
        <div className="table-col col-category">Suggested Category</div>
        <div className="table-col">
          <button type="button" className="btn btn-red" onClick={onTargetAll}>
            { actionLabel } All
          </button>
        </div>
      </CustomTable>
      <RefineModal
        show={openRefineModal}
        category={currentCategory}
        onRefine={onRefine}
        onClose={() => { setOpenRefineModal(false) }}
      />
    </div>
  )
}

export default CategoryTable
