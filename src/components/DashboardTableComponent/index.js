import React, {useState} from 'react'
import { useDispatch, useStore } from 'react-redux'

import AllCampaignTableComponent from '../AllCampaignTableComponent'
import ProductTableComponent from '../ProductTableComponent'
import PortfolioTableComponent from '../PortfolioTableComponent'

//--assets
import { ReactComponent as MaxSvg } from '../../assets/svg/maximize.svg'
import { ReactComponent as MinSvg } from '../../assets/svg/minimize.svg'

//--actions
import { MaxDashboardTable, MinDashboardTable } from '../../redux/actions/dashboard'

const DashboardTableComponent = () => {
  const dispatch = useDispatch()
  const store = useStore().getState()
  const { dashboard, campaign } = store
  const { maxTable } = dashboard
  const { isLoading } = campaign

  const [activeTab, setActiveTab] = useState('campaign')

  const handleMaxTable = () => {
    dispatch(MaxDashboardTable())
  }
  const handleMinTable = () => {
    dispatch(MinDashboardTable())
  }

  const handleCampaigns = () => {
    setActiveTab('campaign')
  }
  const handleProducts = () => {
    setActiveTab('product')
  }
  const handlePortfolio = () => {
    setActiveTab('portfolio')
  }

  return (
    <div className={isLoading ? "dashboard-table-component loading" : "dashboard-table-component"}>
      <div className="table-tabs">
        <div className="table-tab-left">
          <button type="button" className={ "table-tab "+ (activeTab==='campaign' && 'selected') } onClick={ handleCampaigns }>My Campaigns</button>
          <button type="button" className={ "table-tab " + (activeTab==='product' && 'selected') } onClick={ handleProducts }>My Products</button>
          <button type="button" className={ "table-tab " + (activeTab==='portfolio' && 'selected') } onClick={ handlePortfolio }>Portfolios</button>
        </div>
        <div className="table-tab-right">
          {!maxTable && <MaxSvg onClick={ handleMaxTable } />}
          {maxTable && <MinSvg onClick={ handleMinTable } />}
        </div>
      </div>
      <div className="table-container">
        { activeTab === 'campaign' && <AllCampaignTableComponent /> }
        { activeTab === 'product' && <ProductTableComponent /> }
        { activeTab === 'portfolio' && <PortfolioTableComponent /> }
      </div>
    </div>
  );
}

export default DashboardTableComponent
