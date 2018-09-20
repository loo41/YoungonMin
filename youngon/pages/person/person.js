const app = getApp()
import {_dealwithZorn} from '../../utils/util'

Page({
  data: {
    userinfo: app.globalData.userinfo,
    notRun: false
  },
  onLoad: function() {
    this._chckLogin()
  },
  onShow: function() {
    this._chckLogin()
  },
  _chckLogin: function() {
    let {userinfo} = app.globalData
    const that = this
    if (!userinfo.nickName && !userinfo.avatarUrl) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            that._getUserInfo()
          }
        },
      })
    } else {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            that.setData({userinfo: app.globalData.userinfo})
          } else {
            userinfo = {}
            app.globalData.userinfo = {}
            that.setData({userinfo})
          }
        },
      })
    }
  },
  _getUserInfo: function() {
    if (this.data.notRun) return
    this.setData({notRun: true})
    wx.getUserInfo({
      success: res => {
        wx.showLoading({title: '登陆中'})
        this.setData({
          userinfo: res.userInfo
        })
        switch (app.globalData.state) {
          case 0:
            app.globalData.userinfo = res.userInfo
            _dealwithZorn(app)
            break
          case 1:
            app.globalData.userinfo = res.userInfo
            break
          case 2:
            Object.assign(app.globalData.userinfo, res.userInfo)
            break
        }
        setTimeout(() => {wx.hideLoading()}, 500)
        this.setData({notRun: false})
      },
      fail: () => {
        console.log('未登录')
        this.setData({notRun: true})
      }
    })
  },
  _Nav: function(e) {
    const {id} = e.currentTarget
    if (!id) return
    wx.navigateTo({url: `/pages/${id}/${id}`})
  },
  _edition () {
    wx.showModal({
      title: '版本',
      content: '当前版本为1.0.0'
    })
  },
  _change () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          if (!app.globalData.isYoungon) {
            wx.showModal({
              title: '提示',
              content: '非网站人员没有可更改信息,请联系管理员',
            })
            return
          }
          wx.navigateTo({url: `/pages/info-change/info-change`})
        } else {
          wx.showModal({
            title: '提示',
            content: '未登陆',
          })
        }
      }
    })
  }
})