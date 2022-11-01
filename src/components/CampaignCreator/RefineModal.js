import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Modal, Tooltip, Whisper, RangeSlider } from 'rsuite'
import Select  from 'react-select'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import { getBrandRecommendations } from '../../redux/actions/targeting'

const RefineModal = ({ show, category, onRefine, onClose }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const { targeting: { isRefineBrandsLoading, refineBrands } } = store.getState()

  const [selectedBrands, setSelectedBrands] = useState([])
  const [minValue, setMinValue] = useState('')
  const [maxValue, setMaxValue] = useState('')
  const [rating, setRating] = useState([0, 5])

  useEffect(() => {
    if (category) {
      dispatch(getBrandRecommendations({
        categoryId: category.id,
      }, true))
    }
  }, [category]) // eslint-disable-line

  const handleRefine = () => {
    selectedBrands.forEach((brand) => {
      onRefine(category, {
        brandId: brand.id,
        brandName: brand.name,
        priceFrom: minValue !== '' ? minValue : null,
        priceTo: maxValue !== '' ? maxValue : null,
        ratingValue: (rating[1] - rating[0]) !== 5 ? `${rating[0]}-${rating[1]}` : null,
      })
    })
    onClose()
  }

  return (
    <Modal className="refine-modal" backdrop="static" show={show}>
      <Modal.Header onHide={() => { onClose() }}>
        <Modal.Title>
          Refine category: { category ? category.name || category.na : '' }
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              Refine your targeting by specific brands, price range, and star ratings.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="field-row">
          <div className="field-wrapper">
            <div className="field-name">
              Brand
            </div>
            <Select
              options={refineBrands || []}
              getOptionLabel={brand => brand.name}
              getOptionValue={brand => brand.id}
              value={selectedBrands}
              isMulti
              isLoading={isRefineBrandsLoading}
              closeMenuOnSelect={false}
              placeholder="Select Brands..."
              onChange={(option) => { setSelectedBrands(option) }}
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field-wrapper">
            <div className="field-name">
              Price Range
            </div>
            <div className="price-range-input">
              <input
                type="number"
                placeholder="No min"
                value={minValue}
                onChange={(event) => { setMinValue(event.target.value) }}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="No max"
                value={maxValue}
                onChange={(event) => { setMaxValue(event.target.value) }}
              />
            </div>
          </div>
        </div>
        <div className="field-row">
          <div className="field-wrapper">
            <div className="field-name">
              Review star ratings
            </div>
            <RangeSlider
              min={0}
              max={5}
              graduated
              progress
              renderMark={mark => mark}
              value={rating}
              onChange={setRating}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="rs-btn rs-btn-primary"
          disabled={!selectedBrands.length}
          onClick={handleRefine}
        >
          Refine
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default RefineModal
