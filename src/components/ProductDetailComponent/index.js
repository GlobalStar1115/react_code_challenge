import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import OutsideClickHandler from 'react-outside-click-handler'
import { Tooltip, Whisper } from 'rsuite'

import ProductDashboardComponent from './dashboard'
import ProductKeywordComponent from './keyword'
import ProductTestingComponent from './testing'
import ProductFilterComponent from './product-filter'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import { toast } from '../CommonComponents/ToastComponent/toast'

import { ReactComponent as ArrowDownSvg } from '../../assets/svg/arrow-down.svg'
import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'
import { ReactComponent as ChromeLogo } from '../../assets/svg/chrome-logo.svg'

import { getProductById, updateProductMargin, disableNotification } from '../../redux/actions/product'

import {
  formatValue
} from '../../services/helper'

const ProductDetailComponent = () => {
  const store = useStore()
  const dispatch = useDispatch()
  const params = useParams()

  const { header, product, productDetail } = store.getState()

  const {
    currentStartDate,
    currentEndDate,
  } = header

  const {
    isProductLoading,
    isProductKpiLoading,
    isUpdateProductMargin,
    isUpdateProductMarginSucceed,
    curProduct,
    curProductKpi
  } = product

  const { isFiltering, isUpdatingKeyword } = productDetail
  const [ currentTab, setCurrentTab ] = useState('dashboard')
  const [ showProductFilter, setShowProductFilter ] = useState(false)
  const [ productCog, setProductCog ] = useState(0)

  useEffect(() => {
    if (!curProduct || !curProduct['cog']) {
      return
    }
    setProductCog(formatValue(curProduct['cog'], 'number'))
  }, [dispatch, curProduct])

  useEffect(() => {
    if (isUpdateProductMarginSucceed) {
      toast.show({
        title: 'Success',
        description: 'COG Updated Successfully!',
      })
      dispatch(disableNotification())
    }
  }, [dispatch, isUpdateProductMarginSucceed])

  useEffect(() => {
    const { id, sku } = params
    dispatch(getProductById({
      id,
      sku,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
    }))

    const ele = document.getElementsByClassName('main-content')[0]
    ele.scrollTo({
      top: 0,
      left: 0
    })
  }, []) // eslint-disable-line

  const handleChangeTab = (tab) => {
    setCurrentTab(tab)
  }
  const handleOpenAmazon = () => {
    window.open(curProduct.url)
  }
  const onShowProductFilter = () => {
    setShowProductFilter(true)
  }
  const onOutsideClick = () => {
    setShowProductFilter(false)
  }
  const onDownload = () => {
    window.open("https://chrome.google.com/webstore/detail/ppc-entourage-kw-index-ch/cclbjbpflgdponoegbmgkcicpjjdikci")
  }
  const onUpdateAcos = () => {
    dispatch(updateProductMargin(productCog))
  }

  return (
    <div className={ isProductLoading || isProductKpiLoading || isFiltering || isUpdateProductMargin || isUpdatingKeyword ? "product-detail-component loading" : "product-detail-component"}>
      { (isProductLoading || isProductKpiLoading || isFiltering || isUpdatingKeyword) && <LoaderComponent /> }
      <div className="page-header">
        { showProductFilter &&
          <OutsideClickHandler onOutsideClick={onOutsideClick}>
            <ProductFilterComponent onClose={()=>setShowProductFilter(false)} />
          </OutsideClickHandler>
        }
        <div className="page-title" onClick={ onShowProductFilter }>
          <img src={ curProduct['image_sm'] } alt={ curProduct['product-name'] }/>
          <span>{ curProduct['product-name'] }</span>
          <ArrowDownSvg />
        </div>
        <div className="page-header-buttons">
          <button type="button" className="page-header-button-custom" onClick={ handleOpenAmazon }>Open in Amazon</button>
        </div>
      </div>
      <div className="page-tabs">
        <div className="tab-left">
          <button type="button" className={ currentTab === 'dashboard' ? "page-tab selected" : "page-tab" } onClick={ () => handleChangeTab('dashboard') }>Dashboard</button>
          <button type="button" className={ currentTab === 'keyword' ? "page-tab selected" : "page-tab" } onClick={ () => handleChangeTab('keyword') }>Keyword Tracking</button>
          <button type="button" className={ currentTab === 'testing' ? "page-tab selected" : "page-tab" } onClick={ () => handleChangeTab('testing') }>A/B Split Testing</button>
        </div>
        <div className="tab-right">
          <button type="button" className="btn-download" onClick={onDownload}>
            <ChromeLogo />Download Chrome Extension
          </button>
          <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                Download and install the PPC Entourage Chrome Extension to check your keywords indexing and track keyword ranking.
              </Tooltip>
            )}>
            <InfoSvg />
          </Whisper>
        </div>
      </div>
      { currentTab === 'dashboard' &&
        <ProductDashboardComponent
          curProductKpi = { curProductKpi }
          curProduct = { curProductKpi }
          productCog = { productCog }
          setProductCog = { setProductCog }
          isProductLoading = { isProductLoading }
          isProductKpiLoading = { isProductKpiLoading }
          onUpdateAcos = { onUpdateAcos }
        />
      }
      { currentTab === 'keyword' &&
        <ProductKeywordComponent />
      }
      { currentTab === 'testing' &&
        <ProductTestingComponent />
      }
    </div>
  );
}

export default ProductDetailComponent
