import React, { useState, useEffect } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import MainLayout from '../../layout/MainLayout'
import APMComponent from '../APMComponent'
import CampaignSelector from './campaignSelector'
import DashboardTab from './tabs/dashboard'
import SKUOPTab from './tabs/sku'
import BidOPTab from './tabs/bid'
import KeywordCleanerTab from './tabs/keywordCleaner'
import STOPTab from './tabs/searchTerm'
import NegativeOPTab from './tabs/negative'
import PlacementOPTab from './tabs/placement'

import { getDetails } from '../../redux/actions/campaignDetail'

const CampaignDetailComponent = ({ location }) => {
  const store = useStore()
  const dispatch = useDispatch()

  const {
    campaignDetail: { currentDetail },
    header: {
      currentStartDate,
      currentEndDate,
    },
    pageGlobal: { showAPM },
  } = store.getState()

  const { id: campaignId } = useParams()

  const [currentTab, setCurrentTab] = useState('dashboard')
  const [campaignType, setCampaignType] = useState('')

  useEffect(() => {
    if (!location.state.params) {
      return
    }

    setCampaignType(location.state.params.campaignType)

    document.querySelector('.main-content').scrollTop = 0
  }, [location])

  useEffect(() => {
    if (!currentStartDate || !currentStartDate) {
      return
    }

    let type = ''
    if (location.state.params) {
      type = location.state.params.campaignType
    }

    dispatch(getDetails({
      campaignId,
      campaignType: type,
      startDate: moment(currentStartDate).format('YYYY-MM-DD'),
      endDate: moment(currentEndDate).format('YYYY-MM-DD'),
    }))
  }, [campaignId, currentStartDate, currentEndDate]) // eslint-disable-line

  const isSB = campaignType === 'Sponsored Brands' || campaignType === 'Sponsored Brands Video'
  const isSD = campaignType === 'Sponsored Displays'

  const tabList = [
    {
      value: 'dashboard',
      label: 'Dashboard',
      isShow: true,
    },
    {
      value: 'sku',
      label: 'SKU Op',
      isShow: !isSB,
    },
    {
      value: 'bid',
      label: 'Bid Op',
      isShow: true,
    },
    {
      value: 'keyword',
      label: 'Keyword Cleaner',
      isShow: !isSB
        && !isSD
        && !(currentDetail && currentDetail.targeting_type === 'auto')
    },
    {
      value: 'search',
      label: 'Search Term Op',
      isShow: !isSD,
    },
    {
      value: 'negative',
      label: 'Negative Word/ASIN Finder',
      isShow: !isSD,
    },
    {
      value: 'placement',
      label: 'Placement Op',
      isShow: !isSB && campaignType !== 'Sponsored Displays',
    }
  ]

  return (
    <MainLayout>
      <div className="campaign-detail-component">
        { showAPM && <APMComponent /> }
        <div className="flex flex-wrap justify-space-between page-header">
          <div className="page-title">
            <CampaignSelector
              campaignId={campaignId}
              onSelect={() => { setCurrentTab('dashboard') }}
            />
          </div>
        </div>
        <div className="page-tabs">
          {
            tabList.map((tab) => (
              tab.isShow && (
                <button
                  key={tab.value}
                  type="button"
                  className={`page-tab${currentTab === tab.value ? ' selected' : ''}`}
                  onClick={() => { setCurrentTab(tab.value) }}
                >
                  { tab.label }
                </button>
              )
            ))
          }
        </div>
        {
          currentTab === 'dashboard' && (
            <DashboardTab
              campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'sku' && (
            <SKUOPTab
              campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'bid' && (
            <BidOPTab
              campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'keyword' && (
            <KeywordCleanerTab
            campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'search' && (
            <STOPTab
              campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'negative' && (
            <NegativeOPTab
            campaignType={campaignType}
            />
          )
        }
        {
          currentTab === 'placement' && (
            <PlacementOPTab
              campaignType={campaignType}
            />
          )
        }
      </div>
    </MainLayout>
  )
}

export default CampaignDetailComponent
