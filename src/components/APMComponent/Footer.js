// Smart pilot manager pane footer.
import React, { useState } from 'react'
import { Dropdown, Tooltip, Whisper } from 'rsuite'
import { Modal } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const Footer = ({ settings, saveError, isLoading, isSaving, onApplyToMultiple,
  onSave, onSaveTemplate, onClose }) => {
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [needApply, setNeedApply] = useState(false)

  const handleSaveSelect = apply => () => {
    setTemplateName('')
    setNeedApply(apply)
    setShowTemplateModal(true)
  }

  const handleTemplateSave = () => {
    onSaveTemplate(templateName, needApply)
    setShowTemplateModal(false)
  }

  return (
    <div className="pane-footer">
      {
        saveError !== null && (
          <div className="save-error">
            { saveError }
          </div>
        )
      }
      <Dropdown
        title="More actions"
        placement="topStart"
        disabled={isLoading || isSaving}
      >
        {
          (settings.adgroup_id === null || settings.adgroup_id === 0) && (
            <Dropdown.Item onSelect={onApplyToMultiple}>
              Apply to multiple campaigns
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  What will be applied to other campaigns?<br/><br/>
                  Campaign level settings from this campaign including basic target optimization,
                  advanced target optimization, target expansion and negative target automation
                  will be applied to selected campaigns.<br/><br/>
                  NOTE: Ad group level settings, dayparting, search term expansion,
                  and product targeting expansion will NOT be applied to selected campaigns.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </Dropdown.Item>
          )
        }
        <Dropdown.Item onSelect={handleSaveSelect(false)}>
          Save as template
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              What will be saved in my template?<br/><br/>
              Campaign level settings from this campaign including basic target optimization,
              advanced target optimization, target expansion and negative target automation
              will be saved to template.<br/><br/>
              NOTE: Ad group level settings, dayparting, search term expansion,
              and product targeting expansion will NOT be saved to template.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </Dropdown.Item>
        <Dropdown.Item onSelect={handleSaveSelect(true)}>
          Save as template and apply
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              What will be saved in my template?<br/><br/>
              Campaign level settings from this campaign including basic target optimization,
              advanced target optimization, target expansion and negative target automation
              will be saved to template.<br/><br/>
              NOTE: Ad group level settings, dayparting, search term expansion,
              and product targeting expansion will NOT be saved to template.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </Dropdown.Item>
      </Dropdown>
      <Modal backdrop="static" show={showTemplateModal} size="xs">
        <Modal.Body>
          <input
            type="text"
            className="input-template-name"
            value={templateName}
            placeholder="Enter a template name"
            onChange={(event) => { setTemplateName(event.target.value) }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="rs-btn rs-btn-primary"
            disabled={templateName === ''}
            onClick={handleTemplateSave}
          >
            Save
          </button>
          <button type="button" className="rs-btn rs-btn-subtle" onClick={() => { setShowTemplateModal(false) }}>
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
      <button
        type="button"
        className="btn btn-blue"
        disabled={isLoading || isSaving}
        onClick={onSave}
      >
        Apply
      </button>
      <button
        type="button"
        className="btn btn-white"
        disabled={isSaving}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  )
}

export default Footer
