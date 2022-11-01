import React from 'react'
import AreaRechartComponent from '../CommonComponents/AreaChart'

import {
  formatValue,
  formatCurrency
} from '../../services/helper'

const TableCol = ({ campaign, fieldValue, fieldLabel, currencySign,
  currencyRate, showHistory, onClickHistory,
  dataType='number', direct=false, decimalLength=2, startDate, endDate }) => {

  const getColVal = (fieldValue) => {
    if (fieldValue === 'cpc') {
      return campaign.cpc ? formatValue(campaign.cpc, 'number') : 'N/A'
    }
    return dataType === 'currency'
      ? formatCurrency(campaign[fieldValue], currencySign, currencyRate)
      : formatValue(campaign[fieldValue], dataType, decimalLength)
  }
  return (
    <>
      {
        showHistory ? (
          <div className="table-col history" onClick={() => onClickHistory(campaign.chartData, fieldValue, campaign.campaign, fieldLabel, direct)}>
            <div className="col-value">
              {getColVal(fieldValue)}
            </div>
            <AreaRechartComponent
              areaData={
                campaign.chartData && campaign.chartData.length > 0 ? campaign.chartData.map(item => ({
                  date: item.startdate,
                  value: item[fieldValue] ? item[fieldValue] : 0,
                }))
                : []
              }
              startDate={startDate}
              endDate={endDate}
              direct={direct}
            />
            <span className="tooltiptext">+</span>
          </div>
        ) : (
          <div className="table-col">
            {getColVal(fieldValue)}
          </div>
        )
      }
    </>
  )
}
export default TableCol