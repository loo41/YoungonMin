Page({
  data: {
    animationData: {},
    animationDpData: {},
    screenSize: {},
    die: false,
    left: null,
    top: null,
    notClick: false,
    childAiBo: {
      childAiBo1: {},
      childAiBo2: {},
      childAiBo3: {},
      childAiBo4: {}
    }
  },
  onLoad: function() {
    this._getSys()
  },
  _getSys () {
    const sys = wx.getSystemInfoSync()
    let screenSize = {
      height: sys.windowHeight,
      width: sys.windowWidth,
    }
    this.setData({
      screenSize: screenSize
    })
  },
  _ariseAnimation () {
    const {notClick} = this.data
    if (notClick) return
    this.setData({notClick: true})
    let that = this
    let animation = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease',
    })
    const {height} = that.data.screenSize
    animation.height(`${2*height}px`).width(`${2*height}px`).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(() => {
      that.setData({die: true})
      that._ariseBxoA()
    }, 1500)
  },
  _ariseBxoA () {
    let animation = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      animationDpData: animation.export()
    })
  },
  viewTouchMove (e) {
    let x = e.touches[0].clientX-60
    let y = e.touches[0].clientY-60
    const {height, width} = this.data.screenSize
    if (x >= width) x = width
    if (x <= 0) x = 0
    if (y >= height) y = height
    if (y <= 0) y = 0
    this.setData({
      left: x,
      top: y
    })
  },
  _childAni (e) {
    let id = e.currentTarget.id
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    const {childAiBo} = this.data
    animation.translateY(0).step()
    switch(Number(id)) {
      case 1:
        childAiBo.childAiBo1 = animation.export()
        this.setData({childAiBo: childAiBo})
        break
      case 2:
        childAiBo.childAiBo2 = animation.export()
        this.setData({childAiBo: childAiBo})
        break
      case 3:
        childAiBo.childAiBo3 = animation.export()
        this.setData({childAiBo: childAiBo})
        break
      case 4:
        childAiBo.childAiBo4 = animation.export()
        this.setData({childAiBo: childAiBo})
        break
    }
  }
})