import { 
  UPLOAD_KEYWORDS_START,
  UPLOAD_KEYWORDS_SUCCEED
} from '../actionTypes/api.js'

export const initialState = {
  isUploadingKeywords: false,
  uploadedKeywords: []
}

const api = (state = initialState, action) => {
	switch (action.type) {
    case UPLOAD_KEYWORDS_START:
      return {
          ...state,
          isUploadingKeywords: true
      }

    case UPLOAD_KEYWORDS_SUCCEED:
      return {
          ...state,
          isUploadingKeywords: false,
          uploadedKeywords: action.data.keywords
      }
    default:
      return state
  }
}

export default api