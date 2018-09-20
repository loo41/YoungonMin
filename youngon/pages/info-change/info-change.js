const app = getApp()
const {_setAjax} = require('../../utils/util')

Page({
  data: {
    token: null,
    loading: false,
    disabled: false,
    user: {
      _id: 'adwdad',
      id: 'adwda',
      username: 'String',
      email: 'String',
      phone: 'String',
      vip: 'awdad',
      headerImg: 'https://avatars2.githubusercontent.com/u/39424446?v=4&s=120',                                                          // 头像
      motto: 'String',                                                          // 座右铭
      grade: 2,                                                          // 1代码大一 2大二 3大三
      post: 2,                                                           // 1代表站长 2代表部长 3代表正式站员 4代表实习站员 5 副站
      state: 1,                                                          // 1代表在站 2代表不在站
      department: 1,                                                     // 1开发 2企划 3运营 4信息
      userinfo: 'adwdawd',              // userinfo
    },
    animationData: {},
    isError: false,
    gradeItems: [{name: '大一', value: 1}, {name: '大二', value: 2},{name: '大三', value: 3}, {name: '大四', value: 4}],
    postItems: [{name: '站长', value: 1}, {name: '副站', value: 2}, {name: '部长', value: 3}, {name: '正式', value: 4}, {name: '实习', value: 5}],
    stateItems: [{name: '在站', value: 1},{name: '不在站', value: 2}],
    deItems: [{name: '开发', value: 1},{name: '企划', value: 2}, {name: '运营', value: 3}, {name: '信息', value: 4}],
  },
  onLoad () {
    const token = wx.getStorageSync("token")
    this.setData({
      token: token
    })
    this._getUserInfo()
  },
  _getUserInfo () {
    const {BASEURL} = app.globalData
    const {token} = this.data
    const that = this
    if (!token) {
      this.setData({isError: true})
      wx.showModal({
        title: '提示',
        content: '没有找到用户信息',
        success: function(res) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
      return
    }
    const options = ({
      url: `${BASEURL}/user-detailed`,
      data: {token}
    })
    wx.showLoading({
      title: '加载中',
    })
    _setAjax(options).then((result) => {
      const {data} = result
      setTimeout(() => wx.hideLoading(), 500)
      const {gradeItems, postItems, stateItems, deItems} = this.data
      const {grade, post, state, department} = data
      gradeItems[grade-1].checked = true
      postItems[post-1].checked = true
      stateItems[state-1].checked = true
      deItems[department-1].checked = true
      that.setData({
        user: data,
        gradeItems,
        stateItems,
        postItems,
        deItems
      })
      that._animation()
    }).catch((e) => {
      that._animation()
      wx.hideLoading()
      this.setData({isError: true})
      wx.showModal({
        title: '提示',
        content: '没有找到用户信息',
        success: function(res) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    })
  },
  _animation () {
    let animation = wx.createAnimation({
      duration: 2000,
      timingFunction: 'ease',
    })
    animation.height('200rpx').width('200rpx').step()
    this.setData({
      animationData: animation.export(),
      arise: true
    })
  },
  _getValue (e) {
    const {id} = e.target
    const {value} = e.detail
    console.log(value)
    if (!value) return
    const {user} = this.data
    switch(id) {
      case 'username':
        user.username = value
        this.setData({user})
        break
      case 'email':
        user.email = value
        this.setData({user})
        break
      case 'phone':
        user.phone = value
        this.setData({user})
        break
      case 'motto':
        user.motto = value
        this.setData({user})
        break
    }
  },
  _radioChange (e) {
    const {id} = e.target
    const {value} = e.detail
    if (!value) return
    const {user} = this.data
    switch(id) {
      case 'grade':
        user.grade = value
        this.setData({user})
        break
      case 'post':
        user.post = value
        this.setData({user})
        break
      case 'state':
        user.state = value
        this.setData({user})
        break
      case 'department':
        user.department = value
        this.setData({user})
        break
    }
  },
  _changeImg: function() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function(tempFilePaths) {
        const {tempFiles} = tempFilePaths
        if (tempFiles[0].size > 200000) {
          wx.showModal({title: '提示', content: '对不起! 文件太大'})
          return
        }
        const {user} = that.data
        user.headerImg = tempFiles[0].path
        that.setData({
          tempFilePaths: tempFiles,
          user: user
        })
      }
    })
  },
  _updateInfo: function() {
    const that = this
    wx.showModal({
      title: '提示',
      content: '确认更改信息',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            loading: true,
            disabled: true
          })
          that._change()
        } else if (res.cancel) {
          return
        }
      }
    })
  },
  _change () {
    this._updateImg().then(() => {
      this._upData()
    }).catch((e) => {
      this._upData()
    })
  },
  _upData: function() {
    const {BASEURL} = app.globalData
    const that = this
    console.log(this.data.user)
    const options = {url: `${BASEURL}/update-info`, data: this.data.user, method: 'POST'}
    _setAjax(options).then(() => {
      that.setData({
        loading: false,
        disabled: false
      })
    }).catch((e) => {
      that.setData({
        loading: false,
        disabled: false
      })
    })
  },
  _updateImg() {
    const {BASEURL} = app.globalData
    const {user} = this.data
    const that = this
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${BASEURL}/upload`, //仅为示例，非真实的接口地址
        filePath: user.headerImg,
        name: 'img',
        success: function(res){
          let data = JSON.parse(res.data)
          const backUrl = data.url
          user.headerImg = `http://wy.tianchenyong.top/${backUrl}`
          that.setData({user: user})
          resolve()
        },
        fail: function() {
          reject()
        }
      })
    })
  }
})