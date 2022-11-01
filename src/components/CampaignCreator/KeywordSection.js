import React, { useState } from 'react'
import Select from 'react-select'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

import KeywordModal from './KeywordModal'

const matchTypeOptions = [
  { value: 'broad', label: 'Broad' },
  { value: 'phrase', label: 'Phrase' },
  { value: 'exact', label: 'Exact' },
]

const KeywordSection = ({ keywords, onChange }) => {
  const [openModal, setOpenModal] = useState(false)
  const [defaultBid, setDefaultBid] = useState(0.75)

  const handleSelect = (keywordsToAdd) => {
    setOpenModal(false)

    let newKeywords = [...keywords]
    const keywordsToGetBid = []

    keywordsToAdd.forEach((keyword) => {
      const duplicate = keywords.find(kw => (
        keyword.keywordText === kw.keywordText
          && keyword.matchType === kw.matchType.toLowerCase()
      ))

      if (!duplicate) {
        newKeywords.push({
          keywordText: keyword.keywordText,
          matchType: keyword.matchType,
          keywordBid: defaultBid,
        })

        keywordsToGetBid.push({
          keyword: keyword.keywordText,
          matchType: keyword.matchType,
        })
      }
    })

    newKeywords = newKeywords.map((keyword, index) => ({
      ...keyword,
      id: keyword.id ? keyword.id : index,
    }))

    onChange(newKeywords, true, keywordsToGetBid)
  }

  const handleMatchTypeChange = (match, keyword) => {
    keyword.matchType = match.value
    onChange(keywords.map((kw) => {
      if (kw.id === keyword.id) {
        return { ...kw, matchType: match.value }
      }
      return kw
    }))
  }

  const handleApplyAllSuggested = () => {
    onChange(keywords.map(keyword => {
      keyword.keywordBid = keyword.suggestedBid ? keyword.suggestedBid.suggested : keyword.keywordBid
      return keyword
    }))
  }

  const handleApplyBid = (type, keyword) => {
    if (!keyword.suggestedBid) {
      return
    }

    switch (type) {
      case 'suggest':
        keyword.keywordBid = keyword.suggestedBid.suggested
        break;
      case 'min':
        keyword.keywordBid = keyword.suggestedBid.rangeStart
        break;
      case 'max':
        keyword.keywordBid = keyword.suggestedBid.rangeEnd
        break;
      default:
        keyword.keywordBid = defaultBid
        break;
    }

    onChange(keywords.map(kw => {
      if (kw.id === keyword.id) {
        return keyword
      }
      return kw
    }))
  }

  const handleChangeKeywordBid = (e, keyword) => {
    e.preventDefault()
    keyword.keywordBid = e.currentTarget.value
    onChange(keywords.map(kw => {
      if (kw.id === keyword.id) {
        return keyword
      }
      return kw
    }))
  }

  const handleRemove = (id) => {
    onChange(keywords.filter(kw => kw.id !== id))
  }

  const handleDefaultBidApply = () => {
    onChange(keywords.map(item => ({
      ...item,
      keywordBid: defaultBid,
    })))
  }

  const renderKeywords = () => {
    if (!keywords.length) {
      return (
        <div className="no-keyword-desc">
          No keyword added.
        </div>
      )
    }

    return (
      <div className="keyword-container">
        {
          keywords.map((keyword) => {
            const matchType = matchTypeOptions.find(option => option.value === keyword.matchType)
            return (
              <div key={keyword.id} className="keyword-box">
                <div className="flex justify-space-between align-center box-header">
                  <div className="flex align-center match-selector">
                    <span className="match-title">Match Type</span>
                    <div>
                      <Select
                        classNamePrefix="match-select"
                        options={matchTypeOptions}
                        value={matchType}
                        onChange={val => handleMatchTypeChange(val, keyword)}
                      />
                    </div>
                  </div>
                  {
                    keyword.suggestedBid && (
                      <div className="apply-section">
                        <button type="button" className="btn btn-blue" onClick={() => { handleApplyBid('suggest', keyword) }}>
                          Apply Suggest
                        </button>
                        <button type="button" className="btn btn-blue" onClick={() => { handleApplyBid('min', keyword) }}>
                          Apply Min
                        </button>
                        <button type="button" className="btn btn-blue" onClick={() => { handleApplyBid('max', keyword) }}>
                          Apply Max
                        </button>
                      </div>
                    )
                  }
                  <CloseSvg title="Remove" onClick={() => { handleRemove(keyword.id) }}/>
                </div>
                <div className="box-content">
                  <div>
                    Keyword: {keyword.keywordText}
                  </div>
                  <div>
                    Suggested Bid:&nbsp;
                    { keyword.suggestedBid ? keyword.suggestedBid.suggested + ' : ' + keyword.suggestedBid.rangeStart + '~' + keyword.suggestedBid.rangeEnd : 'N/A' }
                  </div>
                  <div>
                    Keyword Bid:&nbsp;
                    <input type="text" value={keyword.keywordBid} onChange={e => { handleChangeKeywordBid(e, keyword) }} />
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="section-title">
        Keywords
        <div>
          {
            keywords.length > 0 && (
              <button
                type="button"
                className="btn btn-green"
                onClick={handleApplyAllSuggested}
              >
                Apply suggested bids to all
              </button>
            )
          }
          <button
            type="button"
            className="btn btn-blue"
            onClick={() => { setOpenModal(true) }}
          >
            Add Keywords
          </button>
        </div>
      </div>
      <div className="section-note">
        Your keywords (word combinations and phrases) are used to match your ads
        with search terms shoppers are using to find products.
      </div>
      <div className="default-bid-section">
        Default Bid:&nbsp;
        <input
          type="text"
          value={defaultBid}
          onChange={(event) => { setDefaultBid(event.target.value) }}
        />
        <button type="button" className="btn btn-blue" onClick={handleDefaultBidApply}>
          Apply
        </button>
      </div>
      { renderKeywords() }
      <KeywordModal
        show={openModal}
        keywordsSelected={keywords}
        onSelect={handleSelect}
        onClose={() => { setOpenModal(false) }}
      />
    </div>
  )
}

export default KeywordSection
