//获取应用实例
const { _setAjax} = require('../../utils/util')
const WxParse = require('../../wxParse/wxParse.js')
const app = getApp()

Page({
  data: {
      title: ''
  },
  onLoad: function(options) {
    const {title, _id} = options
    wx.setNavigationBarTitle({title})
    this.setData({
      title: title
    })
    this._getContent(_id)
  },
  _getContent: function(_id) {
    const {BASEURL} = app.globalData
    const that = this
    wx.showLoading({
      title: '加载中',
    })
    const options = {url: `${BASEURL}/content?id=${_id}`}
    _setAjax(options).then((result) => {
      WxParse.wxParse('article', 'html', result.data[0].content, that, 5)
      setTimeout(() => wx.hideLoading(), 500)
    }).catch((e) => {setTimeout(() => wx.hideLoading(), 500)})
  }
})