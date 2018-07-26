let app = getApp()
const {_setAjax} = require('../../utils/util')

Page({
  data: {
    user: {        
    },
    sys: {},
    animationData: {},
    animationDataBox: {},
    ariseanimationData: {},
    isArise: false,
    arise: false,
    userBox: {height: 0, width: 0}
  },
  onLoad: function(options) {
    const {index, id} = options
    this._getSys()
    if (id && !index) {
      wx.showLoading({title: '加载中'})
      const {BASEURL} = app.globalData
      let option = {
        url: `${BASEURL}/get-userinfo`,
        data: {id}
      }
      _setAjax(option).then((result) => {
        const {data} = result
        this.setData({
          user: data
        })
        wx.hideLoading()
        return
      }).catch((e) => {
        console.log(e) 
        setTimeout(() => {wx.hideLoading()}, 500)
      })
    } else {
      this.setData({
        user: app.globalData.youngonPerson[index]
      })
    }
  },
  _getSys () {
    const sys = wx.getSystemInfoSync()
    let userBox = {
      height: sys.windowHeight,
      width: sys.windowWidth,
      H: sys.windowHeight-200
    }
    this.setData({
      sys: sys,
      userBox: userBox
    })
  },
  _ariseAnimation () {
    let animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease',
    })
    animation.width('300rpx').step()
    this.setData({
      ariseanimationData: animation.export(),
      isArise: true
    })
  },
  _animation () {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.height(200).step()
    this.setData({
      animationData: animation.export(),
      arise: true
    })
    let animationBox = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animationBox.translateY(75).step()
    setTimeout(() => {
      this.setData({
        animationDataBox: animationBox.export()
      })
    }, 1000)
  },
  _call (e) {
    let phone = e.currentTarget.id
    if (!phone) return
    wx.makePhoneCall({phoneNumber: phone})
  },
  _keepUser () {
    if (wx.canIUse(`addPhoneContact`)) {
      wx.addPhoneContact({
        nickName: this.data.user.username,
        mobilePhoneNumber: this.data.user.phone,
        email: this.data.user.email,
        url: 'http://youngon.cn'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})