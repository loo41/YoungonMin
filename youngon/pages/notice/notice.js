//获取应用实例
const { _setAjax} = require('../../utils/util')
const app = getApp()

Page({
  data: {
    page: 1,
    inputs: {
      value: ''
    },
    list: [{
      _id: 'adawdaw',
      title: 'String',
      picture: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',
      author: 'Tcyong',
      timer: '123415'
    }],
    noClick: true, // 解决安卓点击带动事件问题
    copyList: []
  },
  onLoad: function() {
    this._getlist()
  },
  _clearInput () {
    this.data.inputs.value = ''
    this.setData({
      inputs: this.data.inputs,
      noClick: false
    })
  },
  _getValue: function(e) {
    this.data.inputs.value = e.detail.value
    this.setData({value: this.data.inputs.value})
  },

  _getlist: function() {
    const {BASEURL} = app.globalData
    const {page} = this.data
    wx.showLoading({title: '加载中',})
    const options = {url: `${BASEURL}/notice-list?page=${page}`}
    _setAjax(options).then((result) => {
      const {data} = result
      setTimeout(() => wx.hideLoading(), 500)
      this.setData({page: page + 1, list: data})
    }).catch(() => setTimeout(() => wx.hideLoading(), 500))
  },

  _searchValue () {
    const {inputs, list} = this.data
    let that = this
    if (!inputs.value) return
    this.setData({copyList: list, noClick: true})
    const {BASEURL} = app.globalData
    const options = {url: `${BASEURL}/search-notice`, data: {
      title: inputs.value
    }}
    _setAjax(options).then((result) => {
      const {data} = result
      setTimeout(() => wx.hideLoading(), 500)
      that.setData({list: data})
    }).catch((e) => {
      setTimeout(() => wx.hideLoading(), 500)
      that.setData({list: []})
    })
  },

  _before () {
    if (this.data.noClick && !this.data.inputs.value && this.data.copyList.length !== 0) {
      this.setData({
        list: this.data.copyList
      })
    }
  },

  _NavContent (e) {
    let {id} = e.currentTarget
    let target = id.split('&&')
    wx.navigateTo({url: `/pages/trends/trends?title=${target[1]}&_id=${target[0]}`})
  }
})