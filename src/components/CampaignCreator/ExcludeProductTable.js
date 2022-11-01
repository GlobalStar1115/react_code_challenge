import React from 'react'

import CustomTable from '../CommonComponents/CustomTableComponent'

const ExcludeProductTable = ({ products, negativeTargetings, onSearch, onChange }) => {
  const handleExclude = (product) => {
    const duplicate = negativeTargetings.filter(target => target.type === 'product')
      .find(target => target.ASIN === product.ASIN)

    if (duplicate) {
      return
    }

    onChange([
      {
        ...product,
        isTargeted: true,
        type: 'product',
      },
      ...negativeTargetings,
    ])
  }

  const renderProduct = product => (
    <>
      <div className="table-col col-product">
        <img src={product.SmallImage.URL} alt={product.name} />
        <div className="product-info">
          <div className="product-name" title={product.name}>
            { product.name }
          </div>
          <div className="product-asin-info">
            ASIN: { product.ASIN }
          </div>
        </div>
      </div>
      <div className="table-col">
        {
          product.isTargeted ? (
            <button type="button" className="btn btn-blue disabled">Excluded</button>
          ) : (
            <button type="button" className="btn btn-blue" onClick={() => { handleExclude(product) }}>
              Exclude
            </button>
          )
        }
      </div>
    </>
  )

  return (
    <CustomTable
      className="table-products"
      records={products}
      noCheckBox
      idField="ASIN"
      searchFields={['name', 'ASIN']}
      paginationSelectPlacement="top"
      renderRecord={renderProduct}
      onSearch={onSearch}
    >
      <div className="table-col col-product">Product</div>
      <div className="table-col">
      </div>
    </CustomTable>
  )
}

export default ExcludeProductTable
