import React, { useState, useEffect } from 'react'
import { useStore } from 'react-redux'
import { Modal, Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import CustomTable from '../CommonComponents/CustomTableComponent'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import CheckboxComponent from '../CommonComponents/CheckboxComponent'

const matchTypeList = {
  broad: 'Broad',
  phrase: 'Phrase',
  exact: 'Exact',
}

const TAB_SUGGESTED = 'suggested'
const TAB_ENTER = 'enter'

const tabList = [
  {
    value: TAB_SUGGESTED,
    name: 'Suggested Keywords',
    description: 'Suggested keywords are based on the products in your ads. '
      + 'You can add the keywords that you want, '
      + 'and edit keywords and bids after you add them.',
  },
  { value: TAB_ENTER, name: 'Enter list' },
]

const KeywordModal = ({ show, keywordsSelected, onSelect, onClose }) => {
  const store = useStore()

  const { campaignCreator: { isSPSuggestionsLoading, suggestedKeywords } } = store.getState()

  const [currentTab, setCurrentTab] = useState(TAB_SUGGESTED)
  const [keywordList, setKeywordList] = useState([])
  const [selectedKeywords, setSelectedKeywords] = useState([])
  const [customKeywords, setCustomKeywords] = useState('')
  const [matchTypesSelected, setMatchTypesSelected] = useState([])

  useEffect(() => {
    if (!suggestedKeywords) {
      return
    }
    const keywords = []
    const matchTypes = Object.keys(matchTypeList)
    suggestedKeywords.forEach((suggestedKeyword) => {
      matchTypes.forEach((matchType) => {
        keywords.push({
          compositeId: `${suggestedKeyword.keywordText}-${matchType}`,
          keywordText: suggestedKeyword.keywordText,
          matchType,
        })
      })
    })
    setKeywordList(keywords)
  }, [suggestedKeywords])

  useEffect(() => {
    setSelectedKeywords(keywordsSelected.map(keyword => (
      `${keyword.keywordText}-${keyword.matchType}`
    )))
  }, [keywordsSelected])

  const handleMatchTypeChange = matchType => () => {
    const newList = [...matchTypesSelected]
    const index = newList.indexOf(matchType)
    if (index === -1) {
      newList.push(matchType)
    } else {
      newList.splice(index, 1)
    }
    setMatchTypesSelected(newList)
  }

  const handleConfirm = () => {
    let keywords
    if (currentTab === TAB_SUGGESTED) {
      keywords = keywordList.filter(keyword => (
        selectedKeywords.includes(keyword.compositeId)
      ))
    } else if (currentTab === TAB_ENTER) {
      keywords = []
      const enteredKeywords = customKeywords.split('\n').map(keyword => keyword.trim().toLowerCase())
      enteredKeywords.forEach((keywordText) => {
        if (/^\s*$/.test(keywordText)) {
          return ''
        }

        matchTypesSelected.forEach((matchType) => {
          keywords.push({
            keywordText,
            matchType,
          })
        })
      })
    }
    onSelect(keywords)
  }

  const renderKeyword = keyword => (
    <>
      <div className="table-col">
        { keyword.keywordText }
      </div>
      <div className="table-col">
        { matchTypeList[keyword.matchType] }
      </div>
    </>
  )

  return (
    <Modal className={`keyword-modal${isSPSuggestionsLoading ? ' loading' : ''}`} backdrop="static" show={show} size="lg">
      <Modal.Body>
        { isSPSuggestionsLoading && <LoaderComponent /> }
        <div className="tab-list">
          {
            tabList.map(tab => (
              <button
                key={tab.value}
                type="button"
                className={currentTab === tab.value ? 'selected' : ''}
                onClick={() => { setCurrentTab(tab.value) }}
              >
                { tab.name }
                {
                  tab.description && (
                    <Whisper placement="right" trigger="hover" speaker={(
                      <Tooltip>
                        { tab.description }
                      </Tooltip>
                    )}>
                      <InfoSvg />
                    </Whisper>
                  )
                }
              </button>
            ))
          }
        </div>
        {
          currentTab === TAB_SUGGESTED && (
            <CustomTable
              className="table-keywords"
              records={keywordList}
              selectedRecords={selectedKeywords}
              idField="compositeId"
              searchFields={['keywordText']}
              paginationSelectPlacement="top"
              renderRecord={renderKeyword}
              onChange={setSelectedKeywords}
            >
              <div className="table-col">Suggested Keyword</div>
              <div className="table-col">Match Type</div>
            </CustomTable>
          )
        }
        {
          currentTab === TAB_ENTER && (
            <>
              <div className="match-type-option-list">
                {
                  Object.keys(matchTypeList).map(value => (
                    <CheckboxComponent
                      key={value}
                      label={matchTypeList[value]}
                      checked={matchTypesSelected.includes(value)}
                      onChange={handleMatchTypeChange(value)}
                    />
                  ))
                }
              </div>
              <textarea
                className="keyword-list"
                placeholder="Enter keywords separated by a new line."
                rows={5}
                value={customKeywords}
                onChange={(event) => { setCustomKeywords(event.target.value) }}
              />
            </>
          )
        }
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="rs-btn rs-btn-primary" onClick={handleConfirm}>
          Confirm
        </button>
        <button type="button" className="rs-btn rs-btn-subtle" onClick={() => onClose()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default KeywordModal
