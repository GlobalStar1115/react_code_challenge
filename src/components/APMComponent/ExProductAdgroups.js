import React, { useState, useEffect } from 'react'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CustomTable from '../CommonComponents/CustomTableComponent'

const ExProductAdgroups = ({ campaign, settings, disabled, onChange }) => {
  const [isSB, setIsSB] = useState(false)
  const [selectedAdgroupIds, setSelectedAdgroupIds] = useState([])
  const [adgroupValues, setAdgroupValues] = useState({})

  useEffect(() => {
    const isSBCampaign = campaign.basic[0].type === 'sb'
      || campaign.basic[0].type === 'sbv'
    setIsSB(isSBCampaign)

    const values = {}
    const selected = []
    if (!isSBCampaign) {
      campaign.productAdgroups.forEach((adgroup) => {
        const found = settings.pt_adgroups_apply.find(value => (
          parseInt(value.adgroupId, 10) === parseInt(adgroup.id, 10)
        ))

        values[adgroup.id] = {
          bid: found ? found.bid : 0.75,
        }

        if (found) {
          selected.push(found.adgroupId)
        }
      })
    } else {
      const found = settings.pt_adgroups_apply.length
        ? settings.pt_adgroups_apply[0] : null
      values[0] = {
        bid: found ? found.bid : 0.75,
      }

      if (!found) {
        propagateChange([{
          adgroupId: 0,
          bid: 0.75,
        }])
      }
    }
    setSelectedAdgroupIds(selected)
    setAdgroupValues(values)
  }, [campaign]) // eslint-disable-line

  // Propagate selection change.
  const propagateChange = (list) => {
    onChange('pt_adgroups_apply', list)
    setSelectedAdgroupIds(list.map(value => value.adgroupId))
  }

  // Handle changes of records selection in custom table component.
  const handleSelectionChange = (adgroupIds) => {
    const compositeValue = adgroupIds.map(id => ({
      adgroupId: id,
      bid: adgroupValues[id].bid,
    }))

    propagateChange(compositeValue)
  }

  const applyBidChange = (adgroupId, bid) => {
    const values = {...adgroupValues}
    values[adgroupId].bid = bid
    setAdgroupValues(values)

    // Propagate changes to parent components.
    const compositeValue = [...settings.pt_adgroups_apply]
    compositeValue.forEach((value) => {
      if (value.adgroupId === adgroupId) {
        value.bid = bid
      }
    })

    propagateChange(compositeValue)
  }

  const handleBidChange = (adgroupId = 0) => (event) => {
    applyBidChange(adgroupId, event.target.value)
  }

  // Validate if a bid value is equal to, or greater than 0.02.
  const validateBid = (adgroupId = 0) => () => {
    if (adgroupValues[adgroupId].bid === ''
      || isNaN(adgroupValues[adgroupId].bid)
      || parseFloat(adgroupValues[adgroupId].bid) < 0.02) {
      applyBidChange(adgroupId, 0.02)
    }
  }

  const renderAdgroup = (adgroup, checked) => (
    <>
      <div className="table-col">
        { adgroup.name }
      </div>
      <div className="table-col">
        <input
          type="number"
          min="0.02"
          disabled={!checked}
          value={adgroupValues[adgroup.id] ? adgroupValues[adgroup.id].bid : 0}
          onChange={handleBidChange(adgroup.id)}
          onBlur={validateBid(adgroup.id)}
        />
      </div>
    </>
  )

  const renderSection = () => {
    if (!isSB) {
      return (
        <CustomTable
          className="table-adgroups"
          records={campaign.productAdgroups}
          idField="id"
          searchFields={['name']}
          selectedRecords={selectedAdgroupIds}
          renderRecord={renderAdgroup}
          onChange={handleSelectionChange}
        >
          <div className="table-col">Ad Group</div>
          <div className="table-col">Bid</div>
        </CustomTable>
      )
    }

    return (
      <div className="table-adgroups table-sb-adgroups">
        <div className="table-body">
          <div className="table-row content-header">
            <div className="table-col"></div>
            <div className="table-col">Bid</div>
          </div>
          <div className="table-row">
            <div className="table-col">
              Campaign Level
            </div>
            <div className="table-col">
              <input
                type="number"
                min="0.02"
                value={adgroupValues[0].bid}
                onChange={handleBidChange()}
                onBlur={validateBid()}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`table-wrapper ${disabled ? 'disabled' : ''}`}>
      <div className="table-wrapper-header">
        <strong>Step 5)</strong>&nbsp;Select Ad Groups, specify bid price for newly added ASINs.
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            This is where you will select which ad groups to add competitor ASINs
            to in order to target them with advertising.
            If no ad groups are present, this means you do not have
            any Product Targeting ad groups created within this campaign.
            Product Targeting ad groups can be added in Campaign Expansion.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
      {
        !isSB && (
          <div className="table-header-desc">
            { campaign.productAdgroups.length } ad groups available for selection.
          </div>
        )
      }
      { renderSection() }
    </div>
  )
}

export default ExProductAdgroups
