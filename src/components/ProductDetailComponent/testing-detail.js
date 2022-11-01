import React from 'react'
import { useStore } from 'react-redux'

import LoaderComponent from '../CommonComponents/LoaderComponent'

import { formatValue, formatCurrency } from '../../services/helper'

const ProductTestingDetailComponent = ({ onClose }) => {
  const store = useStore()
  const { productDetail, header } = store.getState()
  const { currentTest, isLoadingTest, testStatsA, testStatsB } = productDetail
  const { currencyRate, currencySign } = header

  const test = isLoadingTest ? [] : currentTest

  const onCloseModal = () => {
    onClose()
  }

  return (
    <div className={isLoadingTest ? "testing-detail-modal loading" : "testing-detail-modal"}>
      {isLoadingTest &&
        <LoaderComponent />
      }
      <div className="testing-modal-overlay" onClick={ onCloseModal }></div>
      <div className="testing-modal-content">
        <div className="modal-header">
          <div className="header-left">A/B Split Testing</div>
          <div className="header-right">
            <button className="btn-close" onClick={ onCloseModal }>Close</button>
          </div>
        </div>
        <div className="modal-sub-header">
          <div className="sub-header-left">
            <span>Test Name :</span>
            <input type="text" value={test['name']} disabled />
          </div>
          <div className="sub-header-right">
          </div>
        </div>
        <div className="modal-result">
          <div className="result-right">
            <div className="result-row">
              <div className="result-box box-profit">
                <span>Profit</span>
                <span>{formatCurrency(testStatsB['profit'], currencySign, currencyRate)}</span>
              </div>
              <div className="result-box box-revenue">
                <span>Gross Revenue</span>
                <span>{formatCurrency(testStatsB['revenue'], currencySign, currencyRate)}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-spend">
                <span>Ad Spend</span>
                <span>{formatCurrency(testStatsB['cost'], currencySign, currencyRate)}</span>
              </div>
              <div className="result-box box-impression">
                <span>Impressions</span>
                <span>{testStatsB['impressions']}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-clicks">
                <span>Clicks</span>
                <span>{testStatsB['clicks']}</span>
              </div>
              <div className="result-box box-ctr">
                <span>CTR(%)</span>
                <span>{formatValue(testStatsB['ctr']*100, 'number')}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-cr">
                <span>Conversion Rate(%)</span>
                <span>{formatValue(testStatsB['orders']/testStatsB['clicks']*100, 'number')}</span>
              </div>
              <div className="result-box box-acos">
                <span>ACoS(%)</span>
                <span>{formatValue(testStatsB['cost']/testStatsB['revenue']*100, 'number', 1)}</span>
              </div>
            </div>
          </div>
          <div className="result-left">
            <div className="result-row">
              <div className="result-box box-profit">
                <span>Profit</span>
                <span>{formatCurrency(testStatsA['profit'], currencySign, currencyRate)}</span>
              </div>
              <div className="result-box box-revenue">
                <span>Gross Revenue</span>
                <span>{formatCurrency(testStatsA['revenue'], currencySign, currencyRate)}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-spend">
                <span>Ad Spend</span>
                <span>{formatCurrency(testStatsA['cost'], currencySign, currencyRate)}</span>
              </div>
              <div className="result-box box-impression">
                <span>Impressions</span>
                <span>{testStatsA['impressions']}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-clicks">
                <span>Clicks</span>
                <span>{testStatsA['clicks']}</span>
              </div>
              <div className="result-box box-ctr">
                <span>CTR(%)</span>
                <span>{formatValue(testStatsA['ctr']*100, 'number')}</span>
              </div>
            </div>
            <div className="result-row">
              <div className="result-box box-cr">
                <span>Conversion Rate(%)</span>
                <span>{formatValue(testStatsA['orders']/testStatsA['clicks']*100, 'number')}</span>
              </div>
              <div className="result-box box-acos">
                <span>ACoS(%)</span>
                <span>{formatValue(testStatsA['cost']/testStatsA['revenue']*100, 'number', 1)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-content">
          <div className="section">
            <div className="section-header">Statistics A</div>
            <div className="section-content">
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Title</span>
                  <textarea value={test['before_title']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span>Summary</span>
                  <textarea value={test['before_summary']} disabled></textarea>
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Bullets</span>
                  <textarea value={test['before_bullet1']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_bullet2']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_bullet3']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_bullet4']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_bullet5']} disabled></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Backend Keywords</span>
                  <textarea value={test['before_backend1']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_backend2']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_backend3']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_backend4']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['before_backend5']} disabled></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Price</span>
                  <input type="text" value={test['before_price']} disabled />
                </div>
                <div className="section-col">
                  <span>Discount</span>
                  <input type="text" value={test['before_discount']} disabled />
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Coupon</span>
                  <input type="text" value={test['before_coupon']} disabled />
                </div>
                <div className="section-col">
                </div>
              </div>
            </div>
          </div>
          <div className="section">
            <div className="section-header">Statistics B</div>
            <div className="section-content">
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Title</span>
                  <textarea value={test['after_title']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span>Summary</span>
                  <textarea value={test['after_summary']} disabled></textarea>
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Bullets</span>
                  <textarea value={test['after_bullet1']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_bullet2']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_bullet3']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_bullet4']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_bullet5']} disabled></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Backend Keywords</span>
                  <textarea value={test['after_backend1']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_backend2']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_backend3']} disabled></textarea>
                </div>
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_backend4']} disabled></textarea>
                </div>
              </div>
              <div className="section-row">
                <div className="section-col">
                  <span></span>
                  <textarea value={test['after_backend5']} disabled></textarea>
                </div>
                <div className="section-col">
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Price</span>
                  <input type="text" value={test['after_price']} disabled />
                </div>
                <div className="section-col">
                  <span>Discount</span>
                  <input type="text" value={test['after_discount']} disabled />
                </div>
              </div>
              <div className="section-row-spacer"></div>
              <div className="section-row">
                <div className="section-col">
                  <span>Coupon</span>
                  <input type="text" value={test['after_coupon']} disabled />
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

export default ProductTestingDetailComponent
