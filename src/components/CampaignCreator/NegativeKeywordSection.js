import React, { useState } from 'react'
import Select from 'react-select'

import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'

const matchTypeOptions = [
  { value: 'negative exact', label: 'Negative exact' },
  { value: 'negative phrase', label: 'Negative phrase' },
]

const NegativeKeywordSection = ({ negativeKeywords, bidInfo, onChange }) => {
  const [matchType, setMatchType] = useState(matchTypeOptions[0])
  const [keywordList, setKeywordList] = useState('')

  const handleSelect = () => {
    let newKeywords = [...negativeKeywords]
    const enteredKeywords = keywordList.split('\n').map(keyword => keyword.trim().toLowerCase())
    enteredKeywords.forEach((keywordText) => {
      if (/^\s*$/.test(keywordText)) {
        return ''
      }

      const duplicate = negativeKeywords.find(kw => (
        keywordText === kw.keywordText
        && matchType.value === kw.matchType.toLowerCase()
      ))

      if (!duplicate) {
        newKeywords.push({
          matchType: matchType.value,
          keywordText,
          keywordBid: bidInfo.defaultBid,
          state: 'enabled'
        })
      }
    })

    onChange(newKeywords)
  }

  const handleRemove = (index) => {
    let newKeywords = [...negativeKeywords]
    newKeywords.splice(index, 1)
    onChange(newKeywords)
  }

  const renderKeywords = () => {
    if (!negativeKeywords.length) {
      return (
        <div className="no-keyword-desc">
          No negative keyword added.
        </div>
      )
    }

    return (
      <div className="keyword-container">
        {
          negativeKeywords.map((keyword, index) => (
            <div key={`${keyword.keywordText}-${keyword.matchType}`} className="keyword-box">
              <div className="flex justify-space-between align-center box-header">
                <div>
                  Keyword: {keyword.keywordText}
                </div>
                <div>
                  Match Type: {keyword.matchType}
                </div>
                <CloseSvg title="Remove" onClick={() => { handleRemove(index) }}/>
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  return (
    <div className="section-container">
      <div className="section-title">
        Optional: Negative Keywords
      </div>
      <div className="section-note">
        Negative keywords prevent your ads from displaying when a shopper's search terms
        match your negative keywords. You can exclude irrelevant searches, reducing your advertising cost.
      </div>
      <div className="keyword-input-section">
        <div className="flex align-center">
          <span className="match-title">Match Type:</span>
          <Select
            classNamePrefix="match-select"
            value={matchType}
            options={matchTypeOptions}
            onChange={(option) => { setMatchType(option) }}
          />
        </div>
        <textarea
          className="negative-keyword-list"
          placeholder="Enter negative keywords separated by a new line."
          rows={5}
          value={keywordList}
          onChange={(event) => { setKeywordList(event.target.value) }}
        />
      </div>
      <button type="button" className="btn btn-red btn-add-keyword" onClick={handleSelect}>
        Add these negative keywords
      </button>
      { renderKeywords() }
    </div>
  )
}

export default NegativeKeywordSection
