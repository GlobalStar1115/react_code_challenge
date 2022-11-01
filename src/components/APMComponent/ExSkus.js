import React, { useState } from 'react'
import Select, { components }  from 'react-select'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const Option = (props) => {
  const { innerRef, innerProps, getStyles, data } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={getStyles('option', props)}
      className="sku-option"
    >
      {
        data.image !== '' ? (
          <img src={data.image} alt={data.name} />
        ) : (
          <span className="placeholder-image" />
        )
      }
      <div className="product-info">
        <span className="product-name" title={data.name}>{data.name}</span>
        <span className="product-sku">SKU: {data.sku}</span>
      </div>
    </div>
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
          All SKUs selected
          { children[1] }
        </>
      )
    } else if (selectCount >= 10) {
      contents = (
        <>
          { selectCount } SKUs selected
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

const MultiValueLabel = (props) => {
  const { data } = props
  return (
    <components.MultiValueLabel {...props}>
      <img src={data.image} className="option-label-img" alt={data.name} />
    </components.MultiValueLabel>
  )
}

const ExSkus = ({ skus, selectedSkus, isLoading, disabled, onChange }) => {
  const [keyword, setKeyword] = useState('')

  const handleSelectAll = () => {
    if (selectedSkus.length === skus.length) {
      // If all is selected, un-select all.
      onChange([])
    } else {
      // Select all.
      if (keyword === '') {
        onChange(skus)
      } else {
        onChange(skus.filter(sku => filterSKUs({ data: sku }, keyword)))
        setKeyword('')
      }
    }
  }

  const handleInputChange = (inputValue, { action }) => {
    if (action !== 'input-blur' && action !== 'menu-close' && action !== 'set-value') {
      setKeyword(inputValue)
    }
  }

  const filterSKUs = (option, input) => {
    if (!input.length) {
      return true
    }
    const lowercased = input.toLowerCase()
    const { data: { sku, asin, name } } = option
    return sku.toLowerCase().indexOf(lowercased) !== -1
      || asin.toLowerCase().indexOf(lowercased) !== -1
      || name.toLowerCase().indexOf(lowercased) !== -1
  }

  const selection = skus.filter(sku => selectedSkus.indexOf(sku.sku) !== -1)

  return (
    <div className={`step-wrapper ${disabled ? 'disabled' : ''}`}>
      <div className="step-desc">
        <strong>Step 2)</strong> Select SKU's so we can find the right campaigns to pull from.
        Then click on Load Campaigns below.
        <Whisper placement="left" trigger="hover" speaker={(
          <Tooltip>
            In this step, you are selecting which products and campaigns
            you’d like the system to pull data from in order to search
            for potential products to target with your advertising.
            Select a product, and then relevant campaigns in which
            that product appears will become available for selection as well.
          </Tooltip>
        )}>
          <InfoSvg />
        </Whisper>
      </div>
      <div className="smart-select-wrapper">
        <Select
          options={skus}
          getOptionLabel={sku => sku.sku}
          getOptionValue={sku => sku.sku}
          value={selection}
          components={{ Option, ValueContainer, MultiValueLabel }}
          isMulti
          isLoading={isLoading}
          isDisabled={disabled}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select SKUs..."
          inputValue={keyword}
          filterOption={filterSKUs}
          onChange={onChange}
          onInputChange={handleInputChange}
        />
        <button
          type="button"
          className="btn btn-white"
          disabled={disabled}
          onClick={handleSelectAll}
        >
          { (selectedSkus.length === 0 || selectedSkus.length !== skus.length) ? 'Select All' : 'Unselect All' }
        </button>
      </div>
    </div>
  )
}

export default ExSkus
