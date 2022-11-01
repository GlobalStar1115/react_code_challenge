// Actions for smart pilot manager.
import { callGet, callPost } from '../../services/axios'
import {
  GET_AP,
  GET_AP_SUCCESS,
  GET_AP_AD_GROUP,
  GET_AP_AD_GROUP_SUCCESS,
  GET_AP_SKUS,
  GET_AP_SKUS_SUCCESS,
  GET_AP_SPSD_CAMPAIGNS,
  GET_AP_SPSD_CAMPAIGNS_SUCCESS,
  GET_AP_SB_CAMPAIGNS,
  GET_AP_SB_CAMPAIGNS_SUCCESS,
  GET_AP_TEST_RESULTS,
  GET_AP_TEST_RESULTS_SUCCESS,
  GET_AP_CAMPAIGNS_TO_APPLY,
  GET_AP_CAMPAIGNS_TO_APPLY_SUCCESS,
  SAVE_AP,
  SAVE_AP_SUCCESS,
  SAVE_AP_TEMPLATE,
  SAVE_AP_TEMPLATE_SUCCESS,
  GET_AP_TEMPLATES,
  GET_AP_TEMPLATES_SUCCESS,
  TURN_AP_BULK,
  TURN_AP_BULK_SUCCESS,
  APPLY_TEMPLATE_BULK,
  APPLY_TEMPLATE_BULK_SUCCESS,
} from '../actionTypes/ap'

import {
  COIN_EARNED,
} from '../actionTypes/coin'

import {
  COIN_TYPE_AP_SETUP,
} from '../../utils/constants/coin'

import { toast } from '../../components/CommonComponents/ToastComponent/toast'

export const getAp = campaignId => (dispatch, getState) => {
  dispatch({
    type: GET_AP,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/load', token, {
    userId: currentUserId,
    campaignId,
  }).then((response) => {
    dispatch({
      type: GET_AP_SUCCESS,
      data: response['data'],
    })

    // TODO: Do we need to pre-fetch SKUs (along w/ the above call)
    // for campaigns with proper ad types supported?
    dispatch(getApSkus())
  })
}

export const getApAdgroup = ({ campaignId, adgroupId }) => (dispatch, getState) => {
  dispatch({
    type: GET_AP_AD_GROUP,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/loadForAdgroup', token, {
    userId: currentUserId,
    campaignId,
    adgroupId,
  }).then((response) => {
    dispatch({
      type: GET_AP_AD_GROUP_SUCCESS,
      data: response['data'],
      adgroupId,
    })
  })
}

export const getApSkus = () => (dispatch, getState) => {
  dispatch({
    type: GET_AP_SKUS,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/getSkus', token, {
    userId: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_AP_SKUS_SUCCESS,
      data: response['data'],
    })
  })
}

