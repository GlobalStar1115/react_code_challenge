/* eslint-disable jsx-a11y/anchor-is-valid */
// Campaign overview.
import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Moment from 'react-moment'
import moment from 'moment'

import { toast } from '../CommonComponents/ToastComponent/toast'
import TemplateSelector from '../CommonComponents/TemplateSelector'

import { getTemplates } from '../../redux/actions/ap'

const CampaignInfo = ({ campaign, settings, onChange }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    header: { currentUserId },
    ap: { templates, isLoadingTemplates, isTemplatesLoaded },
  } = store.getState()

  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)

  useEffect(() => {
    if (templateSelectorVisible && !isTemplatesLoaded && !isLoadingTemplates && currentUserId) {
      dispatch(getTemplates())
    }
  }, [templateSelectorVisible]) // eslint-disable-line

  if (!campaign) {
    return null
  }

  let campaignType = ''
  let targetingType

  if (campaign.basic[0].type === 'sp') {
    campaignType = 'Sponsored Product'
    if (campaign.basic[0].targeting_type === 'auto') {
      targetingType = 'Auto'
    } else {
      targetingType = 'Manual'
    }
  } else if (campaign.basic[0].type === 'sd') {
    campaignType = 'Sponsored Display'
  } else if (campaign.basic[0].type === 'sbv') {
    campaignType = 'Sponsored Brand Video'
  } else if (campaign.basic[0].type === 'sb') {
    campaignType = 'Sponsored Brand'
  }

  const handleTemplateSelect = (event) => {
    event.preventDefault()
    setTemplateSelectorVisible(true)
  }

  const handleTemplateApply = (templateId) => {
    onChange('ap_template_id', templateId)
    setTemplateSelectorVisible(false)

    toast.show({
      title: 'Info',
      description: 'You need to click on `Apply` button '
        + 'to save your selection and apply the template.',
      duration: 5000,
    })
  }

  let template
  if (settings.ap_template_id) {
    template = templates.find(template => (
      parseInt(template.id, 10) === parseInt(settings.ap_template_id, 10)
    ))
  }

  return (
    <div className="campaign-info">
      <div className="campaign-detail">
        <div className="campaign-name">
          { campaign.basic[0].name }
        </div>
        <div className="campaign-type">
          { targetingType && <span>{ targetingType }</span> }
          <span>{ campaignType }</span>
        </div>
        {
          ((campaign.ap && !campaign.ap.adgroup_id) || (!campaign.ap && !settings.adgroup_id)) && (
            <div className="campaign-template">
              <a href="#" onClick={handleTemplateSelect}>
                {
                  !settings.ap_template_id ? 'No template used'
                  : (
                    <span>
                      Template: <strong>{ template ? template.name : campaign.template.name }</strong>
                    </span>
                  )
                }
              </a>
            </div>
          )
        }
        <TemplateSelector
          show={templateSelectorVisible}
          templates={templates}
          settings={settings}
          isLoading={isLoadingTemplates}
          onChange={handleTemplateApply}
          onCancel={() => { setTemplateSelectorVisible(false) }}
        />
      </div>
      <div className="campaign-date">
        <div className="campaign-start-date">
          Started <Moment fromNow>{ campaign.basic[0].campaign_start_date }</Moment>
        </div>
        {
          campaign.basic[0].campaign_end_date
          && moment(campaign.basic[0].campaign_end_date).isAfter(moment())
          && (
            <div className="campaign-end-date">
              <Moment fromNow ago>{ campaign.basic[0].campaign_end_date }</Moment> left
            </div>
          )
        }
      </div>
    </div>
  )
}

export default CampaignInfo
