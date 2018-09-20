let app = getApp()
const { _setAjax} = require('../../utils/util')

Page({
  data: {
    type: null,
    list: []
  },
  onLoad (options) {
    const {type} = options
    this.data.type = type
    this.setData({type: this.data.type})
    this._getSignRecord(type)
  },
  _getSignRecord (type) {
    const {BASEURL} = app.globalData
    const options = {url: `${BASEURL}/youngon-record?type=${type}`}
    wx.showLoading({title: '加载中'})
    _setAjax(options).then((result) => {
      this.setData({list: result.list})
      setTimeout(() => wx.hideLoading(), 500)
    }).catch((e) => {setTimeout(() => wx.hideLoading(), 500)})
  },
  _Nav (e) {
    const {id} = e.currentTarget
    if (!id) return
    wx.navigateTo({url: `/pages/detailed-info/detailed-info?id=${id}`})
  }
})