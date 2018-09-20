const _setAjax = ({url='', data={}, header={}, method='GET', dataType='json'}) => {
  console.log(url)
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header,
      method,
      dataType,
      success: function(res) {
        console.log(res.statusCode)
        if (res.data.code && res.data.code !== 200 ) {
          return reject(res.data.code)
        } else if (res.statusCode !== 200) {
          return reject(res.statusCode)
        }
        resolve(res.data)
      },
      fail: function() {
        reject('请求错误')
      }
    })
  })
}

const _checkSession = () => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: function() {
        resolve(true) 
      },
      fail: function(){
        resolve(false) 
      }
    })
  })
}

const _login = (app) => {
  new Promise((resolve, reject) => {
    const {BASEURL} = app.globalData
    const options = {url: `${BASEURL}/login`, data: {}}
    wx.login({
      success: function(res) { 
        options.data.code = res.code
        _setAjax(options).then((result) => {
          const {state, token, isUni, isYoungon} = result.data               // 定义三种状态, 状态一 未注册|(存在unicode || 不存在unicode)。 状态二 已注册,不是网站成员, 三是已注册，是网站成员。
          wx.setStorageSync('token', token)
          app.globalData.state = state
          app.globalData.isYoungon = isYoungon
          switch (state) {
            case 0:
              app.globalData.isUni = isUni
              break
            case 1:
              break
            case 2:
              app.globalData.userinfo = result.data
              break              
          }
          resolve()
        }).catch((e) => {reject(e)})
      }
    })
  })
}


const _dealwithZorn = (app) => {
  const {isUni, state, userinfo, BASEURL} = app.globalData
  const header = {"token": wx.getStorageSync('token')}
  userinfo.isUni = isUni
  if (isUni && isUni !== 1) {
    _setAjax({url: `${BASEURL}/register`, data: userinfo, header, method: 'POST'}).then(()=>{
      _login(app)
    }).catch(()=>{})
  } else {
    _checkSession().then(() => {
      wx.getUserInfo({
        success: function(res) {
          userinfo.iv = res.iv || ''
          userinfo.encryptedData = res.encryptedData || ''
          _setAjax({url: `${BASEURL}/register`, data: userinfo, header, method: 'POST'}).then(()=>{
            _login(app)
          }).catch(()=>{})
        }
      })
    }).catch(() => {
      _login().then(() => {
        _dealwithZorn()
      })
    })
  }
}


module.exports = {
  _setAjax,
  _dealwithZorn,
  _checkSession,
  _login
}
