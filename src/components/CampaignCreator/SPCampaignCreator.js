import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import { toast } from '../CommonComponents/ToastComponent/toast'

// components
import BasicInfo from './BasicInfo'
import TargetingTypeSelector from './TargetingTypeSelector'
import SPBidSection from './SPBidSection'
import AdgroupInfo from './AdgroupInfo'
import ProductSection from './ProductSection'
import ManualTargetingSelector from './ManualTargetingSelector'
import KeywordSection from './KeywordSection'
import NegativeKeywordSection from './NegativeKeywordSection'
import TargetingSection from './TargetingSection'
import NegativeTargetingSection from './NegativeTargetingSection'

import { createSPCampaign, getSPSuggestions, getSuggestedKeywordBids } from '../../redux/actions/campaignCreator'
import { getAllCategories } from '../../redux/actions/targeting'

const targetList = [
  {
    value: 'automatic',
    name: 'Automatic targeting',
    description: 'Save time and let Amazon target your ads to all relevant customer searches based on your product info.',
  },
  {
    value: 'manual',
    name: 'Manual targeting',
    description: 'Your ads appear when a customer\'s search matches keywords/targets that you provide.',
  },
]

const bidStrategyList = [
  {
    value: 'legacyForSales',
    label: 'Dynamic bids - down only',
    description: 'We’ll lower your bids in real time when your ad may be less likely to convert to a sale.',
  },
  {
    value: 'autoForSales',
    label: 'Dynamic bids - up and down',
    description: 'We’ll raise your bids (by a maximum of 100%) in real time when your ad may be more likely '
      + 'to convert to a sale, and lower your bids when less likely to convert to a sale.',
  },
  {
    value: 'manual',
    label: 'Fixed bids',
    description: 'We’ll use your exact bid and any manual adjustments you set, and won’t change your bids based on likelihood of a sale.',
  },
]

