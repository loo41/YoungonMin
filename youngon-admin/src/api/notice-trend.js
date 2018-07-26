import axios from '@/libs/api.request'

export const upTrends = (data) => {
  return axios.request({
    url: 'up-trends',
    data,
    method: 'post'
  })
}

export const upNotice = (data) => {
  return axios.request({
    url: 'up-notice',
    data,
    method: 'post'
  })
}

export const updateContent = (data) => {
  return axios.request({
    url: 'update-content',
    data,
    method: 'post'
  })
}

export const delect = (params) => {
  return axios.request({
    url: 'delect-info',
    params,
    method: 'get'
  })
}

export const getList = (params) => {
  return axios.request({
    url: 'get-list',
    params,
    method: 'get'
  })
}
