import React, { useEffect, useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

import { getAllCampaigns } from '../../redux/actions/campaign'

const ExSkuSelector = (props) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    product: { allProducts, isAllProductLoading, productsByKeyword, isProductsByKeywordLoading, },
    auth: { token },
  } = store.getState()

  const { handleChangeSkus, tab } = props
  const [ selectedSkus, setSelectedSkus ] = useState([])
  const [ showSelector, setShowSelector ] = useState(false)
  const [ skuData, setSkuData ] = useState([])

  // show customized sku select box
  const handleClickShowSelector = () => {
    setShowSelector(!showSelector)
  }

  // Load All Campaigns with selected SKUs
  const loadCampaigns = ( skus ) => {
    handleChangeSkus(skus)
    const skuData = {
      SKU: skus.length > 0 ? skus.map(sku => sku.sku) : [],
      user: 238,
      token,
    }
    dispatch(getAllCampaigns({ skuData, token }))
  }

  // select sku table row
  const checkHandle = (checked, data) => {
    let newSelectedSkus = selectedSkus
    if (checked) {
      newSelectedSkus = [...newSelectedSkus, data]
    } else {
      newSelectedSkus = newSelectedSkus.filter(item => item.id !== data.id)
    }
    setSelectedSkus( newSelectedSkus )
    loadCampaigns(newSelectedSkus)
  }

  // Select all skus
  const checkAll = (checked, data) => {
    let newSelectedSkus = []
    if (checked) {
      newSelectedSkus = [...data]
    }
    setSelectedSkus( newSelectedSkus )
    loadCampaigns(newSelectedSkus)
  }

  // Load ALl products
  useEffect(() => {
    if (tab === 'keyword-search-keyword') {
      const productsSkuList = productsByKeyword && productsByKeyword.length > 0 ? productsByKeyword.map(product => product.sku) : []
      const newProducts = productsSkuList.length > 0 && allProducts && allProducts.length > 0 ? allProducts.filter(product=> productsSkuList.includes(product.sku)) : []
      newProducts && newProducts.length > 0 ? setSkuData(newProducts.map(product => (
        {
          ...product,
          checked: selectedSkus && selectedSkus.length > 0 ? selectedSkus.filter(selectedSku => selectedSku.id === product.id).length > 0 : false
        }
      ))) : setSkuData([])
    } else {
      allProducts && allProducts.length > 0 ? setSkuData(allProducts.map(product => (
        {
          ...product,
          checked: selectedSkus && selectedSkus.length > 0 ? selectedSkus.filter(selectedSku => selectedSku.id === product.id).length > 0 : false
        }
      ))) : setSkuData([])
    }
  }, [allProducts, productsByKeyword, selectedSkus, tab])

  // Ad group table fields
  const fields = [
    { label: 'SKU', value: 'sku', flex: '2' },
    { label: 'Image', value: 'image_sm', type: 'image' },
    { label: 'Product name', value: 'product-name', flex: '3' },
  ]

  return (
    <div className="selector-parent">
      <button type="button" onClick={ handleClickShowSelector }>Choose Skus</button>
      {
        showSelector &&
          <div className={ (tab !== 'keyword-search-keyword' && isAllProductLoading) || (tab === 'keyword-search-keyword' && isProductsByKeywordLoading) ? "selector-container loading" : "selector-container"}>
            { ((tab !== 'keyword-search-keyword' && isAllProductLoading) || (tab === 'keyword-search-keyword' && isProductsByKeywordLoading)) && <LoaderComponent /> }
            <div className="content">
              <div className="table-section">
                <TableComponent
                  fields={ fields }
                  rows={ skuData }
                  totals={[]}
                  showColumns
                  showTools
                  checkHandle={ checkHandle }
                  checkAll={ checkAll }
                  pageRows={5}
                  showCheckColumn
                  showSearch
                  showTotal
                />
              </div>
            </div>
          </div>
      }
    </div>
  );
}
export default ExSkuSelector