const SPCampaignCreator = () => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const { header, campaignCreator, portfolio } = store.getState()
  const { currentUserId } = header
  const { isCreating, isSuggestedBidsLoading, suggestedBids } = campaignCreator
  const { listPortfolios } = portfolio

  const [basicInfo, setBasicInfo] = useState({
    name: '',
    portfolio: '',
    dailyBudget: 1,
    acos: 25,
    startDate: new Date(),
    endDate: null,
  })

  const [bidInfo, setBidInfo] = useState({
    strategy: bidStrategyList[0],
    defaultBid: 0.75,
    topSearchBid: 0,
    productPagesBid: 0,
  })

  const [adgroupName, setAdgroupName] = useState('Ad group 1')
  const [target, setTarget] = useState('manual')
  const [manualTarget, setManualTarget] = useState('keyword')

  const [products, setProducts] = useState([])
  const [keywords, setKeywords] = useState([])
  const [negativeKeywords, setNegativeKeywords] = useState([])
  const [targetings, setTargetings] = useState([])
  const [negativeTargetings, setNegativeTargetings] = useState([])

  useEffect(() => {
    dispatch(getAllCategories())
  }, [currentUserId]) // eslint-disable-line

  useEffect(() => {
    if (isSuggestedBidsLoading || !suggestedBids || suggestedBids.length === 0) {
      return
    }

    setKeywords(keywords.map((keyword) => {
      const suggestedBid = suggestedBids.filter(bid => (
        bid.keywordText === keyword.keywordText && bid.matchType === keyword.matchType
      ))
      if (suggestedBid.length) {
        return {
          ...keyword,
          suggestedBid: suggestedBid[0].suggestedBid,
        }
      }
      return keyword
    }))
  }, [suggestedBids, isSuggestedBidsLoading]) // eslint-disable-line

  const getBiddingStrategy = () => {
    const bidding = {
      strategy: bidInfo.strategy.value,
      adjustments: [],
    }

    if (bidInfo.topSearchBid) {
      bidding.adjustments.push({
        predicate: 'placementTop',
        percentage: parseInt(bidInfo.topSearchBid, 10),
      })
    }

    if (bidInfo.productPagesBid) {
      bidding.adjustments.push({
        predicate: 'placementProductPage',
        percentage: parseInt(bidInfo.productPagesBid, 10),
      })
    }
    return bidding
  }

  const getProductTargets = () => {
    const targets = []
    targetings.forEach((targeting) => {
      const payload = {
        expressionType: 'manual',
        state: 'enabled',
        bid: targeting.bid,
        expression: [],
        expressionResolve: [],
      }
      switch (targeting.type) {
        case 'category':
          payload.expression.push({
            type: 'asinCategorySameAs',
            value: targeting.id,
          })
          payload.expressionResolve.push({
            type: 'asinCategorySameAs',
            value: targeting.name,
          })
          break
        case 'product':
          payload.expression.push({
            type: 'asinSameAs',
            value: targeting.ASIN,
          })
          payload.expressionResolve.push({
            type: 'asinSameAs',
            value: targeting.ASIN,
          })
          break
        case 'refine':
          payload.expression.push({
            type: 'asinCategorySameAs',
            value: targeting.id,
          })
          payload.expressionResolve.push({
            type: 'asinCategorySameAs',
            value: targeting.name,
          })

          if (targeting.brandId) {
            payload.expression.push({
              type: 'asinBrandSameAs',
              value: targeting.brandId,
            })
            payload.expressionResolve.push({
              type: 'asinBrandSameAs',
              value: targeting.brandName,
            })
          }

          if (targeting.ratingValue) {
            payload.expression.push({
              type: 'asinReviewRatingBetween',
              value: targeting.ratingValue,
            })
            payload.expressionResolve.push({
              type: 'asinReviewRatingBetween',
              value: targeting.ratingValue,
            })
          }

          if (targeting.priceFrom && targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceBetween',
              value: `${targeting.priceFrom}-${targeting.priceTo}`,
            })
            payload.expressionResolve.push({
              type: 'asinPriceBetween',
              value: `${targeting.priceFrom}-${targeting.priceTo}`,
            })
          } else if (targeting.priceFrom && !targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceGreaterThan',
              value: targeting.priceFrom,
            })
            payload.expressionResolve.push({
              type: 'asinPriceGreaterThan',
              value: targeting.priceFrom,
            })
          } else if (!targeting.priceFrom && targeting.priceTo) {
            payload.expression.push({
              type: 'asinPriceLessThan',
              value: targeting.priceTo,
            })
            payload.expressionResolve.push({
              type: 'asinPriceLessThan',
              value: targeting.priceTo,
            })
          }
          break
        default:
          break
      }
      targets.push(payload)
    })
    return targets
  }

  const getNegativeProductTargets = () => {
    const negatives = []
    negativeTargetings.forEach(product => {
      const negativeProduct = {
        expressionType: 'manual',
        state: 'enabled',
        expression: [],
      }
      if (product.type === 'brand') {
        negativeProduct.expression.push({
          type: 'asinBrandSameAs',
          value: product.id,
        })
      } else if (product.type === 'product') {
        negativeProduct.expression.push({
          type: 'asinSameAs',
          value: product.ASIN,
        })
      }
      negatives.push(negativeProduct)
    })
    return negatives
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
      dispatch(getSPSuggestions(products.map(product => product.asin)))
    }
  }

  const handleKeywordsSelect = (keywords, reload = false, newKeywords = []) => {
    setKeywords(keywords)

    if (reload && newKeywords.length) {
      dispatch(getSuggestedKeywordBids(newKeywords))
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
      startDate: moment(basicInfo.startDate).format('YYYYMMDD'),
      campaignType: 'sponsoredProducts',
      targetingType: target,
      dailyBudget: basicInfo.dailyBudget,
      state: 'enabled',
      portfolioId: basicInfo.portfolio.portfolio_id,
      bidding: getBiddingStrategy(),
    }

    if (basicInfo.endDate !== '' && basicInfo.startDate < basicInfo.endDate)  {
      newCampaign.endDate = moment(basicInfo.endDate).format('YYYYMMDD')
    }

    const productAds = []
    const productAdWithAsins = []

    products.forEach((product) => {
      productAds.push({
        sku: product.sku,
        state: 'enabled',
      })

      productAdWithAsins.push({
        asin: product.asin,
        sku: product.sku,
        state: 'enabled',
      })
    })

    const campaignData = {
      campaigns: [newCampaign],
      acos: basicInfo.acos,
      adGroups: [{
        name: adgroupName,
        defaultBid: bidInfo.defaultBid,
        state: 'enabled',
      }],
      productAdWithAsins,
      productAds,
    }

    if (manualTarget === 'product') {
      campaignData.targets = getProductTargets()
      campaignData.negatives = getNegativeProductTargets()
    } else {
      campaignData.keywords = keywords.map(kw => ({
        keywordText: kw.keywordText !== '(_targeting_auto_)' && kw.keywordText !== '' ? kw.keywordText : kw.search,
        matchType: kw.matchType.toLowerCase(),
        bid: kw.keywordBid,
        state: 'enabled',
      }))
      campaignData.negativeKws = negativeKeywords.map(kw => ({
        keywordText: kw.keywordText !== '(_targeting_auto_)' && kw.keywordText !== '' ? kw.keywordText : kw.search,
        matchType: kw.matchType.toLowerCase(),
        bid: kw.keywordBid,
        state: 'enabled',
      }))
    }

    dispatch(createSPCampaign(campaignData)).then(() => {
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

  const renderManualSections = () => {
    if (target !== 'manual') {
      return null
    }

    return (
      <>
        <ManualTargetingSelector
          manualTarget={manualTarget}
          onChange={setManualTarget}
        />
        {
          manualTarget === 'keyword' && (
            <>
              <KeywordSection
                keywords={keywords}
                onChange={handleKeywordsSelect}
              />
              <NegativeKeywordSection
                negativeKeywords={negativeKeywords}
                bidInfo={bidInfo}
                onChange={setNegativeKeywords}
              />
            </>
          )
        }
        {
          manualTarget === 'product' && (
            <>
              <TargetingSection
                targetings={targetings}
                dailyBudget={basicInfo.dailyBudget}
                onChange={setTargetings}
              />
              <NegativeTargetingSection
                negativeTargetings={negativeTargetings}
                onChange={setNegativeTargetings}
              />
            </>
          )
        }
      </>
    )
  }

  return (
    <div className={`sp-campaign-creator${isCreating ? ' loading' : ''}`}>
      { isCreating && <LoaderComponent /> }
      <div className="page-header">
        <div className="page-title">Create Sponsored Product Campaign</div>
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
          portfolios={listPortfolios}
          onChange={handleBasicInfoChange}
        />
        <TargetingTypeSelector
          targetList={targetList}
          target={target}
          onChange={setTarget}
        />
        <SPBidSection
          info={bidInfo}
          strategyList={bidStrategyList}
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
        { renderManualSections() }
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

export default SPCampaignCreator
