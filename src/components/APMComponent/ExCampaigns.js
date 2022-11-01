import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select, { components }  from 'react-select'

import { getApSPSDCampaigns, getApSBCampaigns } from '../../redux/actions/ap'
import { toast } from '../CommonComponents/ToastComponent/toast'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'

const getCampaignName = (campaign) => {
  let type = ''
  if (campaign.type === 'sponsoredProducts') {
    type = 'SP'
  } else if (campaign.type === 'sponsoredDisplays') {
    type = 'SD'
  } else if (campaign.type === 'headlineSearch') {
    type = 'SBV'
  } else {
    type = 'SB'
  }
  return `${campaign.name} (${type})`
}

const Option = (props) => {
  const { innerRef, innerProps, getStyles, data } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles('option', props)}
    >
      { getCampaignName(data) }
    </div>
  )
}

const LoadingIndicator = (props) => {
  return (
    <components.ValueContainer {...props}>
      Campaigns loading. Please wait...
    </components.ValueContainer>
  )
}

// https://github.com/JedWatson/react-select/issues/4170#issuecomment-682465724
const ValueContainer = (props) => {
  const { options, children, getValue } = props
  const selectCount = getValue().length
  let contents = children
  if (selectCount > 0) {
    if (selectCount === options.length) {
      contents = (
        <>
          All campaigns selected
          { children[1] }
        </>
      )
    } else if (selectCount >= 10) {
      contents = (
        <>
          { selectCount } campaigns selected
          { children[1] }
        </>
      )
    }
  }
  return (
    <components.ValueContainer {...props}>
      { contents }
    </components.ValueContainer>
  )
}

const ExCampaigns = ({ field, skus, forASINs, settings, disabled, isLoaded, onLoad, onChange }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { ap: {
    spsdCampaigns,
    sbCampaigns,
    isLoadingSPSDCampaigns,
    isLoadingSBCampaigns,
    isSBCampaignsLoaded,
  } } = store.getState()

  const [includeSB, setIncludeSB] = useState(false)
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    // When loading a previously saved setting, if campaigns are
    // selected, enable the step to choose campaigns.
    if (settings
      && settings[field]
      && settings[field].length
      && !isLoaded) {
      onLoad(true)
      dispatch(getApSPSDCampaigns())
      dispatch(getApSBCampaigns())
    }
  }, [settings]) // eslint-disable-line

  const handleLoad = () => {
    if (!skus.length && !includeSB) {
      toast.show({
        title: 'Warning',
        description: 'Please select some SKU\'s.',
      })
      return
    }

    if (skus.length) {
      onLoad(true)
      dispatch(getApSPSDCampaigns(skus))
    }

    if (includeSB && !isSBCampaignsLoaded) {
      onLoad(true)
      dispatch(getApSBCampaigns())
    }
  }

  const handleIncludeSB = (checked) => {
    setIncludeSB(checked)

    if (isLoaded && checked && !isSBCampaignsLoaded && !isLoadingSBCampaigns) {
      dispatch(getApSBCampaigns())
    }
  }

  const handleChange = (selected) => {
    onChange(field, selected.map(campaign => campaign.id))
  }

  const handleSelectAll = () => {
    if (settings[field].length === campaigns.length) {
      // If all is selected, un-select all.
      onChange(field, [])
    } else {
      // Select all.
      if (keyword === '') {
        onChange(field, campaigns.map(campaign => campaign.id))
      } else {
        const filteredCampaigns = campaigns.filter(campaign =>
          filterCampaigns({ data: campaign }, keyword)
        )
        onChange(field, filteredCampaigns.map(campaign => campaign.id))
        setKeyword('')
      }
    }
  }

  const handleInputChange = (inputValue, { action }) => {
    if (action !== 'input-blur' && action !== 'menu-close' && action !== 'set-value') {
      setKeyword(inputValue)
    }
  }

  const filterCampaigns = (option, input) => {
    if (!input.length) {
      return true
    }
    const lowercased = input.toLowerCase()
    const { data: { name } } = option
    return name.toLowerCase().indexOf(lowercased) !== -1
  }

  let campaigns
  if (includeSB) {
    campaigns = [...spsdCampaigns, ...sbCampaigns]
  } else {
    campaigns = spsdCampaigns
  }

  const selection = campaigns.filter(campaign => settings[field].indexOf(campaign.id) !== -1)

  return (
    <div className={`table-wrapper ${disabled ? 'disabled' : ''}`}>
      <div className="table-wrapper-header">
        <button
          type="button"
          className="btn btn-green"
          disabled={isLoadingSPSDCampaigns || isLoadingSBCampaigns || disabled}
          onClick={handleLoad}
        >
          Load campaigns
        </button>
        <CheckboxComponent
          label="Include Sponsored Brands campaigns"
          checked={includeSB}
          disabled={disabled}
          onChange={handleIncludeSB}
        />
      </div>
      <div className={`table-wrapper-header ${!isLoaded ? 'disabled' : ''}`}>
        <strong>Step 3)</strong>&nbsp;Select Campaigns to pull {forASINs ? 'ASINs' : 'Search Terms'} from.
      </div>
      <div className={`smart-select-wrapper ${!isLoaded ? 'disabled' : ''}`}>
        <Select
          options={campaigns}
          getOptionLabel={getCampaignName}
          getOptionValue={campaign => campaign.id}
          value={selection}
          components={{ Option, ValueContainer, LoadingIndicator }}
          isMulti
          isLoading={isLoadingSPSDCampaigns || isLoadingSBCampaigns}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select campaigns..."
          inputValue={keyword}
          filterOption={filterCampaigns}
          onChange={handleChange}
          onInputChange={handleInputChange}
        />
        <button
          type="button"
          className="btn btn-white"
          onClick={handleSelectAll}
        >
          { (settings[field].length === 0 || settings[field].length !== campaigns.length) ? 'Select All' : 'Unselect All' }
        </button>
      </div>
    </div>
  )
}

export default ExCampaigns
