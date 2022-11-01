import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import { toast } from '../CommonComponents/ToastComponent/toast'

// components
import BasicInfo from './BasicInfo'
import TargetingTypeSelector from './TargetingTypeSelector'
import SDBidSection from './SDBidSection'
import AdgroupInfo from './AdgroupInfo'
import ProductSection from './ProductSection'
import TargetingSection from './TargetingSection'
import AudienceSection from './AudienceSection'

import { createSDCampaign, getSDSuggestions } from '../../redux/actions/campaignCreator'
import { getAllCategories } from '../../redux/actions/targeting'

const targetList = [
  {
    value: 'T00020',
    name: 'Product targeting',
    description: 'Choose specific products or categories to target your ads.',
  },
  {
    value: 'T00030',
    name: 'Audiences targeting',
    description: 'Choose which audiences you want to see your ads.',
  },
]

const bidOpList = [
  {
    value: 'clicks',
    label: 'Optimize for page visits',
    description: 'We\'ll optimize your bids for higher click-through rates. '
      + 'Drive product consideration by showing your ads to shoppers more likely to click on your ad.',
  },
  {
    value: 'conversions',
    label: 'Optimize for conversions',
    description: 'We\'ll optimize your bids for higher conversion rates. '
      + 'Drive sales by showing your ad to shoppers more likely to purchase your product.',
  },
]

