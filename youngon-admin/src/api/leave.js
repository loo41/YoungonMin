import axios from '@/libs/api.request'

export const getListList = (params) => {
  return axios.request({
    url: 'leave_list',
    params,
    method: 'get'
  })
}

export const delLeave = (params) => {
  return axios.request({
    url: 'delect_leave',
    params,
    method: 'get'
  })
}

export const changeCarefully = (params) => {
  return axios.request({
    url: 'change_careful',
    params,
    method: 'get'
  })
}
