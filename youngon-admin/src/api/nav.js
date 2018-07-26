import axios from '@/libs/api.request'

export const updateSwiper = (data) => {
  return axios.request({
    url: 'update_swiper',
    data,
    method: 'post'
  })
}

export const delectImage = (data) => {
  return axios.request({
    url: 'delect_image',
    data,
    method: 'post'
  })
}

export const getSwiperInfo = (data) => {
  return axios.request({
    url: 'swiper_info',
    method: 'get'
  })
}

export const initNav = () => {
  return axios.request({
    url: 'swiper_init',
    method: 'get'
  })
}
