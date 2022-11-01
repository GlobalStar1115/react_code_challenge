import React, { useEffect, useState } from 'react'
import { useDispatch, useStore } from 'react-redux'
import { Tooltip, Whisper } from 'rsuite'

import { ReactComponent as InfoSvg } from '../../assets/svg/info.svg'

import LoaderComponent from '../../components/CommonComponents/LoaderComponent'
import { toast } from '../../components/CommonComponents/ToastComponent/toast'

import { saveUniversalSettings } from '../../redux/actions/auth'

const SectionUniversal = () => {
  const store = useStore().getState()
  const dispatch = useDispatch()

  const { header: { selectedUserInfo } } = store

  const [profitMargin, setProfitMargin] = useState(0)
  const [acos, setAcos] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Load current settings.
  useEffect(() => {
    if (!Object.keys(selectedUserInfo).length) {
      return
    }

    const { average_profit, average_acos } = selectedUserInfo
    setProfitMargin(parseFloat(average_profit || 0))
    setAcos(parseFloat(average_acos || 0))
  }, [selectedUserInfo])

  const handleSave = () => {
    if (profitMargin === '' || isNaN(profitMargin)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the Universal Profit Margin.',
      })
      return
    }

    if (acos === '' || isNaN(acos)) {
      toast.show({
        title: 'Warning',
        description: 'Please enter the Universal ACoS Target Zone.',
      })
      return
    }

    setIsSaving(true)
    dispatch(saveUniversalSettings({
      profitMargin: parseFloat(profitMargin),
      acos: parseFloat(acos),
    })).then(() => {
      setIsSaving(false)
    })
  }

  return (
    <div className={`page-section${isSaving ? ' loading' : ''}`}>
      { isSaving && <LoaderComponent /> }
      <div className="section-title">Universal Values</div>
      <div className="section-contents section-universal">
        <div className="field-wrapper">
          <label>
            Universal Profit Margin %
            <Whisper placement="right" trigger="hover" speaker={(
              <Tooltip>
                Used to determine profit margins ONLY for those SKU’s
                where a profit margin has not been set.<br />
                To set the profit margin on an individual SKU,
                go to Command Center and update the COG.<br />
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </label>
          <input
            type="number"
            value={profitMargin}
            onChange={(event) => { setProfitMargin(event.target.value) }}
          />
        </div>
        <div className="field-wrapper">
          <label>
            Universal ACoS Target Zone %
            <Whisper placement="left" trigger="hover" speaker={(
              <Tooltip>
                Used to determine your ACoS target zone (ACoS Target zone will
                determine profitable/non profitable SKU’s, keywords, search terms
                and negative words within a campaign).<br />
                To set ACOS target zones on an individual campaign, go to Command Center,
                select the campaign and enter the ACOS target zone % for that campaign.
              </Tooltip>
            )}>
              <InfoSvg />
            </Whisper>
          </label>
          <input
            type="number"
            value={acos}
            onChange={(event) => { setAcos(event.target.value) }}
          />
        </div>
        <button
          type="button"
          className="btn btn-red"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default SectionUniversal
