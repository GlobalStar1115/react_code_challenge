import axios from 'axios'
import { endpoint } from '../../config/api'
import {
  UPLOAD_KEYWORDS_START,
  UPLOAD_KEYWORDS_SUCCEED
} from '../actionTypes/api'

export const uploadKeywordStart = () => {
	return {
		type: UPLOAD_KEYWORDS_START
	}
}
export const uploadKeywordSucceed = (data) => {
	return {
		type: UPLOAD_KEYWORDS_SUCCEED,
        data
	}
}
export const uploadKeywords = (data) => (dispatch) => {
	const token = 'Bearer ' + data.token
	dispatch(uploadKeywordStart())
	axios.post(endpoint+'/api/uploadKeywords/', data.keywordsData, {headers:{authorization: token}}).then(function (response) {
		dispatch(uploadKeywordSucceed(response['data']))
	})
}
