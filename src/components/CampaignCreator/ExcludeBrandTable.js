import React from 'react'

import CustomTable from '../CommonComponents/CustomTableComponent'

const ExcludeBrandTable = ({ brands, negativeTargetings, onSearch, onChange }) => {
  const handleExclude = (brand) => {
    const duplicate = negativeTargetings.filter(target => target.type === 'brand')
      .find(target => target.id === brand.id)

    if (duplicate) {
      return
    }

    onChange([
      {
        ...brand,
        isTargeted: true,
        type: 'brand',
      },
      ...negativeTargetings,
    ])
  }

  const renderBrand = brand => (
    <>
      <div className="table-col col-brand">
        { brand.name }
      </div>
      <div className="table-col">
        {
          brand.isTargeted ? (
            <button type="button" className="btn btn-blue disabled">Excluded</button>
          ) : (
            <button type="button" className="btn btn-blue" onClick={() => { handleExclude(brand) }}>
              Exclude
            </button>
          )
        }
      </div>
    </>
  )

  return (
    <CustomTable
      className="table-brands"
      records={brands}
      noCheckBox
      idField="id"
      searchFields={['name']}
      paginationSelectPlacement="top"
      renderRecord={renderBrand}
      onSearch={onSearch}
    >
      <div className="table-col col-brand">Brand</div>
      <div className="table-col">
      </div>
    </CustomTable>
  )
}

export default ExcludeBrandTable
