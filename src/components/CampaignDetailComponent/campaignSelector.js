/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import * as Icon from 'react-icons/bs'
import OutsideClickHandler from 'react-outside-click-handler'

import { ReactComponent as MoreApmSvg } from '../../assets/svg/more-apm.svg'

import LoaderComponent from '../CommonComponents/LoaderComponent'
import CustomTable from '../CommonComponents/CustomTableComponent'

import {
  getCampaignList,
} from '../../redux/actions/campaignDetail'

import {
  showAPMAction,
} from '../../redux/actions/pageGlobal'

import {
  getNormalizedCampaignType,
} from '../../services/helper'

const CampaignSelector = ({ campaignId, onSelect }) => {
  const store = useStore()
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    header: {
      currentStartDate,
      currentEndDate,
    },
    campaignDetail: { currentDetail },
  } = store.getState()

  const [showSelector, setShowSelector] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])

  useEffect(() => {
    if (!showSelector || !currentStartDate || !currentEndDate) {
      return
    }

    setIsLoading(true)
    dispatch(getCampaignList(
      moment(currentStartDate).format('YYYY-MM-DD'),
      moment(currentEndDate).format('YYYY-MM-DD')
    )).then((response) => {
      setIsLoading(false)
      setCampaigns(response)
    })
  }, [showSelector]) // eslint-disable-line

  const handleToggle = (event) => {
    event.preventDefault()
    setShowSelector(!showSelector)
  }

  const handleSelect = campaign => (event) => {
    event.preventDefault()

    history.push({
      pathname: `/campaign/${campaign.id}`,
      state: {
        params: {
          campaignType: getNormalizedCampaignType(campaign.type),
        },
      },
    })

    onSelect()

    setShowSelector(false)
  }

  const handleAPMShow = () => {
    dispatch(showAPMAction(campaignId))
  }

  const renderCampaign = (campaign) => {
    let campaignType
    let targetingType
    if (campaign.type === 'sponsoredProducts') {
      campaignType = 'Sponsored Product'
      if (campaign.targeting_type === 'auto') {
        targetingType = 'Auto'
      } else {
        targetingType = 'Manual'
      }
    } else if (campaign.type === 'sponsoredDisplays') {
      campaignType = 'Sponsored Display'
    } else if (campaign.type === 'headlineSearch') {
      campaignType = 'Sponsored Brand Video'
    } else {
      campaignType = 'Sponsored Brand'
    }

    return (
      <>
        <div className="table-col">
          <a
            href="#"
            onClick={handleSelect(campaign)}
          >
            <span className="campaign-name">
              { campaign.name }
            </span>
            <span className="campaign-detail">
              {
                targetingType && <span>{ targetingType }</span>
              }
              <span>
                { campaignType }
              </span>
            </span>
          </a>
        </div>
      </>
    )
  }

  const renderSelector = () => {
    if (!showSelector) {
      return null
    }

    const extendedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      className: campaign.id === campaignId ? 'selected' : '',
    }))

    return (
      <div className="selector-contents">
        { isLoading && <LoaderComponent />}
        <CustomTable
          className="table-campaign-selector"
          records={extendedCampaigns}
          idField="id"
          searchFields={['name']}
          noCheckBox
          paginationSelectPlacement="top"
          renderRecord={renderCampaign}
        >
          <div className="table-col">Campaign</div>
        </CustomTable>
      </div>
    )
  }

  return (
    <OutsideClickHandler onOutsideClick={() => { setShowSelector(false) }}>
      <div className="campaign-selector-container">
        <div className="campaign-name-wrapper">
          <a
            href="#"
            className="toggle-button"
            onClick={handleToggle}
          >
            { currentDetail?.name }
            <Icon.BsCaretDownFill />
          </a>
          <span className={`status ${currentDetail?.is_ap_active ? 'on' : 'off'}`}>
            Smart Pilot {currentDetail?.is_ap_active ? 'On' : 'Off'}
          </span>
          <MoreApmSvg title="Open Smart Pilot" onClick={handleAPMShow} />
        </div>
        { renderSelector() }
      </div>
    </OutsideClickHandler>
  )
}

export default CampaignSelector