const SDCampaignCreator = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const { header, campaignCreator } = store.getState()
  const { currentUserId } = header
  const { isCreating } = campaignCreator

  const [basicInfo, setBasicInfo] = useState({
    name: '',
    dailyBudget: 1,
    acos: 25,
    startDate: new Date(),
    endDate: null,
  })

  const [bidInfo, setBidInfo] = useState({
    bidOp: bidOpList[0],
    defaultBid: 0.45,
  })

  const [adgroupName, setAdgroupName] = useState('Ad group 1')
  const [target, setTarget] = useState('T00020')

  const [products, setProducts] = useState([])
  const [targetings, setTargetings] = useState([])

  useEffect(() => {
    dispatch(getAllCategories())
  }, [currentUserId]) // eslint-disable-line

  const parseTargetings = () => {
    const targets = []
    targetings.forEach((targeting) => {
      const payload = {
        bid: targeting.bid,
        expression: [],
      }
      switch (targeting.type) {
        case 'category':
          payload.expression.push({
            type: 'asinCategorySameAs',
            value: targeting.id.toString(),
          })
          break
        case 'product':
          payload.expression.push({
            type: 'asinSameAs',
            value: targeting.ASIN,
          })
          break
        case 'refine':
          payload.expression.push({
            type: 'asinCategorySameAs',
            value: targeting.id.toString(),
          })

          if (targeting.brandId) {
            payload.expression.push({
              type: 'asinBrandSameAs',
              value: targeting.brandId.toString(),
            })
          }

          if (targeting.ratingValue) {
            payload.expression.push({
              type: 'asinReviewRatingBetween',
              value: targeting.ratingValue,
            })
          }

          if (targeting.priceFrom && targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceBetween',
              value: `${targeting.priceFrom}-${targeting.priceTo}`,
            })
          } else if (targeting.priceFrom && !targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceGreaterThan',
              value: targeting.priceFrom,
            })
          } else if (!targeting.priceFrom && targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceLessThan',
              value: targeting.priceTo,
            })
          }
          break
        case 'audience_category':
          payload.expression.push({
            type: 'views',
            value: [
              {
                type: 'asinCategorySameAs',
                value: targeting.id.toString(),
              },
            ],
          })
          break
        case 'audience_product':
          payload.expression.push({
            type: 'views',
            value: [
              {
                type: targeting.id,
              },
            ],
          })
          break
        case 'audience_refine':
          const values = []
          values.push({
            type: 'asinCategorySameAs',
            value: targeting.id.toString(),
          })

          if (targeting.brandId) {
            values.push({
              type: 'asinBrandSameAs',
              value: targeting.brandId.toString(),
            })
          }

          if (targeting.ratingValue) {
            values.push({
              type: 'asinReviewRatingBetween',
              value: targeting.ratingValue,
            })
          }

          if (targeting.priceFrom && targeting.priceTo) {
            values.push({
              type: 'asinPriceBetween',
              value: `${targeting.priceFrom}-${targeting.priceTo}`,
            })
          } else if (targeting.priceFrom && !targeting.priceTo) {
            values.push({
              type: 'asinPriceGreaterThan',
              value: targeting.priceFrom,
            })
          } else if (!targeting.priceFrom && targeting.priceTo) {
            values.push({
              type: 'asinPriceLessThan',
              value: targeting.priceTo,
            })
          }

          payload.expression.push({
            type: 'views',
            value: values,
          })
          break
        case 'audience':
          payload.expression.push({
            type: 'audience',
            value: [
              {
                type: 'audienceSameAs',
                value: targeting.id.toString(),
              },
            ],
          })
          break
        default:
          break
      }
      if ((target === 'T00020' && ['category', 'refine', 'product'].indexOf(targeting.type) !== -1)
        || (target === 'T00030'
          && ['audience_category', 'audience_refine', 'audience_product', 'audience'].indexOf(targeting.type) !== -1)) {
        targets.push(payload)
      }
    })
    return targets
  }

  const handleBasicInfoChange = (name, value) => {
    const newInfo = Object.assign({}, basicInfo, {
      [name]: value,
    })
    setBasicInfo(newInfo)
  }

  const handleBidChange = (name, value) => {
    const newInfo = Object.assign({}, bidInfo, {
      [name]: value,
    })
    setBidInfo(newInfo)
  }

  const handleProductsSelect = (products, reload = false) => {
    setProducts(products)

    if (reload && products.length) {
      dispatch(getSDSuggestions(target, products.map(product => product.asin)))
    }
  }

  const handleSave = () => {
    if (!basicInfo.name) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the campaign name.',
      })
      return
    }

    const newCampaign = {
      name: basicInfo.name,
      budget: basicInfo.dailyBudget,
      startDate: moment(basicInfo.startDate).format('YYYYMMDD'),
      tactic: target,
    }

    if (basicInfo.endDate !== '' && basicInfo.startDate < basicInfo.endDate)  {
      newCampaign.endDate = moment(basicInfo.endDate).format('YYYYMMDD')
    }

    dispatch(createSDCampaign({
      campaigns: [newCampaign],
      acos: basicInfo.acos,
      adGroups: [{
        name: adgroupName,
        defaultBid: bidInfo.defaultBid,
        bidOptimization: bidInfo.bidOp.value,
        tactic: target,
      }],
      productAds: products.map(product => ({
        sku: product.sku,
        asin: product.asin,
      })),
      targets: parseTargetings(),
    })).then(() => {
      toast.show({
        title: 'Success',
        description: 'The campaign has been created successfully.',
      })

      history.push('/dashboard')
    }).catch((description) => {
      toast.show({
        title: 'Danger',
        description,
      })
    })
  }

  return (
    <div className={`sd-campaign-creator${isCreating ? ' loading' : ''}`}>
      { isCreating && <LoaderComponent /> }
      <div className="page-header">
        <div className="page-title">Create Sponsored Display Campaign</div>
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Launch Campaign
        </button>
      </div>
      <div className="page-content">
        <BasicInfo
          info={basicInfo}
          isForSD
          onChange={handleBasicInfoChange}
        />
        <TargetingTypeSelector
          targetList={targetList}
          target={target}
          onChange={setTarget}
        />
        <SDBidSection
          info={bidInfo}
          dailyBudget={basicInfo.dailyBudget}
          opList={bidOpList}
          onChange={handleBidChange}
        />
        <AdgroupInfo
          name={adgroupName}
          onChange={setAdgroupName}
        />
        <ProductSection
          products={products}
          onChange={handleProductsSelect}
        />
        {
          target === 'T00020' && (
            <TargetingSection
              targetings={targetings}
              dailyBudget={basicInfo.dailyBudget}
              isForSD
              onChange={setTargetings}
            />
          )
        }
        {
          target === 'T00030' && (
            <AudienceSection
              targetings={targetings}
              dailyBudget={basicInfo.dailyBudget}
              defaultBid={bidInfo.defaultBid}
              onChange={setTargetings}
            />
          )
        }
      </div>
      <div className="page-footer">
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Launch Campaign
        </button>
      </div>
    </div>
  )
}

export default SDCampaignCreator
