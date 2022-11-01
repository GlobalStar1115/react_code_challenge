import React, { useState } from 'react'
import Select from 'react-select'
import { Modal, Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const AdgroupSelector = ({ campaign, settings, onChange }) => {
  const [ selectCache, setSelectCache ] = useState(0)
  const [ showConfirm, setShowConfirm ] = useState(false)

  if (campaign && (campaign.basic[0].type === 'sb' || campaign.basic[0].type === 'sbv')) {
    // Ad groups are not available for Sponsored Brands.
    return null
  }

  const adgroups = (campaign ? campaign.adgroups : []).filter(adgroup => (
    adgroup.state === 'enabled'
  ))

  const adgroupList = adgroups.map(adgroup => ({
    value: adgroup.id,
    label: adgroup.name,
  }))

  adgroupList.unshift({
    value: 0,
    label: '- Entire Campaign -',
  })

  const value = adgroupList.find(option => (
    parseInt(option.value, 10) === parseInt(settings.adgroup_id, 10)
  ))

  const handleChange = (selected) => {
    setSelectCache(parseInt(selected.value, 10))
    setShowConfirm(true)
  }

  const handleConfirm = toSave => () => {
    onChange(selectCache, toSave)
    setShowConfirm(false)
  }

  return (
    <div className="adgroup-selector">
      <label>
        Apply to Entire Campaign or Select Ad Group
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            You can set automation rules on a campaign level or ad group level.
            If you have multiple ad groups but want our system
            to treat them all the same, use campaign level settings.<br /><br />
            You can also set both campaign level automations and ad group level automations
            for the same campaign. In this case, the ad group level automations you save
            will override campaign level automations for that ad group.<br /><br />
            Please note: Search Term Expansion and Product Targeting Expansion is saved
            on a campaign level but you can choose which ad groups you want to add targets to.<br /><br />
            Saving Templates and “Apply to multiple campaigns” options use campaign level settings.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </label>
      <Select
        value={value}
        options={adgroupList}
        placeholder="Choose Ad Groups"
        onChange={handleChange}
      />
      <Modal backdrop="static" show={showConfirm} size="xs">
        <Modal.Body>
          Save changes before switching to { selectCache ? 'ad group' : 'campaign' }?
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="rs-btn rs-btn-primary" onClick={handleConfirm(true)}>
            Yes
          </button>
          <button type="button" className="rs-btn rs-btn-subtle" onClick={handleConfirm(false)}>
            No
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default AdgroupSelector
