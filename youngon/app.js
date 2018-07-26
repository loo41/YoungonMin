//app.js
import {_login} from './utils/util'

App({
  onLaunch: function () {
    if (wx.getStorageSync('token')) wx.removeStorageSync('tokan')
    _login(this) 
  },
  globalData: {
    BASEURL: `https://wy.tianchenyong.top/Wclient`,
    userinfo: {},
    isUni: 1,
    state: 1,
    youngonPerson: [],
    isYoungon: false,
    gzUrl: null,
    gzData: []
  }
})