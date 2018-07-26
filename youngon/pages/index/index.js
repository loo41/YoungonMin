//index.js
//获取应用实例
const {_checkSession, _setAjax, _login, _dealwithZorn} = require('../../utils/util')
const app = getApp()

Page({
  data: {
    swiperObject: {                              // 为首页所以数据
      indicatorDots: true,                       // 是否显示控制面板
      indicatorColor: 'rgba(0, 0, 0, 0.3)',      // 指示点颜色
      indicatorActiveColor: '#000000',           // 当前选中的指示点颜色
      autoplay: true,                            // 是否自动切换
      current: 0,                                // 当前所在滑块的 index
      interval: 5000,                            // 自动切换时间间隔
      duration: 500,                             // 滑动动画时长
      circular: false,                           // 是否采用衔接滑动
      vertical: false,                           // 滑动方向是否为纵向
      previousMargin: '0px',                     // 前边距
      nextMargin: '0px',                         // 后边距
      displayMultipleItems: 1,                   // 同时显示的滑块数量
      notice: {                                  // 公告
        status: true,
        content: "测试公告测试公告测试公告测测试公告测试公告测试公告测试公告测试公告"
      },
      imgUrls: [
        {
          url: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',   // 图片地址
          OuterChain: {url: 'https://eams.youngon.com.cn', type: 1, appId: '', path: '', extraData: []},   // 外联地址 type类型 0 1 2 // 0 是不展示 1是网页跳转 2是跳转的小程序
        }, 
        {
          url: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',
          OuterChain: {url: 'http://youngon.cn', type: 1, appId: '', path: '', extraData: []}
        }
      ]
    },
    notFrist: false,
    close: false,
    youngonTrends: [],
    animationData: {},
    trends: {
      page: 2,
      isBottom: false,
      isLoding: false
    }
  },
  onShow () {
    this.selectComponent('.slider')._youngonList()
  },
  onLoad: function() {
    let that = this
    wx.getNetworkType({
      success: function(res) {
        const networkType = res.networkType
        if (networkType.toString() === 'none') {
          that.setData({
            close: true
          })
          setTimeout(() => that.setData({close: false}), 2000)
          return
        }
        _checkSession().then(() => {}).catch(() => {
          if (wx.getStorageSync('token')) wx.removeStorageSync('tokan')
          _login(app) 
        })
        that._getSwiperInfo()
      }
    })
  },
  _closeMarquee () {
    this.data.swiperObject.notice.status = false
    this.setData({
      swiperObject: this.data.swiperObject
    })
  },
  onPullDownRefresh: function () {
    this._getSwiperInfo(true)
  },
  _getSwiperInfo(refesh) {
    const {BASEURL, state} = app.globalData
    let token = null
    let data = {}
    if (refesh) {
      token = wx.getStorageSync('token')
      data = {token, state}
    }
    const options = {url: `${BASEURL}/swiperInfo`, data}
    if (!refesh) wx.showLoading({title: '数据加载中'})
    _setAjax(options).then((result) => {
      if (!refesh) setTimeout(() => {wx.hideLoading()}, 500)
      const {swiper} = result.data
      if (result.trueChange !== 'youngon') _login(app)
      this.setData({swiperObject: swiper, youngonTrends: result.youngonTrends, notFrist: true})
      wx.stopPullDownRefresh()
      if (refesh) {
        let {trends} = this.data
        trends.page = 2
        trends.isBottom = false
        trends.isLoding = false
        this.setData({trends})
      }
    }).catch((e) => {
      console.log(e)
      wx.stopPullDownRefresh()
      if (!refesh) setTimeout(() => {wx.hideLoading()}, 500)
    })
  },

  onReachBottom () {
    let {youngonTrends, trends} = this.data
    if (youngonTrends.length % 3 !== 0 || trends.isBottom) {
      trends.isBottom = true
      this.setData({trends: trends})
      return
    }
    const {BASEURL} = app.globalData
    const options = {url: `${BASEURL}/trends?page=${trends.page}`}
    if (trends.isLoding) return; trends.isLoding = true; this.setData({trends: trends})
    _setAjax(options).then((result) => {
      const {data} = result
      if (data.length === 0) {
        trends.isLoding = false
        trends.isBottom = true
        this.setData({trends: trends})
        return
      }
      youngonTrends = youngonTrends.concat(data) 
      trends.isLoding = false
      trends.page = trends.page + 1
      this.setData({
        trends: trends,
        youngonTrends: youngonTrends
      })
    }).catch((e) => {
      console.log(e)
      trends.isLoding = false
      this.setData({
        trends: trends
      })
    })
  },

  _navTrendsCon(e) {
    let {id} = e.currentTarget
    let target = id.split('&&')
    wx.navigateTo({url: `/pages/trends/trends?title=${target[1]}&_id=${target[0]}`})
  },

  _openOther: function(e) {
    const {id} = e.target
    const otherUrl = this.data.swiperObject.imgUrls[id].OuterChain
    if (otherUrl.type === 0) return false
    if (otherUrl.type === 2) {
      const {appId, path, extraData} = otherUrl                                // 如果是对象就打开小程序
      wx.navigateToMiniProgram({  
        appId, path, extraData,                                                // 参照小程序打开另一小程序参数
        success: function() {},
        fail: function() {wx.navigateBackMiniProgram({})}
      })
      return null
    }
    this._openOtherChain(otherUrl.url)
  },

  _openOtherChain (path) {
    wx.navigateTo({url: `/pages/webView/webView?path=${path}`})
  },

  _openSlider: function(){
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let animationBox = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.left(0).step()
    animationBox.left(0).step()
    this.setData({
      animationData: animation.export(),
      animationDataBox: animationBox.export()
    })
  },

  _closeSlider: function() {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let animationBox = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.left('-60%').step()
    animationBox.left('-100%').step()
    this.setData({
      animationData: animation.export(),
      animationDataBox: animationBox.export()
    })
  },

  bindGetUserInfo: function() {
    const {userinfo} = app.globalData
    if (userinfo.nickName && userinfo.avatarUrl) return
    wx.getUserInfo({
      success: res => {
        wx.showLoading({title: '登陆中'})
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
      },
      fail: () => {console.log('登陆失败')}
    })
  },

  _signed: function() {
    const {isYoungon, state} = app.globalData
    if (state === 0) {
      wx.showModal({
        title: '提示',
        content: '对不起! 你还未登陆注册',
      })
    } else if (!isYoungon) {
      wx.showModal({
        title: '提示',
        content: '对不起! 该版块只对站员开放',
      })
    } else {
      wx.navigateTo({url: '/pages/sign/sign'})
    }
  },

  _notice: function() {
    wx.navigateTo({url: `/pages/notice/notice`})
  },

  _aboutUs: function() {
    wx.navigateTo({url: `/pages/about-us/about-us`})
  },

  _gzAricle: function() {
    wx.navigateTo({url: `/pages/gz-article/gz-article`})
  },
  _chat: function () {
    const {state} = app.globalData
    if (state === 0) {
      wx.showModal({
        title: '提示',
        content: '对不起! 未登录',
      })
      return
    }
    wx.navigateTo({url: `/pages/chat/chat`})
  }
})