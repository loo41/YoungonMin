//logs.js
const app = getApp()

Page({
  data: {
    url: 'http://youngon.cn'
  },
  onLoad: function (option) {
    const {path} = option
    if (path === 'gz') {
      this.setData({
        url: app.globalData.gzUrl
      })
      return
    }
    this.setData({
      url: path
    })
  }
})