// Retrieve SP/SD campaigns matching SKUs selected.
export const getApSPSDCampaigns = (skus = []) => (dispatch, getState) => {
  dispatch({
    type: GET_AP_SPSD_CAMPAIGNS,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callPost('/ap/getSPSDCampaigns', {
    userId: currentUserId,
    skus,
  }, token).then((response) => {
    dispatch({
      type: GET_AP_SPSD_CAMPAIGNS_SUCCESS,
      data: response['data'],
    })
  })
}

// Retrieve SB campaigns.
export const getApSBCampaigns = () => (dispatch, getState) => {
  dispatch({
    type: GET_AP_SB_CAMPAIGNS,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callPost('/ap/getSBCampaigns', {
    userId: currentUserId,
  }, token).then((response) => {
    dispatch({
      type: GET_AP_SB_CAMPAIGNS_SUCCESS,
      data: response['data'],
    })
  })
}

export const getApTestResults = ({ campaignId, start, duration }) => (dispatch, getState) => {
  dispatch({
    type: GET_AP_TEST_RESULTS,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/getTestResults', token, {
    userId: currentUserId,
    campaignId,
    start,
    duration,
  }).then((response) => {
    dispatch({
      type: GET_AP_TEST_RESULTS_SUCCESS,
      data: response['data'],
    })
  })
}

// Retrieve campaigns of all ad types to apply smart pilot settings.
// FIXME: If there are cached campaigns, use them.
export const getApCampaignsToApply = () => (dispatch, getState) => {
  dispatch({
    type: GET_AP_CAMPAIGNS_TO_APPLY,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/getCampaignsToApply', token, {
    userId: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_AP_CAMPAIGNS_TO_APPLY_SUCCESS,
      data: response['data'],
    })
  })
}

// Retrieve a list of smart pilot templates.
export const getTemplates = () => (dispatch, getState) => {
  dispatch({
    type: GET_AP_TEMPLATES,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  callGet('/ap/getTemplates', token, {
    userId: currentUserId,
  }).then((response) => {
    dispatch({
      type: GET_AP_TEMPLATES_SUCCESS,
      data: response['data'],
    })
  })
}

// Retrieve details of a given template.
export const getTemplate = templateId => (dispatch, getState) => {
  const { auth: { token }, header: { currentUserId } } = getState()

  return callGet('/ap/getTemplate', token, {
    userId: currentUserId,
    templateId,
  })
}

// Save settings for a given campaign.
export const saveAp = payload => (dispatch, getState) => {
  dispatch({
    type: SAVE_AP,
  })

  const { auth: { token } } = getState()

  return callPost('/ap/save', payload, token).then((response) => {
    dispatch({
      type: SAVE_AP_SUCCESS,
      data: [payload.campaign_id],
    })

    if (response.data.amount) {
      dispatch({
        type: COIN_EARNED,
        history: {
          type: COIN_TYPE_AP_SETUP,
          amount: response.data.amount,
          newlyEarned: true,
        },
      })
    }

    toast.show({
      title: 'Success',
      description: 'Successfully applied Smart Pilot.',
    })
  })
}

// Save settings to multiple campaigns.
export const saveApMultiple = payload => (dispatch, getState) => {
  dispatch({
    type: SAVE_AP,
  })

  const { auth: { token } } = getState()

  return callPost('/ap/saveMultiple', payload, token).then((response) => {
    dispatch({
      type: SAVE_AP_SUCCESS,
      data: payload.campaignIds,
    })

    if (response.data.amount) {
      dispatch({
        type: COIN_EARNED,
        history: {
          type: COIN_TYPE_AP_SETUP,
          amount: response.data.amount,
          newlyEarned: true,
        },
      })
    }

    toast.show({
      title: 'Success',
      description: 'Successfully applied Smart Pilot to multiple campaigns.',
    })
  })
}

// Save settings as a template.
export const saveTemplate = (name, needApply, payload) => (dispatch, getState) => {
  dispatch({
    type: SAVE_AP_TEMPLATE,
  })

  const { auth: { token } } = getState()

  callPost('/ap/saveTemplate', Object.assign({
    name,
    needApply,
  }, payload), token).then((response) => {
    dispatch({
      type: SAVE_AP_TEMPLATE_SUCCESS,
      data: {
        id: response.data.id,
        name,
        apData: response.data.apData,
        campaignId: payload.campaign_id,
      }
    })

    toast.show({
      title: 'Success',
      description: 'Successfully saved template.',
    })
  })
}

// Turn on/off smart pilot in bulk.
export const turnBulk = (campaignIds, state, fromAPM = false) => (dispatch, getState) => {
  dispatch({
    type: TURN_AP_BULK,
    data: {
      fromAPM,
    }
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  return callPost('/ap/turnBulk', {
    userId: currentUserId,
    campaignIds,
    state,
  }, token).then((response) => {
    dispatch({
      type: TURN_AP_BULK_SUCCESS,
      data: {
        campaignIds: response.data.successIds,
        state: state === 'on',
        fromAPM,
      }
    })

    if (state === 'off' || !response.data.failedCampaigns.length) {
      toast.show({
        title: 'Success',
        description: `Turned ${state === 'on' ? 'on' : 'off'} successfully.`,
      })
    } else {
      let description = 'The following campaigns can\'t be turned on:<br />'
      description += response.data.failedCampaigns.map(({ name }) => `- ${name}<br />`)
      description += '<br />You must first save settings for these campaigns.<br />'
      description += 'Visit the smart pilot for each campaign or use a template and apply settings.'
      toast.show({
        title: 'Warning',
        description,
        duration: 5000,
      })
    }
  }).catch(() => {
    toast.show({
      title: 'Warning',
      description: `Failed to turn ${state === 'on' ? 'on' : 'off'}.`,
    })
  })
}

// Apply AP template in bulk.
export const applyTemplateBulk = (templateId, campaignIds, timeZone) => (dispatch, getState) => {
  dispatch({
    type: APPLY_TEMPLATE_BULK,
  })

  const { auth: { token }, header: { currentUserId } } = getState()

  return callPost('/ap/applyTemplateBulk', {
    userId: currentUserId,
    templateId,
    campaignIds,
    timeZone,
  }, token).then((response) => {
    dispatch({
      type: APPLY_TEMPLATE_BULK_SUCCESS,
      data: response.data,
    })

    toast.show({
      title: 'Success',
      description: 'The selected template has been applied successfully.',
    })
  }).catch(() => {
    toast.show({
      title: 'Warning',
      description: 'Failed to apply the template.',
    })
  })
}
