/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Modal } from 'rsuite'
import Select from 'react-select'

import LoaderComponent from '../LoaderComponent'
import OpKeywordBasic from './OpKeywordBasic'
import OpKeywordAdvanced from './OpKeywordAdvanced'
import OpKeywordIgnore from './OpKeywordIgnore'
import OpNTA from './OpNTA'
import OpNPT from './OpNPT'
import ExKeyword from './ExKeyword'

import { getTemplate } from '../../../redux/actions/ap'

const Option = (props) => {
  const { innerRef, innerProps, getStyles, isSelected, data } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles('option', props)}
      className={`template-option${isSelected ? ' selected' : ''}`}
    >
      <span>{ data.name }</span>
      <a href="#" onClick={(event) => { event.preventDefault(); data.onSeeDetails(data.id) }}>
        See what's included
      </a>
    </div>
  )
}

const TemplateSelector = ({ show, templates, settings = {}, isLoading, isApplying = false, onChange, onCancel }) => {
  const dispatch = useDispatch()

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const found = templates.find(template => (
      parseInt(template.id, 10) === parseInt(settings.ap_template_id || 0, 10)
    ))
    if (found) {
      setSelectedTemplate(found)
    }
  }, [templates]) // eslint-disable-line

  const handleTemplateChange = (template) => {
    setSelectedTemplate(template)

    // When another template is in `more details` mode,
    // present the selected template's contents.
    if (details || loadingDetails) {
      handleSeeDetails(template.id)
    }
  }

  const handleSeeDetails = (templateId) => {
    setLoadingDetails(true)
    dispatch(getTemplate(templateId)).then((response) => {
      setLoadingDetails(false)
      setDetails(response.data)
    })
  }

  const extendedTemplates = templates.map(template => ({
    ...template,
    onSeeDetails: handleSeeDetails,
  }))

  const renderDetails = () => {
    if (!details || loadingDetails) {
      return null
    }

    return (
      <div className="template-details">
        <div className="template-name">
          Name: <strong>{ details.name }</strong>
        </div>
        <div className="setting-section">
          <div className="section-name">
            Target Bid Optimization
          </div>
          <OpKeywordBasic details={details} />
          <OpKeywordAdvanced details={details} />
          <OpKeywordIgnore details={details} />
        </div>
        <OpNTA details={details} />
        <OpNTA details={details} clone />
        <OpNPT details={details} />
        <OpNPT details={details} clone />
        <ExKeyword details={details} />
      </div>
    )
  }

  return (
    <Modal className="template-selector-modal" overflow={false} backdrop="static" show={show} size="xs">
      <Modal.Body>
        { (isApplying || loadingDetails) && <LoaderComponent /> }
        <div className="template-label">Optimization Templates</div>
        <Select
          options={extendedTemplates}
          getOptionLabel={template => template.name}
          getOptionValue={template => template.id}
          value={selectedTemplate}
          components={{ Option }}
          isLoading={isLoading}
          isDisabled={isApplying}
          placeholder="Select template..."
          onChange={handleTemplateChange}
        />
        { renderDetails() }
      </Modal.Body>
      <Modal.Footer>
        {
          settings.ap_template_id && (
            <button
              type="button"
              className="rs-btn rs-btn-default rs-btn-red"
              onClick={() => { onChange(null) }}
            >
              Remove Template
            </button>
          )
        }
        {
          selectedTemplate &&
          parseInt(settings.ap_template_id || 0, 10) !== parseInt(selectedTemplate.id, 10) && (
            <button
              type="button"
              className="rs-btn rs-btn-primary"
              disabled={isApplying || !selectedTemplate}
              onClick={() => { onChange(selectedTemplate.id) }}
            >
              Apply Template
            </button>
          )
        }
        <button
          type="button"
          className="rs-btn rs-btn-subtle"
          disabled={isApplying}
          onClick={onCancel}
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default TemplateSelector
