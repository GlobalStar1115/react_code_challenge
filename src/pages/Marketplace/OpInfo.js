import React, { useState, forwardRef } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Radio, RadioGroup } from 'rsuite'

import { buyOp } from '../../redux/actions/marketplace'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'

import { formatValue } from '../../services/helper'

const totalPrice = 197

const toleranceOptions = {
  aggressive: 'I am aggressive',
  moderate: 'I am moderate',
  conservative: 'I am conservative',
}

const campaignNumberOptions = {
  less_5: 'Less than 5',
  5_15: '5 - 15',
  more_15: 'More than 15',
  not_sure: 'Not sure',
}

const OpInfo = forwardRef((props, ref) => {
  const dispatch = useDispatch()

  const store = useStore()

  const { coin: { balance } } = store.getState()

  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('moderate')
  const [asin, setAsin] = useState('')
  const [targetAcos, setTargetAcos] = useState('')
  const [breakevenAcos, setBreakevenAcos] = useState('')
  const [goal, setGoal] = useState('')
  const [currentAcos, setCurrentAcos] = useState('')
  const [brandRegistered, setBrandRegistered] = useState('')
  const [link, setLink] = useState('')
  const [brandCampaigns, setBrandCampaigns] = useState('yes')
  const [campaignNumber, setCampaignNumber] = useState('not_sure')
  const [competitors, setCompetitors] = useState('')
  const [namingStructure, setNamingStructure] = useState('')
  const [portfolio, setPortfolio] = useState('')
  const [keywords, setKeywords] = useState('')
  const [adgroups, setAdgroups] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (monthlyBudget === '') {
      toast.show({
        title: 'Danger',
        description: 'Please enter your monthly budget.',
      })
      return
    }

    if (goal === '') {
      toast.show({
        title: 'Danger',
        description: 'Please enter your goals for the next 6 months along with any pain points.',
      })
      return
    }

    const answers = []
    answers.push({
      q: 'What is your monthly Amazon ad spend budget?',
      a: monthlyBudget,
    })
    answers.push({
      q: 'What is your risk tolerance?',
      a: toleranceOptions[riskTolerance],
    })
    if (asin !== '') {
      answers.push({
        q: 'What is the ASIN you want us to work on?',
        a: asin,
      })
    }
    if (targetAcos !== '') {
      answers.push({
        q: 'What is your Target ACoS?',
        a: targetAcos,
      })
    }
    if (breakevenAcos !== '') {
      answers.push({
        q: 'What is your breakeven ACoS?',
        a: breakevenAcos,
      })
    }
    answers.push({
      q: 'Please share your goals for the next 6 months along with any pain points.',
      a: goal,
    })
    if (currentAcos !== '') {
      answers.push({
        q: 'What is your current ROAS or ACoS?',
        a: currentAcos,
      })
    }
    if (brandRegistered !== '') {
      answers.push({
        q: 'Is your brand registered on Amazon?',
        a: brandRegistered === 'yes' ? 'Yes' : 'No',
      })
    }
    if (link !== '') {
      answers.push({
        q: 'If you have a brand registry, please share a link to your storefront. '
          + 'If you don\'t have a storefront, please share a link to one of your products.',
        a: link,
      })
    }
    answers.push({
      q: 'Are you running Sponsored Brand Campaigns?',
      a: brandCampaigns === 'yes' ? 'Yes' : 'No',
    })
    answers.push({
      q: 'Approximately how many campaigns are you currently running?',
      a: campaignNumberOptions[campaignNumber],
    })
    if (competitors !== '') {
      answers.push({
        q: 'Who are your 3 main competitors?',
        a: competitors,
      })
    }
    if (namingStructure !== '') {
      answers.push({
        q: 'Is there a naming structure?',
        a: namingStructure,
      })
    }
    if (portfolio !== '') {
      answers.push({
        q: 'Are portfolios being utilized?',
        a: portfolio,
      })
    }
    if (keywords !== '') {
      answers.push({
        q: 'Are there any keywords you want to rank aggresively?',
        a: keywords,
      })
    }
    if (adgroups !== '') {
      answers.push({
        q: 'How are Ad Groups used?',
        a: adgroups,
      })
    }

    setIsSubmitting(true)
    dispatch(buyOp(answers)).then(() => {
      setIsSubmitting(false)
      toast.show({
        title: 'Success',
        description: ' Thank you! Your blitz is underway! You will hear back from us within 7 business days.',
      })
    }).catch((error) => {
      setIsSubmitting(false)
      toast.show({
        title: 'Danger',
        description: error,
      })
    })
  }

  return (
    <div className={`op-info${isSubmitting ? ' loading' : ''}`} ref={ref}>
      { isSubmitting && <LoaderComponent /> }
      <div className="product-name">
        Optimization Blitz Questionnaire: <span>197 Coins/USD</span>
      </div>
      <div className="form-wrapper">
        <div className="field-wrapper">
          <label>
            What is your monthly Amazon ad spend budget?
            <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g 1000 USD"
            required
            value={monthlyBudget}
            onChange={(event) => { setMonthlyBudget(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            What is your risk tolerance?
            <span className="required">*</span>
          </label>
          <RadioGroup
            value={riskTolerance}
            onChange={setRiskTolerance}
          >
            <Radio value="aggressive">I am aggressive</Radio>
            <Radio value="moderate">I am moderate</Radio>
            <Radio value="conservative">I am conservative</Radio>
          </RadioGroup>
        </div>
        <div className="field-wrapper">
          <label>
            What is the ASIN you want us to work on?
          </label>
          <input
            type="text"
            placeholder="Please enter the ASIN here. If you purchased more than one Blitz, please enter the additional ASINs."
            value={asin}
            onChange={(event) => { setAsin(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            What is your Target ACoS?
          </label>
          <input
            type="text"
            placeholder="e.g 40%"
            value={targetAcos}
            onChange={(event) => { setTargetAcos(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            What is your breakeven ACoS?
          </label>
          <div className="field-description">
            This is the Acos at which you are breakeven after calculating all your product costs.
          </div>
          <input
            type="text"
            value={breakevenAcos}
            onChange={(event) => { setBreakevenAcos(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Please share your goals for the next 6 months along with any pain points.
            <span className="required">*</span>
          </label>
          <div className="field-description">
            Target Acos, Seasonality? Conversion? Any Specific PPC challenges.
          </div>
          <textarea
            placeholder="Should be one up-to 5 lines"
            required
            value={goal}
            onChange={(event) => { setGoal(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            What is your current ROAS or ACoS?
          </label>
          <input
            type="text"
            placeholder="e.g 3.5 ROAS or 35% ACoS"
            value={currentAcos}
            onChange={(event) => { setCurrentAcos(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Is your brand registered on Amazon?
          </label>
          <RadioGroup
            value={brandRegistered}
            onChange={setBrandRegistered}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>
        </div>
        <div className="field-wrapper">
          <label>
            If you have a brand registry, please share a link to your storefront.
            If you don't have a storefront, please share a link to one of your products.
          </label>
          <input
            type="text"
            placeholder="e.g https://www.amazon.com/stores/node/99384885847384"
            value={link}
            onChange={(event) => { setLink(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Are you running Sponsored Brand Campaigns?
            <span className="required">*</span>
          </label>
          <RadioGroup
            value={brandCampaigns}
            onChange={setBrandCampaigns}
          >
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </RadioGroup>
        </div>
        <div className="field-wrapper">
          <label>
            Approximately how many campaigns are you currently running?
            <span className="required">*</span>
          </label>
          <RadioGroup
            value={campaignNumber}
            onChange={setCampaignNumber}
          >
            <Radio value="less_5">Less than 5</Radio>
            <Radio value="5_15">5 - 15</Radio>
            <Radio value="more_15">More than 15</Radio>
            <Radio value="not_sure">Not sure</Radio>
          </RadioGroup>
        </div>
        <div className="field-wrapper">
          <label>
            Who are your 3 main competitors?
          </label>
          <textarea
            value={competitors}
            onChange={(event) => { setCompetitors(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Is there a naming structure?
          </label>
          <textarea
            placeholder="If yes, please copy an example and explain. This will help us understand your campaigns and there objectives."
            value={namingStructure}
            onChange={(event) => { setNamingStructure(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Are portfolios being utilized?
          </label>
          <textarea
            placeholder="Please explain the portfoflio division, is it by product, variation etc?"
            value={portfolio}
            onChange={(event) => { setPortfolio(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Are there any keywords you want to rank aggresively?
          </label>
          <textarea
            placeholder="Please paste a list of keywords here."
            value={keywords}
            onChange={(event) => { setKeywords(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            How are Ad Groups used?
          </label>
          <textarea
            placeholder="Do you combine multiple match types together in one ad group? Have multiple ad groups in each campaign?"
            value={adgroups}
            onChange={(event) => { setAdgroups(event.target.value) }}
          />
        </div>
      </div>
      <div className="purchase-section">
        <div className="price-wrapper">
          <span className="coin-balance">
            <span className="coin-label">
            </span>
            { formatValue(balance, 'number', 0) }
          </span>
          <span className="additional-cost">
            + { formatValue(totalPrice - balance, 'currency', 2, '$') }
          </span>
          <span className="conversion-wrapper">
            <span className="conversion-label">
              Conversion:
            </span>
            <span className="conversion-value">
              <span className="coin-label">
              </span>
              1 = 1 USD
            </span>
          </span>
        </div>
        <button
          type="button"
          className="btn btn-red"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          Buy Optimization Blitz
        </button>
      </div>
    </div>
  )
})

export default OpInfo
