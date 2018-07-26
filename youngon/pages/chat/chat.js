const {_setAjax} = require('../../utils/util')
const app = getApp()

Page({
  data: {
    people: 0,
    disUser: {
      nickName: 'awd',
      avatarUrl: ''
    },
    message: '',
    notArise: false,
    chatList: [],
    scrollTop: 420
  },
  onLoad () {
    if (app.globalData.webS) {
      this._close().then(() => {
        wx.showLoading({title: '服务器连接中'})
        this._chatConnet()
      }).catch(() => {
        wx.navigateBack({})
      })
    } else {
      wx.showLoading({title: '服务器连接中'})
      this._chatConnet()
    }
  },
  onUnload () {
    this._close()
  },
  _close () {
    return new Promise((resolve, reject) => {
      console.log('关闭')
      let chatToken = wx.getStorageSync('chatToken')
      wx.sendSocketMessage({
        data: JSON.stringify({type: 3, chatToken: chatToken}),
        success: function () {
          wx.closeSocket()
          app.globalData.webS = false
          resolve()
        },
        fail: function () {
          app.globalData.webS = false
          reject()
        }
      })
    })
  },
  _chatConnet () {
    let that = this
    let token = wx.getStorageSync('token')
    wx.connectSocket({
      url: 'wss://wy.tianchenyong.top/wss',
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success() {
        console.log('连接成功success')
      },
      fail() {
        console.log('连接失败fail')
      }
    })
    wx.onSocketError(function(res){
      console.log('WebSocket连接打开失败，请检查！')
      wx.navigateBack({})
    })
    wx.onSocketOpen(function () {
      console.log('已经打开')
      app.globalData.webS = true
      wx.onSocketMessage(function (res) {
        res.data = JSON.parse(res.data)
        const {type} = res.data
        console.log(type)
        if (type === 1) {
          that.setData({people: res.data.people})
          that.data.chatList = res.data.chatFiveMes
          that.setData({chatList: that.data.chatList})
          wx.sendSocketMessage({
            data: JSON.stringify({type: 1, token}),                             // 1 发送后端创作chatToken
          })
        } else if (type === 2) {
          let {display, chatToken} = res.data
          wx.setStorageSync('chatToken', chatToken)
          that.setData({disUser: display, notArise: true})
          that._dis()
        } else if (type === 3) {
          that.data.chatList.push(res.data.message)
          that.setData({chatList: that.data.chatList})
        } else if (type === 4) {
          if (that.data.notArise) {
            that.setData({people: res.data.people})
            return
          }
          let {display, people} = res.data
          that.setData({disUser: display, notArise: true, people})
          that._dis()
        }
        wx.hideLoading()
        that.setData({scrollTop: (that.data.chatList.length * 70)})
      })
    })
  },
  _dis () {
    let that = this
    setTimeout(() => {
      that.setData({notArise: false})
    }, 5000)
  },
  sedMeassage () {
    if (this.data.message === '') return
    let that = this
    let chatToken = wx.getStorageSync('chatToken')
    wx.sendSocketMessage({
      data: JSON.stringify({type: 2, chatToken, message: that.data.message})                         
    })
    this.setData({message: ''})
  },
  _getValue: function(e) {
    this.data.message = e.detail.value
    this.setData({message: this.data.message})
  },
  _loadingMore () {
    wx.showLoading({title: '消息加载中'})
    const {BASEURL} = app.globalData
    let that = this
    let data = {length: this.data.chatList.length}
    const options = {url: `${BASEURL}/more-chat`, data}
    _setAjax(options).then((result) => {
      let {data} = result
      if (data.length === 0) return
      data = data.concat(that.data.chatList)
      that.setData({chatList: data, scrollTop: data.length * 70})
      wx.hideLoading()
    }).catch(() => wx.hideLoading())
  }
})