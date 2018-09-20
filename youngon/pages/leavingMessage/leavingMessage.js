let app = getApp()
const { _setAjax} = require('../../utils/util')

Page({
  data: {
    leave: false,
    loading: false,
    disabled: false,
    leaveValue: '',
    list: []
  },
  onLoad () {
    this._getLeaveList()
  },
  _getLeaveList () {
    const {BASEURL} = app.globalData
    let {list} = this.data
    let options = {url: `${BASEURL}/leave-list`}
    _setAjax(options).then((result) => {
      list = result.list
      this.setData({list})
    })
  },
  _openShare () {
    this.setData({leave: true})
  },
  _stop () {return},
  _closeShare () {
    this.setData({leave: false})
  },
  _upLeave () {
    const {leaveValue} = this.data
    let that = this
    if (!leaveValue) return
    const {BASEURL} = app.globalData
    let token = wx.getStorageSync('token')
    let options = {url: `${BASEURL}/add-leave`, data: {leaveValue, token}, method: 'POST'}
    that.setData({loading: true, disabled: true})
    _setAjax(options).then(() => {
      that.setData({loading: false, disabled: false})
      wx.showModal({title: '提示', content: '留言成功'})
      that._clear()
    }).catch(() => {
      that.setData({loading: false, disabled: false})
    })
  },
  _clear () {
    let {leaveValue} = this.data
    leaveValue = ''
    this.setData({leaveValue})
  },
  _getLeaveValue (e) {
    let value = e.detail.value
    if (!value) return
    let {leaveValue} = this.data
    leaveValue = value
    this.setData({leaveValue})
  }
})