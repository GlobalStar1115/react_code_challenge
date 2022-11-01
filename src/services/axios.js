import axios from 'axios'

import { endpoint } from '../config/api'

export const callGet = (url, token, params = {}) => (
  axios.get(`${endpoint}${url}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    params,
  })
)

export const callPost = (url, payload, token = '') => {
  const headers = {}
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  return axios.post(`${endpoint}${url}`, payload, {
    headers,
  })
}
