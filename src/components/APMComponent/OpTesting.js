import React, { useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import Select from 'react-select'
import { Tooltip, Whisper } from 'rsuite'
import moment from 'moment'

import { getApTestResults } from '../../redux/actions/ap'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'
import SubSection from './SubSection'
import OpTestingMetric from './OpTestingMetric'

const dayList = [
  { value: 14, label: '14 days' },
  { value: 21, label: '21 days' },
  { value: 28, label: '28 days' },
]

// FIXME: Show symbol of currently selected currency.
const OpTesting = ({ campaign, settings, onChange, ...props}) => {
  const dispatch = useDispatch()
  const store = useStore()

  const { ap: { campaignId, testResults, isLoadingTestResults } } = store.getState()

  // Load testing results.
  useEffect(() => {
    // FIXME: `split_test_start_day` should be always non-null,
    // if `split_test_isactive` is TRUE. Need to sanitize
    // DB records to remove `dirty` states.
    if (settings.split_test_isactive
      && settings.split_test_start_day
      && !testResults
      && !isLoadingTestResults) {
      dispatch(getApTestResults({
        campaignId,
        start: settings.split_test_start_day,
        duration: settings.split_test_day
      }))
    }
  }, [ // eslint-disable-line
    settings.split_test_isactive,
    settings.split_test_start_day,
    settings.split_test_day,
  ])

  const daySelected = dayList.find(day => day.value === settings.split_test_day)

  let revenueA = 0
  let revenueB = 0
  let costA = 0
  let costB = 0
  let impressionA = 0
  let impressionB = 0
  let clickA = 0
  let clickB = 0
  let ctrA = 0
  let ctrB = 0
  let orderA = 0
  let orderB = 0
  let conversionA = 0
  let conversionB = 0
  let acosA = 0
  let acosB = 0
  // FIXME: Take currency and its rate into account
  // when calculating money amounts.
  if (testResults) {
    const resultA = testResults[0][0]
    const resultB = testResults[1][0]

    revenueA = parseFloat(resultA.revenue || 0)
    revenueB = parseFloat(resultB.revenue || 0)
    costA = parseFloat(resultA.cost || 0)
    costB = parseFloat(resultB.cost || 0)
    impressionA = parseInt(resultA.impressions || 0, 10)
    impressionB = parseInt(resultB.impressions || 0, 10)
    clickA = parseInt(resultA.clicks || 0, 10)
    clickB = parseInt(resultB.clicks || 0, 10)
    ctrA = impressionA ? clickA / impressionA * 100 : 0
    ctrB = impressionB ? clickB / impressionB * 100 : 0
    orderA = parseInt(resultA.orders || 0, 10)
    orderB = parseInt(resultB.orders || 0, 10)
    conversionA = clickA ? orderA / clickA * 100 : 0
    conversionB = clickB ? orderB / clickB * 100 : 0
    acosA = revenueA ? costA / revenueA * 100 : 0
    acosB = revenueB ? costB / revenueB * 100 : 0
  }

  const handleStart = () => {
    onChange('split_test_isactive', true)
    onChange('split_test_start_day', moment().format('YYYY-MM-DD'))
  }

  const renderHeader = () => {
    if (!settings.split_test_isactive) {
      return (
        <div className="testing-header">
          <label className="testing-label">
            A/B test for
          </label>
          <div className="testing-header-wrapper">
            <Select
              className="testing-day-selector"
              options={dayList}
              value={daySelected}
              onChange={(selected) => { onChange('split_test_day', selected.value) }}
            />
            <div className="split-test-email-wrapper">
              <CheckboxComponent
                label="Send email when A/B test done"
                checked={settings.split_test_send_email}
                onChange={(checked) => { onChange('split_test_send_email', checked) }}
              />
              <Whisper placement="left" trigger="hover" speaker={(
                <Tooltip>
                  Email will be sent three days after test completion to ensure data accuracy.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
            <button
              type="button"
              className="btn btn-white"
              onClick={handleStart}
            >
              Start
            </button>
          </div>
        </div>
      )
    }

    const startDate = moment(settings.split_test_start_day)
    const endDate = moment(startDate).add(settings.split_test_day, 'days')

    return (
      <div className="testing-header">
        <div className="testing-header-wrapper">
          <div className="testing-details">
            <div className="testing-details-field">
              <div className="field-name">Start date</div>
              <div className="field-value">
                { startDate.format('MM/DD/YYYY') }
              </div>
            </div>
            <div className="testing-details-field">
              <div className="field-name">End date</div>
              <div className="field-value">
                { endDate.format('MM/DD/YYYY') }
              </div>
            </div>
            <div className="testing-details-field">
              <div className="field-name">Status</div>
              <div className="field-value">
                { endDate.isAfter() ? 'Running' : 'Done' }
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-red"
            onClick={() => { onChange('split_test_isactive', false) }}
          >
            Stop
          </button>
        </div>
      </div>
    )
  }

  return (
    <SubSection
      name="A/B Testing"
      tooltip={'Looking to see how a smart pilot update impacted your ads performance? '
        + 'Set up an A/B test and compare the before and after results. '
        + 'Choose the amount of days and once the test is completed, '
        + 'we’ll compare results to the same amount of days prior to the test start.'}
      {...props}
    >
      { isLoadingTestResults && <LoaderComponent /> }
      { renderHeader() }
      <div className="testing-metric-list">
        <OpTestingMetric
          name="Gross revenue"
          type="money"
          valueA={revenueA}
          valueB={revenueB}
        />
        <OpTestingMetric
          name="Ad spend"
          type="money"
          valueA={costA}
          valueB={costB}
        />
        <OpTestingMetric
          name="Impressions"
          type="int"
          valueA={impressionA}
          valueB={impressionB}
        />
        <OpTestingMetric
          name="Clicks"
          type="int"
          valueA={clickA}
          valueB={clickB}
        />
      </div>
      <div className="testing-metric-list">
        <OpTestingMetric
          name="CTR (%)"
          type="percent"
          valueA={ctrA}
          valueB={ctrB}
        />
        <OpTestingMetric
          name="Orders"
          type="int"
          valueA={orderA}
          valueB={orderB}
        />
        <OpTestingMetric
          name="Conversion (%)"
          type="percent"
          valueA={conversionA}
          valueB={conversionB}
        />
        <OpTestingMetric
          name="ACoS (%)"
          type="percent"
          valueA={acosA}
          valueB={acosB}
        />
      </div>
    </SubSection>
  )
}

export default OpTesting
