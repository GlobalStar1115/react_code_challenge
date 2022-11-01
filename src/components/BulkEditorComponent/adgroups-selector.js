import React, { useState } from 'react'
import { useStore } from 'react-redux'

import TableComponent from '../CommonComponents/TableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'

const AdgroupsSelectComponent = (props) => {
  const store = useStore()

  const { loadBulkData } = props
  const { campaign } = store.getState()
  const { optAdgroups, isOptAdGroupsLoading } = campaign
  const [ selectedAdgroups, setSelectedAdgroups ] = useState([])
  const [ showSelector, setShowSelector ] = useState(false)

  // activeOptions
  const activeOptions = [
    { label: 'Active or Paused', value: 'active or paused' },
    { label: 'Active', value: 'enabled' },
    { label: 'Paused', value: 'paused' },
  ]
  const [ selectedActive, setSelectedActive] = useState(activeOptions[1]) // eslint-disable-line

  // show customized adgroup select box
  const handleClickShowSelector = () => {
    setShowSelector(!showSelector)
  }

  // select adgroup table row
  const checkHandle = (checked, data) => {
    if (checked) {
      setSelectedAdgroups( prevState => [...prevState, data] )
    } else {
      setSelectedAdgroups(selectedAdgroups.filter( item => item.adgroupid !== data.adgroupid ))
    }
  }
  const checkAll = (checked, data) => {
    if (checked) {
      setSelectedAdgroups([...data])
    } else {
      setSelectedAdgroups([])
    }
  }

  // Ad group table fields
  const fields = [
    { label: 'Adgroup name - Campaign', value: 'fullname', flex: '3' },
  ]

  // Ad group table data
  const adGroupsOptions = optAdgroups && optAdgroups.length > 0 ? optAdgroups.map(adgroup => ({
    ...adgroup,
    fullname: adgroup.name + ' ' + adgroup.campaign,
    checked: typeof selectedAdgroups.find(selectedAdgroup => selectedAdgroup.adgroupid === adgroup.adgroupid) !== 'undefined',
  })).filter(adgroup =>
    selectedActive.value === 'active or paused'
    ? adgroup.state === 'enabled' || adgroup.state === 'paused'
    : adgroup.state === selectedActive.value
  ) : []

  // click select button on adgroup select box
  const handleSelectAdgroups = () => {
    loadBulkData(selectedAdgroups)
    setShowSelector(false)
  }

  // click cancel button on adgroup select box
  const handleCancelAdgroups = () => {
    setSelectedAdgroups([])
    setShowSelector(false)
  }

  return (
    <div className="adgroups-selector">
      <button type="button" onClick={ handleClickShowSelector }>Choose Adgroups</button>
      {
        showSelector &&
          <div className={ isOptAdGroupsLoading ? "selector-container loading" : "selector-container"}>
            { isOptAdGroupsLoading && <LoaderComponent /> }
            <div className="content">
              <div className="table-section">
                <TableComponent
                  fields={ fields }
                  rows={ adGroupsOptions }
                  totals={ [] }
                  showTools
                  checkHandle={ checkHandle }
                  checkAll={ checkAll }
                  pageRows={ 5 }
                  showColumns
                  showCheckColumn
                  showSearch
                />
              </div>
              <div className="adgroups-action">
                <button type="button" className="btn btn-blue btn-cancel" onClick={ handleCancelAdgroups }>Cancel</button>
                <button
                  type="button"
                  className="btn btn-red btn-select"
                  onClick={ handleSelectAdgroups }
                >
                  Select
                </button>
              </div>
            </div>
        </div>
      }
    </div>
  )
}
export default AdgroupsSelectComponent
