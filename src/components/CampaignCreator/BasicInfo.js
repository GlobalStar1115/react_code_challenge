import React from 'react'
import { DatePicker, Tooltip, Whisper } from 'rsuite'
import Select from 'react-select'
import moment from 'moment'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

const BasicInfo = ({ info, portfolios = [], isForSD, onChange }) => (
  <>
    <div className="field-row">
      <div className="field-wrapper">
        <div className="field-name">
          Name
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              A campaign name is only visible to you, so choose a name
              that you can easily identify and refer back to later.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <input
          type="text"
          value={info.name}
          onChange={(event) => { onChange('name', event.target.value) }}
        />
      </div>
      {
        !isForSD ? (
          <div className="field-wrapper">
            <div className="field-name">
              Portfolio
              <Whisper placement="right" trigger="hover" speaker={(
                <Tooltip>
                  Portfolios are a group of campaigns that can have a budget cap.
                  Portfolios enable you to group and organize campaigns.
                </Tooltip>
              )}>
                <InfoSvg />
              </Whisper>
            </div>
            <Select
              classNamePrefix="portfolio-selector"
              options={portfolios}
              getOptionValue={option => option.portfolio_id}
              getOptionLabel={option => option.name}
              value={info.portfolio}
              onChange={(option) => { onChange('portfolio', option) }}
            />
          </div>
        ) : (
          <div className="field-wrapper" />
        )
      }
    </div>
    <div className="field-row">
      <div className="field-wrapper">
        <div className="field-name">
          Daily Budget
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              The amount that you're willing to spend on this campaign each day.
              If the campaign spends less than your daily budget, that amount can be used
              to increase your daily budget up to 10% on other days of the calendar month.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <input
          type="number"
          value={info.dailyBudget}
          onChange={(event) => { onChange('dailyBudget', event.target.value) }}
        />
      </div>
      <div className="field-wrapper">
        <div className="field-name">
          Target ACoS
        </div>
        <input
          type="number"
          value={info.acos}
          onChange={(event) => { onChange('acos', event.target.value) }}
        />
      </div>
      <div className="field-wrapper">
        <div className="field-name">
          Start Date
          <Whisper placement="right" trigger="hover" speaker={(
            <Tooltip>
              This is the date your campaign will start. You can set
              a future start date to launch your ad campaign at a later date.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <DatePicker
          value={info.startDate}
          format="MMM D, YYYY"
          oneTap
          disabledDate={date => moment(date).isBefore(moment().startOf('day')) }
          onChange={(date) => { onChange('startDate', date) }}
        />
      </div>
      <div className="field-wrapper">
        <div className="field-name">
          End Date
          <Whisper placement="left" trigger="hover" speaker={(
            <Tooltip>
              This is the date your campaign will end. To ensure your ads
              are always active so you don't miss impressions or clicks,
              choose "No end date." You can extend, shorten,
              or end your campaign at any time while it's running.
            </Tooltip>
          )}>
            <InfoSvg />
          </Whisper>
        </div>
        <DatePicker
          value={info.endDate}
          format="MMM D, YYYY"
          placeholder="No end date"
          oneTap
          disabledDate={date => moment(date).isBefore(moment(info.startDate)) }
          onChange={(date) => { onChange('endDate', date) }}
        />
      </div>
    </div>
  </>
)

export default BasicInfo
