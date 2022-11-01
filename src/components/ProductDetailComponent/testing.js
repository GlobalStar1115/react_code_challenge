import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import ProductTestingDetailComponent from './testing-detail'
import ProductTestingAddComponent from './testing-add'

import { getTestById, getTestStatsById } from '../../redux/actions/productDetail'

const ProductTestingComponent = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const { product, productDetail, header } = store.getState()
  const { currentUserId } = header
  const { tests, isAddingNewTest } = productDetail
  const { curProduct } = product

  const [ showAddModal, setShowAddModal ] = useState(false)
  const [ showDetailModal, setShowDetailModal ] = useState(false)
  const [ currentTest, setCurrentTest ] = useState({})
  const [ searchKey, setSearchKey ] = useState('')

  const testElements = tests.map((data) => {
    if (!data['name'].toLowerCase().includes(searchKey.toLowerCase())) {
      return (<></>)
    }
    const subClass = data['green'] ? 'green' : (data['yellow'] ? 'yellow' : '')

    return (
      <div className={"table-row " + subClass} onClick={ () => onDetailTest(data) }>
        <div className="table-col">{data['name']}</div>
        <div className="table-col">{moment(data['from_date']).format('YYYY-MM-DD')}</div>
        <div className="table-col">{moment(data['to_date']).format('YYYY-MM-DD')}</div>
      </div>
    )
  })

  const onAddTest = () => {
    setShowAddModal(true)
  }

  const onDetailTest = (test) => {
    const startDate = moment(test['from_date']).format('YYYY-MM-DD')
    const endDate = moment(test['to_date']).format('YYYY-MM-DD')
    const period = moment(endDate).diff(startDate, 'days')
    const prevStartDate = moment(startDate).subtract(period, 'days').format('YYYY-MM-DD');

    dispatch(getTestById(test['id'], currentUserId))
    dispatch(getTestStatsById(
      curProduct['id'],
      currentUserId,
      startDate,
      endDate,
      prevStartDate))
    setCurrentTest(test)
    setShowDetailModal(true)
  }

  const onHideAddModal = () => {
    setShowAddModal(false)
  }
  const onHideDetailModal = () => {
    setShowDetailModal(false)
  }

  return (
    <div className={`product-detail-testing ${isAddingNewTest ? 'loading' : ''}`}>
      {isAddingNewTest &&
        <LoaderComponent />
      }
      {showAddModal &&
        <ProductTestingAddComponent onClose={ onHideAddModal } />
      }
      {showDetailModal &&
        <ProductTestingDetailComponent test={currentTest} onClose={ onHideDetailModal } />
      }
      <div className="testing-header">
        <span>Click on add A/B test to start. You will then name your test, select the length (in days) of your test, and enter the before and after values you are testing.</span>
      </div>
      <div className="testing-content">
        <div className="testing-search">
          <div className="search-left">
            <input type="text" className="search-box" value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} placeholder="Search Test" />
          </div>
          <div className="search-right">
            <button className="btn-add" onClick={ onAddTest }>Add A/B Test</button>
          </div>
        </div>
        <div className="table-header">
          <div className="table-row">
            <div className="table-col">NAME</div>
            <div className="table-col">DATE STARTED</div>
            <div className="table-col">DATE FINISHED</div>
          </div>
        </div>
        <div className="table-body">
          { testElements }
        </div>
      </div>
    </div>
  );
}

export default ProductTestingComponent
