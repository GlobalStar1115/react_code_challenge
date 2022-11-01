import React, { useState } from 'react'
import { useStore } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import SubSection from './SubSection'
import FieldRow from './FieldRow'
import FieldNumber from './FieldNumber'
import ExSkus from './ExSkus'
import ExCampaigns from './ExCampaigns'
import ExProductAdgroups from './ExProductAdgroups'

const ExProduct = ({ campaign, settings, onChange, ...props }) => {
  const store = useStore()

  const { ap: { skus, isLoadingSkus } } = store.getState()
  const [ skusSelected, setSkusSelected ] = useState([])
  const [ isCampaignsLoaded, setIsCampaignsLoaded ] = useState(false)

  const handleSkuSelect = (skus) => {
    setSkusSelected(skus.map(sku => sku.sku))
  }

  return (
    <SubSection name="Product Targeting Expansion" {...props}>
      <div className="checkbox-info-wrapper">
        <CheckboxComponent
          label="Automatically pull winning ASINs from other campaigns into this campaign"
          checked={settings.pt_isactive}
          onChange={(checked) => { onChange('pt_isactive', checked) }}
        />
      </div>
      <FieldRow disabled={!settings.pt_isactive}>
        <FieldNumber
          label="<strong>Step 1)</strong> Find ASINs with ACoS between 1 and"
          htmlLabel
          field="pt_acos"
          inline
          settings={settings}
          onChange={onChange}
        />
      </FieldRow>
      <ExSkus
        skus={skus}
        selectedSkus={skusSelected}
        isLoading={isLoadingSkus}
        disabled={!settings.pt_isactive}
        onChange={handleSkuSelect}
      />
      <ExCampaigns
        field="pt_campaign_selected"
        skus={skusSelected}
        forASINs
        settings={settings}
        disabled={!settings.pt_isactive}
        isLoaded={isCampaignsLoaded}
        onLoad={setIsCampaignsLoaded}
        onChange={onChange}
      />
      <div className={`st-criteria-label ${!settings.pt_isactive || !isCampaignsLoaded ? 'disabled' : ''}`}>
        <strong>Step 4)</strong> Pull ASINs with the following criteria.
      </div>
      <FieldRow disabled={!settings.pt_isactive || !isCampaignsLoaded}>
        <FieldNumber
          label="Min orders"
          settings={settings}
          field="pt_minimum_orders"
          tooltip="We'll pull ASINs from campaigns selected that have at least this many orders over the lookback period."
          onChange={onChange}
        />
        <div className="field-wrapper" />
      </FieldRow>
      <FieldRow disabled={!settings.pt_isactive || !isCampaignsLoaded}>
        <div className="field-wrapper">
          <div className="checkbox-info-wrapper">
            <CheckboxComponent
              label="New ASINs only (recommended)"
              checked={settings.pt_new_asins_only}
              onChange={(checked) => { onChange('pt_new_asins_only', checked) }}
            />
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                We'll only add ASINS that are not already
                targeted in any of the campaigns selected above.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </div>
        </div>
        <div className="field-wrapper">
          <div className="checkbox-info-wrapper">
            <CheckboxComponent
              label="Add as negative target in parent campaign"
              checked={settings.pt_negate_parent}
              onChange={(checked) => { onChange('pt_negate_parent', checked) }}
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
          <ExProductAdgroups
            campaign={campaign}
            settings={settings}
            disabled={!settings.pt_isactive || !isCampaignsLoaded}
            onChange={onChange}
          />
        )
      }
    </SubSection>
  )
}

export default ExProduct
