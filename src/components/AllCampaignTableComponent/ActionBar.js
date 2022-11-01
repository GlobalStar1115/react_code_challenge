import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Dropdown } from 'rsuite'
import moment from 'moment'

import { ReactComponent as HistorySvg } from '../../assets/svg/history.svg'
import { ReactComponent as FilterSvg } from '../../assets/svg/filter.svg'
import { ReactComponent as ColumnSvg } from '../../assets/svg/columns.svg'
import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'

import DateRangeComponent from '../CommonComponents/DateRangeComponent'
import TemplateSelector from '../CommonComponents/TemplateSelector'

import {
  showANPAction,
  showAEPAction,
  showTableFilterAction,
  showColumnEditorAction,
} from '../../redux/actions/pageGlobal'

import {
  setDateRange,
} from '../../redux/actions/campaign'

import {
  getTemplates,
  turnBulk,
  applyTemplateBulk,
} from '../../redux/actions/ap'

const ActionBar = ({ searchKey, selectedCampaigns, dateRange, onChangeSearch, onDeselect,
  onUpdateState, onShowTableHistory }) => {
  const dispatch = useDispatch()
  const store = useStore()

  const {
    header: { currentUserId },
    ap: { templates, isLoadingTemplates, isTemplatesLoaded, isApplyingTemplateBulk },
  } = store.getState()

  const [templateSelectorVisible, setTemplateSelectorVisible] = useState(false)

  useEffect(() => {
    if (templateSelectorVisible && !isTemplatesLoaded && !isLoadingTemplates && currentUserId) {
      dispatch(getTemplates())
    }
  }, [templateSelectorVisible]) // eslint-disable-line

  const handleANPShow = () => {
    dispatch(showANPAction(selectedCampaigns))
  }

  const handleAEPShow = () => {
    dispatch(showAEPAction(selectedCampaigns))
  }

  const handleDateRangeChange = ([ startDate, endDate ]) => {
    dispatch(setDateRange({
      startDate,
      endDate,
    }))
  }

  const handleTableFilterShow = () => {
    dispatch(showTableFilterAction())
  }

  const handleColumnEditorShow = () => {
    dispatch(showColumnEditorAction())
  }

  const handleAPTurn = (state) => {
    const campaignIds = selectedCampaigns.map(campaign => campaign.campaignid)
    dispatch(turnBulk(campaignIds, state))
  }

  const handleTemplateApply = (templateId) => {
    const campaignIds = selectedCampaigns.map(campaign => campaign.campaignid)
    dispatch(applyTemplateBulk(templateId, campaignIds, moment().format('Z'))).then(() => {
      setTemplateSelectorVisible(false)
    })
  }

  return (
    <div className="table-header">
      <div className="table-header-left">
        <SearchSvg />
        <input
          type="text"
          className="table-header-search"
          placeholder="Type to search..."
          value={searchKey}
          onChange={(event) => { onChangeSearch(event.target.value) }}
        />
        {
          selectedCampaigns.length > 0 && (
            <>
              <button type="button" className="btn btn-white" onClick={() => { onDeselect() }}>
                Deselect
              </button>
              <Dropdown title="State">
                <Dropdown.Item onSelect={() => { onUpdateState('paused') }}>
                  Pause
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => { onUpdateState('enabled') }}>
                  Unpause
                </Dropdown.Item>
              </Dropdown>
              <Dropdown title="Portfolio">
                <Dropdown.Item onSelect={() => { handleANPShow() }}>
                  Add To New Portfolio
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => { handleAEPShow() }}>
                  Add To Existing Portfolio
                </Dropdown.Item>
              </Dropdown>
              <Dropdown title="Smart Pilot">
                <Dropdown.Item onSelect={() => { handleAPTurn('on') }}>
                  Turn Smart Pilot On
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => { handleAPTurn('off') }}>
                  Turn Smart Pilot Off
                </Dropdown.Item>
                <Dropdown.Item onSelect={() => { setTemplateSelectorVisible(true) }}>
                  Apply Template
                </Dropdown.Item>
              </Dropdown>
            </>
          )
        }
        <DateRangeComponent
          value={dateRange}
          onChange={handleDateRangeChange}
        />
        <TemplateSelector
          show={templateSelectorVisible}
          templates={templates}
          isLoading={isLoadingTemplates}
          isApplying={isApplyingTemplateBulk}
          onChange={handleTemplateApply}
          onCancel={() => { setTemplateSelectorVisible(false) }}
        />
      </div>
      <div className="table-header-right">
        <HistorySvg title="History" onClick={onShowTableHistory}/>
        <FilterSvg title="Filter" onClick={handleTableFilterShow} />
        <ColumnSvg title="Column Customizer" onClick={handleColumnEditorShow} />
      </div>
    </div>
  )
}

export default ActionBar
