const app = getApp()
const {_setAjax} = require('../../utils/util')

Page({
  data: {
    array: ['news', 'image', 'video'],
    type: 'news',
    box: {},
    gzInfo: {
      news:  {type: 'news', offset: 0, count: 20},
      image: {type: 'image', offset: 0, count: 20},
      video: {type: 'video', offset: 0, count: 20}
    },
    typeInfo: {
      news: {item: []},
      image: {item: []},
      video: {item: []}
    }
  },
  onLoad: function(){
    this._getMaterial()
    this._getSys()
  },
    _getSys () {
    const sys = wx.getSystemInfoSync()
    let box = {
      height: sys.windowHeight,
      width: sys.windowWidth,
    }
    this.setData({
      box: box
    })
  },
  _getMaterial (info) {
    console.log(JSON.stringify(this.data.typeInfo.news.item))
    if (JSON.stringify(app.globalData.gzData) !== '[]') {
      this.setData({typeInfo: app.globalData.gzData})
      return
    }
    const {BASEURL} = app.globalData
    const options = {
      url: `${BASEURL}/gz-list`,
      data: info || {},
      method: 'POST'
    }
    wx.showLoading({title: '加载中'})
    _setAjax(options).then((result) => {
      const {data} = result
      const {typeInfo, gzInfo} = this.data
      if (!info) {
        typeInfo.image.item = typeInfo.image.item.concat(data[0].item)
        gzInfo.image.offset += data[0].item.length

        typeInfo.video.item = typeInfo.video.item.concat(data[1].item)
        gzInfo.video.offset += data[1].item.length

        typeInfo.news.item = typeInfo.news.item.concat(data[2].item)
        gzInfo.news.offset += data[2].item.length
        typeInfo.image.total_count = data[0].total_count
        typeInfo.video.total_count = data[1].total_count
        typeInfo.news.total_count = data[2].total_count
      } else {
        switch(info.type) {
          case 'news':
            typeInfo.news.item = typeInfo.news.item.concat(data.item)
            gzInfo.news.offset += data.item.length
            break
          case 'image':
            typeInfo.image.item = typeInfo.image.item.concat(data.item)
            gzInfo.image.offset += data.item.length
            break
          case 'video':
            typeInfo.video.item = typeInfo.video.item.concat(data.item)
            gzInfo.video.offset += data.item.length
            break
        }
      }
      app.globalData.gzData = typeInfo
      this.setData({typeInfo, gzInfo})
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      setTimeout(() => {wx.hideLoading()}, 500)
    })
  },
  bindPickerChange (e) {
    this.setData({
      type: this.data.array[e.detail.value]
    })
  },
  _loadingmore (e) {
    const {id} = e.target
    const {typeInfo, gzInfo} = this.data
    switch (id) {
      case 'news':
        if (gzInfo.news.offset > Number(typeInfo.total_count)) {
          return
        }
        this._getMaterial(gzInfo.news)
        break
      case 'image':
        if (gzInfo.image.offset > Number(typeInfo.total_count)) {
          return
        }
        this._getMaterial(gzInfo.image)
        break
      case 'video':
        if (gzInfo.video.offset > Number(typeInfo.total_count)) {
          return
        }
        this._getMaterial(gzInfo.video)
        break
    }
  },
  _show (e) {
    const {id} = e.currentTarget
    if (!id) {
      wx.showModal({
        title: '提示',
        content: '对不起！该内容没有链接',
      })
      return
    }
    app.globalData.gzUrl = id
    wx.navigateTo({
      url: `/pages/webView/webView?path=gz`
    })
  }
})