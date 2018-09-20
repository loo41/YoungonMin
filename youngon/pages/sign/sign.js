let app = getApp()
const { _setAjax} = require('../../utils/util')

Page({  
  data: {
    shareValue: '',
    share: false,
    loading: false,
    disabled: false,
    loadings: false,
    disableds: false,
    locationinfo: {
      latitude: '暂',
      longitude: '无',
      SSID: '暂无'
    },
    signType: [{name: '值班', value: 1}, {name: '例会', value: 2}, {name: '补值班', value: 3}, {name: '其他', value: 4}],
    signoutType: [{name: '是', value: 1}, {name: '否', value: 2}],
    navbar: ['首页', '签到', '记录'],  
    currentTab: 0,
    signInfo: {
      presence: [],
      Honor: [{}],
      forgetSign: [],
      carrierKey: [],
      signState: true,  
      joke: [],
    },
    type: null,
    signOutType: null,
    checked: false,
    application: {startTime: '', startClass: '', endTime: '', endClass: '', secondEndTime: '', secondEndClass: '', value: ''},
    lesson: ['第一大节', '第二大节', '第三大节', '第四大节']
  },
  onLoad () {
    this._getSignInfo()
    this._getLoationInfo()
  },
  onShow () {
    let that = this
    wx.onWifiConnected(function (wifi) {
      const {SSID, BSSID} = wifi
      const {application} = that.data
      application.SSID = SSID
      application.BSSID = BSSID
      that.setData(application)
    })
  },
  _getLoationInfo () {
    const {locationinfo} = this.data
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        locationinfo.latitude = res.latitude
        locationinfo.longitude = res.longitude
        that.setData({locationinfo})
        that._getWifiInfo().then((result) => {
          const {wifi} = result
          locationinfo.SSID = wifi.SSID
          locationinfo.BSSID = wifi.BSSID
          that.setData({locationinfo})
        }).catch((e) => console.log(e))
      }
    })
  },
  _getWifiInfo () {
    return new Promise((resolve, reject) => {
      wx.startWifi({
        success: function() {
          wx.getConnectedWifi({
            success: function(res) {
              console.log(res)
              resolve(res)
            },
            fail (e) {
              reject(e)
            }
          })
        }
      })
    })
  },
  _getSignInfo () {
    return new Promise((resolve, reject) => {
      const {BASEURL} = app.globalData
      const token = wx.getStorageSync('token')
      const options = {url: `${BASEURL}/sign-info`, data: {token}}
      wx.showLoading({title: '加载中'})
      _setAjax(options).then((result) => {
        const {data} = result
        console.log(data)
        this.setData({signInfo: data})
        wx.hideLoading()
        resolve()
      }).catch((e) => {
        console.log(e)
        wx.hideLoading()
        reject()
      })
    })
  },
  _moreRecord (e) {
    const {id} = e.target
    wx.navigateTo({
      url: `/pages/record/record?type=${id}`
    })
  },
  navbarTap: function(e){  
    this.setData({  
      currentTab: e.currentTarget.dataset.idx  
    })  
  },
  onPullDownRefresh () {
    this._getSignInfo().then(() => {
      wx.stopPullDownRefresh()
    }).catch(() => wwx.stopPullDownRefresh())
  },
  _Nav (e) {
    const {id} = e.currentTarget
    if (!id) return
    wx.navigateTo({url: `/pages/detailed-info/detailed-info?id=${id}`})
  },
  _checkboxChange (e) {
    this.setData({
      type: e.detail.value
    })
  },
  _checkSignOutChange (e) {
    this.setData({
      signOutType: e.detail.value
    })
  },
  _openApplicetion (e) {
    this.setData({
      checked: e.detail.value
    })
  },
  _bindChange (e) {
    const {application} = this.data
    const {id} = e.currentTarget
    switch (id) {
      case 'start':
        application.startTime = e.detail.value
        this.setData({application})
        break
      case 'end':
        application.endTime = e.detail.value
        this.setData({application})
        break
      case 'startClass':
        application.startClass = Number(e.detail.value)
        this.setData({application})
        break
      case 'endClass':
        application.endClass = Number(e.detail.value)
        this.setData({application})
        break
      case 'secondEndTime':
        application.secondEndTime = e.detail.value
        this.setData({application})
        break
      case 'secondEndClass':
        application.secondEndClass = Number(e.detail.value)
        this.setData({application})
        break
    }
  },
  _sign () {
    const {locationinfo, type, signInfo} = this.data
    let that = this
    if (locationinfo.latitude === '暂' && locationinfo.SSID === '暂无') {
      wx.showModal({title: '提示', content: '没有位置信息或WIFI信息不能签到',})
      return
    } else if (!type) {
      wx.showModal({title: '提示', content: '签到类型不能为空',})
      return
    } else {
      const {BASEURL} = app.globalData
      const token = wx.getStorageSync('token')
      let options = {url: `${BASEURL}/sign`, data: {locationinfo, type, token}, method: 'POST'}
      that.setData({loading: true, disabled: true})
      _setAjax(options).then(() => {
        signInfo.signState = true
        that.setData({loading: false, disabled: false, signInfo})
        wx.showModal({title: '提示', content: '签到成功'})
        this._getSignInfo()
      }).catch((code) => {
        wx.showModal({title: '提示', content: '签到失败',})
        that.setData({loading: false, disabled: false})
      })
    }
  },
  _signOut () {
    const {signInfo, signOutType} = this.data
    let that = this
    if (!signOutType) {
      wx.showModal({title: '提示', content: '是否为钥匙携带者',})
      return
    } else {
      const {BASEURL} = app.globalData
      const token = wx.getStorageSync('token')
      let options = {url: `${BASEURL}/sign-out`, data: {token, signOutType}, method: 'POST'}
      that.setData({loading: true, disabled: true})
      _setAjax(options).then(() => {
        signInfo.signState = false
        that.setData({loading: false, disabled: false, signInfo})
        this._getSignInfo()
      }).catch((code) => {
        that.setData({loading: false, disabled: false})
      })
    }
  },
  _getInputValue (e) {
    let value = e.detail.value
    if (!value) return
    const {application} = this.data
    application.value = value
    this.setData({application})
  },
  _applicationUp () {
    const {application} = this.data
    let that = this
    if (!Object.values(application).every((item) => item !== '')) {
      wx.showModal({title: '提示', content: '输入不完整'})
      return
    } else {
      const {BASEURL} = app.globalData
      const {application} = this.data
      const token = wx.getStorageSync('token')
      let options = {url: `${BASEURL}/apply`, data: {application, token}, method: 'POST'}
      that.setData({loadings: true, disableds: true})
      _setAjax(options).then(() => {
        that.setData({loadings: false, disableds: false})
        wx.showModal({title: '提示', content: '申请成功等待管理员审核'})
        that._clear()
      }).catch((code) => {
        that.setData({loadings: false, disableds: false})
      })
    }
  },
  _clear () {
    let {application, shareValue} = this.data
    application = {}
    shareValue = ''
    this.setData({application, shareValue})
  },
  _getShareValue (e) {
    let value = e.detail.value
    if (!value) return
    let {shareValue} = this.data
    shareValue = value
    this.setData({shareValue})
  },
  _upShare () {
    const {shareValue} = this.data
    let that = this
    if (!shareValue) return
    const {BASEURL} = app.globalData
    const token = wx.getStorageSync('token')
    let options = {url: `${BASEURL}/add-share`, data: {shareValue, token}, method: 'POST'}
    that.setData({loading: true, disabled: true})
    _setAjax(options).then(() => {
      that.setData({loading: false, disabled: false})
      wx.showModal({title: '提示', content: '发布成功'})
      that._clear()
    }).catch((code) => {
      that.setData({loading: false, disabled: false})
    })
  },
  _openShare () {
    this.setData({share: true})
  },
  _closeShare (e) {
    console.log(e)
    this.setData({share: false})
  },
  _stop () {return}
})  