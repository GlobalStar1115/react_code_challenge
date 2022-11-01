import React, { useState, forwardRef } from 'react'
import { useDispatch, useStore } from 'react-redux'

import { buyCoaching } from '../../redux/actions/marketplace'

import CheckboxComponent from '../../components/CommonComponents/CheckboxComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'
import LoaderComponent from '../../components/CommonComponents/LoaderComponent'

import { formatValue } from '../../services/helper'

const topicList = [
  { value: 'fundamental', name: 'Fundamentals Course' },
  { value: 'playbook', name: 'Playbook Series' },
  { value: 'software', name: 'Software' },
  { value: 'waste', name: 'Optimization/Reducing Wasted Ad Spend' },
  { value: 'scaling', name: 'Expansion/Scaling' },
  { value: 'seo', name: 'SEO/Listing Optimization' },
  { value: 'creative', name: 'Creative Elements (headlines/video/images)' },
  { value: 'strategy', name: 'Strategy' },
  { value: 'profitability', name: 'Margins/Profitability' },
]

const totalPrice = 347

const CoachingInfo = forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { coin: { balance } } = store.getState()

  const [selectedTopics, setSelectedTopics] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleTopic = (topic, checked) => {
    const newTopics = [...selectedTopics]
    if (checked) {
      newTopics.push(topic)
    } else {
      newTopics.splice(newTopics.indexOf(topic), 1)
    }
    setSelectedTopics(newTopics)
  }

  const handleSubmit = () => {
    const topics = []
    topicList.forEach((topic) => {
      if (selectedTopics.indexOf(topic.value) !== -1) {
        topics.push(topic.name)
      }
    })

    setIsSubmitting(true)
    dispatch(buyCoaching(topics)).then(() => {
      setIsSubmitting(false)
      toast.show({
        title: 'Success',
        description: 'Purchased successfully.',
      })
    }).catch((error) => {
      setIsSubmitting(false)
      toast.show({
        title: 'Danger',
        description: error,
      })
    })
  }

  const renderTopics = () => {
    return topicList.map(topic => (
      <div key={topic.value} className="topic-item">
        <CheckboxComponent
          label={topic.name}
          checked={selectedTopics.indexOf(topic.value) !== -1}
          onChange={(checked) => { handleToggleTopic(topic.value, checked) }}
        />
      </div>
    ))
  }

  return (
    <div className={`coaching-info${isSubmitting ? ' loading' : ''}`} ref={ref}>
      { isSubmitting && <LoaderComponent /> }
      <div className="product-name">
        Ad Coaching: <span>2 Sessions for 347 Coins/USD</span>
      </div>
      <div className="product-description">
        Please select one or more topics that you would like to discuss on the coaching call.
      </div>
      <div className="topic-list">
        { renderTopics() }
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
          Buy Coaching
        </button>
      </div>
    </div>
  )
})

export default CoachingInfo
