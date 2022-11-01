import React, { useState } from 'react'
import { useStore, useDispatch } from 'react-redux'

import { addNewTest } from '../../redux/actions/productDetail'

const ProductTestingAddComponent = ({ onClose }) => {
  const dispatch = useDispatch()
  const store = useStore()
  const { product, header } = store.getState()
  const { curProduct } = product
  const { currentUserId } = header

  const [ testName, setTestName ] = useState('')
  const [ titleA, setTitleA ] = useState('')
  const [ titleB, setTitleB ] = useState('')
  const [ summaryA, setSummaryA ] = useState('')
  const [ summaryB, setSummaryB ] = useState('')
  const [ bulletsA1, setBulletsA1 ] = useState('')
  const [ bulletsA2, setBulletsA2 ] = useState('')
  const [ bulletsA3, setBulletsA3 ] = useState('')
  const [ bulletsA4, setBulletsA4 ] = useState('')
  const [ bulletsA5, setBulletsA5 ] = useState('')
  const [ bulletsB1, setBulletsB1 ] = useState('')
  const [ bulletsB2, setBulletsB2 ] = useState('')
  const [ bulletsB3, setBulletsB3 ] = useState('')
  const [ bulletsB4, setBulletsB4 ] = useState('')
  const [ bulletsB5, setBulletsB5 ] = useState('')
  const [ backendA1, setBackendA1 ] = useState('')
  const [ backendA2, setBackendA2 ] = useState('')
  const [ backendA3, setBackendA3 ] = useState('')
  const [ backendA4, setBackendA4 ] = useState('')
  const [ backendA5, setBackendA5 ] = useState('')
  const [ backendB1, setBackendB1 ] = useState('')
  const [ backendB2, setBackendB2 ] = useState('')
  const [ backendB3, setBackendB3 ] = useState('')
  const [ backendB4, setBackendB4 ] = useState('')
  const [ backendB5, setBackendB5 ] = useState('')
  const [ priceA, setPriceA ] = useState('')
  const [ priceB, setPriceB ] = useState('')
  const [ discountA, setDiscountA ] = useState('')
  const [ discountB, setDiscountB ] = useState('')
  const [ couponA, setCouponA ] = useState('')
  const [ couponB, setCouponB ] = useState('')
  const [ timeFrame, setTimeFrame ] = useState(7)

  const onCloseModal = () => {
    onClose()
  }
  const onAddTest = () => {
    dispatch(addNewTest({
      testName,
      titleA,
      titleB,
      summaryA,
      summaryB,
      bulletsA1,
      bulletsA2,
      bulletsA3,
      bulletsA4,
      bulletsA5,
      bulletsB1,
      bulletsB2,
      bulletsB3,
      bulletsB4,
      bulletsB5,
      backendA1,
      backendA2,
      backendA3,
      backendA4,
      backendA5,
      backendB1,
      backendB2,
      backendB3,
      backendB4,
      backendB5,
      priceA,
      priceB,
      discountA,
      discountB,
      couponA,
      couponB,
      timeFrame,
      sku: curProduct['sku'],
      userId: currentUserId,
      id: curProduct['id']
    }))
    onCloseModal()
  }

  return (
    <div className="testing-add-modal">
      <div className="testing-modal-overlay" onClick={ onCloseModal }></div>
      <div className="testing-modal-content">
        <div className="modal-header">
          <div className="header-left">A/B Split Testing</div>
          <div className="header-right">
            <button className="btn-add" onClick={ onAddTest }>Add Test</button>
            <button className="btn-close" onClick={ onCloseModal }>Close</button>
          </div>
        </div>
        <div className="modal-sub-header">
          <div className="sub-header-left">
            <span>Test Name :</span>
            <input type="text" value={ testName } onChange={ (e)=> setTestName(e.target.value) } />
          </div>
          <div className="sub-header-right">
            <div className="btn-option" onClick={ ()=> setTimeFrame(7) }>7 Days</div>
            <div className="btn-option" onClick={ ()=> setTimeFrame(14) }>14 Days</div>
            <div className="btn-option" onClick={ ()=> setTimeFrame(21) }>21 Days</div>
            <div className="btn-option" onClick={ ()=> setTimeFrame(28) }>28 Days</div>
            <input type="text" value={timeFrame} onChange={ (e) => setTimeFrame(e.target.value) } />
            <span>Days</span>
          </div>
        </div>
        <div className="modal-content">
          <div className="section">
            <div className="section-header">A Values</div>
            <div className="section-content">
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Title</span>
                  <textarea value={ titleA } onChange={ (e)=> setTitleA(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span>Summary</span>
                  <textarea value={ summaryA } onChange={ (e)=> setSummaryA(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Bullets</span>
                  <textarea value={ bulletsA1 } onChange={ (e)=> setBulletsA1(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsA2 } onChange={ (e)=> setBulletsA2(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsA3 } onChange={ (e)=> setBulletsA3(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsA4 } onChange={ (e)=> setBulletsA4(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsA5 } onChange={ (e)=> setBulletsA5(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Backend Keywords</span>
                  <textarea value={ backendA1 } onChange={ (e)=> setBackendA1(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendA2 } onChange={ (e)=> setBackendA2(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendA3 } onChange={ (e)=> setBackendA3(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendA4 } onChange={ (e)=> setBackendA4(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendA5 } onChange={ (e)=> setBackendA5(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Price</span>
                  <input type="text" value={ priceA } onChange={ (e)=> setPriceA(e.target.value) } />
                </div>
                <div className="section-col">
                  <span>Discount</span>
                  <input type="text" value={ discountA } onChange={ (e)=> setDiscountA(e.target.value) } />
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Coupon</span>
                  <input type="text" value={ couponA } onChange={ (e)=> setCouponA(e.target.value) } />
                </div>
                <div className="section-col">
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section-header">B Values</div>
            <div className="section-content">
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Title</span>
                  <textarea value={ titleB } onChange={ (e)=> setTitleB(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span>Summary</span>
                  <textarea value={ summaryB } onChange={ (e)=> setSummaryB(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Bullets</span>
                  <textarea value={ bulletsB1 } onChange={ (e)=> setBulletsB1(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsB2 } onChange={ (e)=> setBulletsB2(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsB3 } onChange={ (e)=> setBulletsB3(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsB4 } onChange={ (e)=> setBulletsB4(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ bulletsB5 } onChange={ (e)=> setBulletsB5(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Backend Keywords</span>
                  <textarea value={ backendB1 } onChange={ (e)=> setBackendB1(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendB2 } onChange={ (e)=> setBackendB2(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendB3 } onChange={ (e)=> setBackendB3(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendB4 } onChange={ (e)=> setBackendB4(e.target.value) }></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={ backendB5 } onChange={ (e)=> setBackendB5(e.target.value) }></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Price</span>
                  <input type="text" value={ priceB } onChange={ (e)=> setPriceB(e.target.value) } />
                </div>
                <div className="section-col">
                  <span>Discount</span>
                  <input type="text" value={ discountB } onChange={ (e)=> setDiscountB(e.target.value) } />
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Coupon</span>
                  <input type="text" value={ couponB } onChange={ (e)=> setCouponB(e.target.value) } />
                </div>
                <div className="section-col">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductTestingAddComponent
