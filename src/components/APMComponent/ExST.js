import React, { useState } from 'react'
import { useStore } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import SubSection from './SubSection'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'
import CheckInput from './CheckInput'
import ExSkus from './ExSkus'
import ExCampaigns from './ExCampaigns'
import ExSTAdgroups from './ExSTAdgroups'

const ExST = ({ campaign, settings, onChange, ...props }) => {
  const store = useStore()

  const { ap: { skus, isLoadingSkus } } = store.getState()

  const [ selectedSkus, setSelectedSkus ] = useState([])
  const [ isCampaignsLoaded, setIsCampaignsLoaded ] = useState(false)

  const handleSkuSelect = (skus) => {
    setSelectedSkus(skus.map(sku => sku.sku))
  }

  return (
    <SubSection name="Search Term Expansion" {...props}>
      <div className="checkbox-info-wrapper">
        <CheckboxComponent
          label="Automatically pull winning Search Terms from other campaigns into this campaign"
          checked={settings.st_isactive}
          onChange={(checked) => { onChange('st_isactive', checked) }}
        />
      </div>
      <FieldRow disabled={!settings.st_isactive}>
        <FieldNumber
          label="<strong>Step 1)</strong> Find Search Terms with ACoS between 1 and"
          htmlLabel
          field="st_keywords_acos"
          inline
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <ExSkus
        skus={skus}
        selectedSkus={selectedSkus}
        isLoading={isLoadingSkus}
        disabled={!settings.st_isactive}
        onChange={handleSkuSelect}
      />
      <ExCampaigns
        field="st_keywords_campaign_selected"
        skus={selectedSkus}
        settings={settings}
        disabled={!settings.st_isactive}
        isLoaded={isCampaignsLoaded}
        onLoad={setIsCampaignsLoaded}
        onChange={onChange}
      />
      <div className={`st-criteria-label ${!settings.st_isactive || !isCampaignsLoaded ? 'disabled' : ''}`}>
        <strong>Step 4)</strong> Pull Search Terms with the following criteria.
      </div>
      <FieldRow disabled={!settings.st_isactive || !isCampaignsLoaded}>
        <FieldNumber
          label="Min orders"
          settings={settings}
          field="st_minimum_orders"
          tooltip="We'll pull Search Terms from campaigns selected that have at least this many orders over the lookback period."
          onChange={onChange}
        />
        <CheckInput
          label="CTR% higher than"
          field="st_ctr_isactive"
          inputField="st_ctr_above"
          settings={settings}
          onChange={onChange}
        />
        <CheckInput
          label="Conversion% higher than"
          field="st_conversion_isactive"
          inputField="st_conversion_above"
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <FieldRow disabled={!settings.st_isactive || !isCampaignsLoaded}>
        <div className="field-wrapper">
          <div className="checkbox-info-wrapper">
            <CheckboxComponent
              label="New keywords only (recommended)"
              checked={settings.st_new_keyword_only}
              onChange={(checked) => { onChange('st_new_keyword_only', checked) }}
            />
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                If selected, our system will only pull the search terms that are not
                already a keyword in any other campaign. This is great if you're
                looking to expand and find new keyword opportunities. Unselect this feature
                if you are looking to graduate keywords from one campaign to another.
                For example: Unselect this box if you wish to find keywords that
                are performing well in broad match in other campaigns and move to
                exact match in this campaign.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="checkbox-info-wrapper">
            <CheckboxComponent
              label="Add as negative exact in parent campaign"
              checked={settings.st_negate_parent}
              onChange={(checked) => { onChange('st_negate_parent', checked) }}
            />
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                While adding winning search terms or ASINS into a new campaign,
                you may wish to negate them from the previous campaign. If you check this box,
                we'll use a negative exact at the ad group level on the search term/ASIN
                from the campaign which it was found.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
        </div>
      </FieldRow>
      {
        campaign && (
          <ExSTAdgroups
            campaign={campaign}
            settings={settings}
            disabled={!settings.st_isactive || !isCampaignsLoaded}
            onChange={onChange}
          />
        )
      }
    </SubSection>
  )
}

export default ExST
