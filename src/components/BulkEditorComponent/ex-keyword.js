import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { useHistory } from 'react-router-dom'

import ImportFileContent from '../CommonComponents/ImportFileContent'
import LoaderComponent from '../CommonComponents/LoaderComponent'
import ExpansionModalAddKeywordsToExsitingCampaign from './modals/ex-add-keyword-exsiting-campaign'

import { uploadKeywords } from '../../redux/actions/api'

import {
  MAX_KEYWORD_SELECTED,
} from '../../utils/constants/defaultValues'

const ExpansionKeywordComponent = (props) => {
  const dispatch = useDispatch()
  const store = useStore()
  const history = useHistory()

  const { selectedCampaigns } = props

  const [ showFileUpload, setShowFileUpload ] = useState(false)
  const [ fileImportBtnName, setFileImportBtnName ] = useState('Import from CSV')
  const [ uploadedKeywordsData, setUploadedKeywordsData ] = useState([])
  const [ showExistingModal, setShowExistingModal ] = useState(false)
  const keywordRef = useRef()

  const { auth: { token }, api: { isUploadingKeywords, uploadedKeywords }, } = store.getState()

  const handleImportFile = () => {
    setShowFileUpload(true)
  }

  const loadUploadedFileContent = (data, fileName) => {
    const keywords = data.split(/\n/)
    let results = ''
    keywords.map((keyword, ind) => {
      if (ind > 0 && ind < keywords.length - 1) {
        const curline = keyword.split(',')
        const tmp = '' + curline[1]
        if (ind === keywords.length - 2) {
          results += tmp.split('"').join('')
        } else {
          results += tmp.split('"').join('') + ', '
        }
      }
      return ''
    })
    keywordRef.current.value = results
    setFileImportBtnName(fileName)
    setShowFileUpload(false)
  }

  const hideFileUpload = () => {
    setShowFileUpload(false)
  }

  // Find New Keywords
  const handleFindNewKeywords = () => {
    if (selectedCampaigns.length === 0) {
      return
    }

    let keywordsList = []
    if (keywordRef.current.value) {
      keywordsList = keywordRef.current.value.split(',')
    }

    const keywordsData = {
      keywords: keywordsList,
      filters: {
        user: 238,
        campaign: selectedCampaigns.map(campaign => campaign.campaignid),
      }
    }
    dispatch(uploadKeywords({ keywordsData, token }))
  }

  useEffect(() => {
    if (!uploadedKeywords || uploadedKeywords.length === 0) {
      return
    }
    setUploadedKeywordsData(uploadedKeywords.map(keyword => ({
      keywordText: keyword,
      amazonUrl: `https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dpets&field-keywords=${keyword}`,
    })))
  }, [uploadedKeywords])

  // Add keywords to new campaign
  const handleAddToNewCampaign = (keywords) => {
    // FIXME: show message box: Keywords required!
    if (!keywords || keywords.length === 0) {
      return
    }
    history.push({ pathname: 'campaigns/new/sp', state: { params: keywords }, })
  }

  // Add keywords to existing campaign
  const handleAddToExistingCampaign = (keywords) => {
    // FIXME: show message box: Campaign and Keywords required!
    if (!keywords || keywords.length === 0 || selectedCampaigns.length === 0) {
      return
    }
    const keywordsForAddToExistingCampaign = uploadedKeywordsData.filter(keyword => keyword.keywordText !== '(_targeting_auto_)')
    // FIXME: show message box: Limit Exceeded. Ad groups may have a max of 1000 keywords.
    if (keywordsForAddToExistingCampaign.length > MAX_KEYWORD_SELECTED) {
      return
    }
    setShowExistingModal(true)
  }

  const handleHideAddToExistingModal = () => {
    setShowExistingModal(false)
  }

  const renderKeywordsContainer = () => {
    return (
      <div className={isUploadingKeywords ? "keyword-container loading" : "keyword-container"}>
        { isUploadingKeywords && <LoaderComponent /> }
        <div className="container-title">{ uploadedKeywordsData.length } Keywords found</div>
        <div className="container-keywords">
        {
          uploadedKeywordsData.length > 0 && uploadedKeywordsData.map(keyword => (
            <a className="keyword-box" href={ keyword.amazonUrl } key={ keyword.keywordText }>{keyword.keywordText}</a>
          ))
        }
        </div>
        <div className="container-footer">
          <button type="button" className="btn-usual" onClick={() => { handleAddToNewCampaign(uploadedKeywordsData) }}>Add to New Campaign</button>
          <button type="button" className="btn-usual" onClick={() => { handleAddToExistingCampaign(uploadedKeywordsData) }}>Add to Exisiting Campaign</button>
          <button type="button" className="btn-usual">Individual Words</button>
          <button type="button" className="btn-usual">Copy to Clipboard</button>
        </div>
      </div>
    )
  }

  return (
    <div className="expansion-keyword">
      <div className="keyword-title">
        <span>Keywords</span>
        <button type="button" onClick={ handleImportFile }>{fileImportBtnName}</button>
        <ImportFileContent
          showFileUpload = { showFileUpload }
          loadData = { loadUploadedFileContent }
          hideFileUpload = { hideFileUpload }
        />
      </div>
      <input className="keyword-input" placeholder="Enter Comma separated" ref={ keywordRef }/>
      <button type="button" className="btn-accent btn-find-keyword" onClick={ handleFindNewKeywords }>
        Find new Keywords
      </button>
      { renderKeywordsContainer() }
      { showExistingModal &&
        <ExpansionModalAddKeywordsToExsitingCampaign
          pageForAdd = 'Keywords'
          onHideModal = { handleHideAddToExistingModal }
          keywords = {
            uploadedKeywordsData.filter(keyword => keyword.keywordText !== '(_targeting_auto_)').map(keyword => (
              {
                keyword: keyword.keywordText,
                matchType: 'broad',
              }
            ))
          }
          campaigns = { selectedCampaigns }
        />
      }
    </div>
  );
}

export default ExpansionKeywordComponent
