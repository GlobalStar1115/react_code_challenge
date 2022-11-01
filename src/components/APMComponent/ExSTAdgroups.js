import React, { useState, useEffect } from 'react'
import Select from 'react-select'

import PaginationComponent from '../CommonComponents/PaginationComponent'

import { ReactComponent as SearchSvg } from '../../assets/svg/search.svg'

const DEFAULT_PAGE_SIZE = 10

const matchTypeOptions = [
  { value: 'broad', label: 'Broad' },
  { value: 'phrase', label: 'Phrase' },
  { value: 'exact', label: 'Exact' },
]

const ExSTAdgroups = ({ campaign, settings, disabled, onChange }) => {
  const [adgroups, setAdgroups] = useState([])
  const [keyword, setKeyword] = useState('')
  const [filteredAdgroups, setFilteredAdgroups] = useState([])
  const [pageStart, setPageStart] = useState(0)
  const [pageEnd, setPageEnd] = useState(DEFAULT_PAGE_SIZE)

  useEffect(() => {
    const adgroupList = []
    if (campaign.basic[0].type !== 'sb' && campaign.basic[0].type !== 'sbv') {
      campaign.keywordAdgroups.forEach((adgroup) => {
        const adgroupId = parseInt(adgroup.id, 10)
        const values = []
        settings.st_adgroups_apply.forEach((saved) => {
          if (parseInt(saved.adgroupId, 10) !== adgroupId) {
            return
          }
          values.push({
            matchType: saved.matchType,
            bid: saved.bid,
          })
        })
        adgroupList.push({
          id: adgroupId,
          name: adgroup.name,
          values,
        })
      })
    } else {
      const values = settings.st_adgroups_apply.map(saved => ({
        matchType: saved.matchType,
        bid: saved.bid,
      }))
      adgroupList.push({
        id: 0,
        name: 'Campaign Level',
        values,
      })
    }

    setAdgroups(adgroupList)
    setFilteredAdgroups(adgroupList)
  }, [campaign]) // eslint-disable-line

  useEffect(() => {
    const changes = []
    adgroups.forEach((adgroup) => {
      adgroup.values.forEach((value) => {
        if (value.matchType) {
          changes.push({
            adgroupId: adgroup.id,
            matchType: value.matchType,
            bid: parseFloat(value.bid),
          })
        }
      })
    })
    // Force to call setFilteredAdgroups() again to reflect changes
    // of adgroup values.
    updateFiltered()
    onChange('st_adgroups_apply', changes)
  }, [adgroups]) // eslint-disable-line

  const updateFiltered = () => {
    if (keyword === '') {
      setFilteredAdgroups(adgroups)
    } else {
      const lowerCased = keyword.toLowerCase()
      setFilteredAdgroups(adgroups.filter(adgroup => (
        adgroup.name.toLowerCase().indexOf(lowerCased) !== -1
      )))
    }
  }

  const applyBidChange = (adgroup, index, bid) => {
    const newAdgroups = adgroups.map((record) => {
      if (record.id !== adgroup.id) {
        return record
      }
      const values = record.values
      if (values[index]) {
        values[index].bid = bid
      } else {
        values.push({
          matchType: '',
          bid,
        })
      }
      return Object.assign({}, record, {
        values,
      })
    })
    setAdgroups(newAdgroups)
  }

  const handleKeywordPress = (event) => {
    if (event.key === 'Enter') {
      updateFiltered()

      setPageStart(0)
      setPageEnd(DEFAULT_PAGE_SIZE)
    }
  }

  const handleMatchTypeChange = (adgroup, index) => (selected) => {
    const newAdgroups = adgroups.map((record) => {
      if (record.id !== adgroup.id) {
        return record
      }
      const values = record.values
      if (values[index]) {
        values[index].matchType = selected.value
      } else {
        values.push({
          matchType: selected.value,
          bid: 0.75,
        })
      }
      return Object.assign({}, record, {
        values,
      })
    })
    setAdgroups(newAdgroups)
  }

  const handleBidChange = (adgroup, index) => (event) => {
    applyBidChange(adgroup, index, event.target.value)
  }

  // Validate if a bid value is equal to, or greater than 0.02.
  const handleBidBlur = (adgroup, index) => () => {
    const found = adgroups.find(record => record.id === adgroup.id)
    if (!found.values[index]) {
      return
    }

    if (found.values[index].bid === ''
      || isNaN(found.values[index].bid)
      || parseFloat(found.values[index].bid) < 0.02) {
      applyBidChange(adgroup, index, 0.02)
    }
  }

  const handleMatchTypeAdd = adgroup => () => {
    const newAdgroups = adgroups.map((record) => {
      if (record.id !== adgroup.id) {
        return record
      }
      return Object.assign({}, record, {
        values: [
          ...record.values,
          {
            matchType: '',
            bid: 0.75,
          },
        ],
      })
    })
    setAdgroups(newAdgroups)
  }

  const handleMatchTypeRemove = adgroup => () => {
    const newAdgroups = adgroups.map((record) => {
      if (record.id !== adgroup.id || !record.values.length) {
        return record
      }
      return Object.assign({}, record, {
        // Remove the last item.
        values: record.values.slice(0, -1),
      })
    })
    setAdgroups(newAdgroups)
  }

  const handlePaginate = (pageNum, pageRows) => {
    setPageStart((pageNum - 1) * pageRows)
    setPageEnd(pageNum * pageRows - 1)
  }

  const renderMatchType = (adgroup, index = 0) => {
    let matchType = null
    if (adgroup.values[index]) {
      matchType = matchTypeOptions.find(option => (
        option.value === adgroup.values[index].matchType
      ))
    }

    const usedMatchTypes = []
    adgroup.values.forEach((value, recordIndex) => {
      if (recordIndex !== index) {
        usedMatchTypes.push(value.matchType)
      }
    })

    return (
      <div key={`${adgroup.id}-${index}`} className="table-row">
        <div className="table-col">
          { index === 0 ? adgroup.name : '' }
        </div>
        <div className="table-col">
          <Select
            value={matchType}
            options={matchTypeOptions}
            placeholder="Choose Match Type"
            // Only the last item can be updated.
            isDisabled={adgroup.values.length !== 0 && index !== adgroup.values.length - 1}
            isOptionDisabled={option => usedMatchTypes.indexOf(option.value) !== -1}
            onChange={handleMatchTypeChange(adgroup, index)}
          />
        </div>
        <div className="table-col">
          <input
            type="number"
            min="0.02"
            value={adgroup.values[index] ? adgroup.values[index].bid : 0.75}
            onChange={handleBidChange(adgroup, index)}
            onBlur={handleBidBlur(adgroup, index)}
          />
        </div>
        <div className="table-col col-action">
          <button
            type="button"
            className="btn btn-red"
            // Only the last item can be removed.
            disabled={index !== adgroup.values.length - 1}
            title="Remove"
            onClick={handleMatchTypeRemove(adgroup)}
          >
            &times;
          </button>
          {
            // Only the last item can have Add button, and we can add up to 3 items.
            (adgroup.values.length === 0 || index === adgroup.values.length - 1)
            && adgroup.values.length < 3 && (
              <button
                type="button"
                className="btn btn-green"
                disabled={!matchType}
                title="Add"
                onClick={handleMatchTypeAdd(adgroup)}
              >
                +
              </button>
            )
          }
        </div>
      </div>
    )
  }

  const renderAdgroup = (adgroup) => {
    if (!adgroup.values.length) {
      return renderMatchType(adgroup)
    }
    return adgroup.values.map((value, index) => renderMatchType(adgroup, index))
  }

  return (
    <div className={`table-wrapper ${disabled ? 'disabled' : ''}`}>
      <div className="table-wrapper-header">
        <strong>Step 5)</strong>&nbsp;Select Ad Groups, specify match type
        and bid price for newly added terms.
      </div>
      {
        campaign.basic[0].type !== 'sb' && campaign.basic[0].type !== 'sbv' && (
          <div className="table-header-desc">
            { campaign.keywordAdgroups.length } ad groups available for selection.
          </div>
        )
      }
      <div className="table-adgroups">
        <div className="table-header">
          <div className="table-header-left">
            <SearchSvg />
            <input
              className="table-header-search"
              placeholder="Type to search"
              value={keyword}
              onChange={(event) => { setKeyword(event.target.value) }}
              onKeyPress={handleKeywordPress}
            />
          </div>
        </div>
        <div className="table-body">
          <div className="table-row content-header">
            <div className="table-col">Ad Group</div>
            <div className="table-col">Match Type</div>
            <div className="table-col">Bid</div>
            <div className="table-col col-action" />
          </div>
          {
            filteredAdgroups.slice(pageStart, pageEnd).map(renderAdgroup)
          }
        </div>
        <PaginationComponent
          total={filteredAdgroups.length}
          loadData={handlePaginate}
        />
      </div>
    </div>
  )
}

export default ExSTAdgroups
