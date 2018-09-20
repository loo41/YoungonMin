import {_setAjax} from '../../../utils/util'
const app = getApp()

Component({
  properties: {
    list: {
      type: Array,
      value: []
    }
  },
  data: {
    focus: false,
    isLoding: false,
    list: [],
    page: 2,
    noMore: false,
    value: '',
    by: false            // 判断是否搜索过
  },
  methods: {
    _youngonList: function () {
      new Promise((resole, reject) => {
        const {BASEURL} = app.globalData
        const options = {url: `${BASEURL}/youngon-person?page=1`}
        _setAjax(options).then((result) => {
          let {data} = result
          this.setData({list: data})
          app.globalData.youngonPerson = data
          resole()
        }).catch((e) => {reject(e)})
      })
    },
    _before: function() {
      if (this.data.by && !this.data.value) {
        const {youngonPerson} = app.globalData
        this.setData({
          list:youngonPerson
        })
      }
    },
    _getValue: function(e) {
      this.setData({value: e.detail.value})
    },
    _soso: function() {
      this._soInfo()
    },
    _soInfo: function() {
      const value = this.data.value
      if (!value) return
      const {BASEURL} = app.globalData
      const options = {url: `${BASEURL}/search-youngon?`, data: {
        user: value
      }}
      _setAjax(options).then((result) => {
        const {data} = result
        this.setData({list: data, by: true})
      }).catch((e) => {console.log(e)})
    },
    _loadingMore: function() {
      let { isLoding, list, noMore } = this.data
      if (noMore) return
      if (isLoding) return; isLoding = true; this.setData({isLoding: isLoding});
      const {BASEURL} = app.globalData
      const options = {url: `${BASEURL}/youngon-person?page=${this.data.page}`}
      wx.showToast({title: '数据加载中',  icon: 'loading', duration: 10000})
      _setAjax(options).then((result) => {
        const {data} = result
        if (data.length < 20) noMore = true
        const flagArray = this.data.list.concat(data)
        app.globalData.youngonPerson = flagArray
        isLoding = false
        this.setData({
          list: flagArray,
          page: this.data.page+1,
          isLoding: isLoding,
          noMore
        })
        setTimeout(() => wx.hideToast(), 500)
      }).catch(() => {
        isLoding = false
        this.setData({isLoding: isLoding})
        setTimeout(() => wx.hideToast(), 500)
      })
    },
    _navigationInfo: function(e) {
      wx.navigateTo({url: `/pages/detailed-info/detailed-info?index=${e.currentTarget.id}`})
    }
  }
})