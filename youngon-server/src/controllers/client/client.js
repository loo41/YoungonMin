const $ = require('axios')
const config = require('config')
const {User, Userinfo, Youngonuser, Swiper, Trends} = require('../../models')
const _token = require('../../utils/token')
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt')
const [appid, secret] = [config.get('appid'), config.get('secret')]


exports.login = async(ctx) => {
  let [state, isUni, token, isYoungon] = [1, false, null, false]
  const {code} = ctx.query
  const res = await $.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
  if (res.data.errcode) {
    ctx.body = {code: 500, msg: `errcode = ${res.data.errcode}`}
    return
  }
  const {openid, session_key, unionid} = res.data
  const user = await User.find({openid})
  if (user.length > 0) {
    const info = await Userinfo.find({id: user[0]._id})
    if (user[0].unionid !== 'false') isUni = true
    if (info.length === 0) state = 0
    if (state !== 0) {
      const youngon = await Youngonuser.find({id: user[0]._id})
      if (youngon.length > 0) {
        token = await _token.creatToken({openid, youngonId: youngon[0]._id, key: session_key, username: youngon[0].username, id: user[0]._id, infoID: info[0]._id})
        state = 2
        isYoungon = true
      } else {
        token = await _token.creatToken({openid, key: session_key, id: user[0]._id, infoID: info[0]._id})
      }
    } else {
      token = await _token.creatToken({openid, key: session_key, id: user[0]._id})
    }
  } else {
    state = 0
    if (unionid) isUni = true
    const userModel = new User({openid, unionid})
    const id = userModel._id
    token = await _token.creatToken({openid, key: session_key, id})
    await userModel.save()
  }
  ctx.body = {code: 200, data: {state, isUni, token, isYoungon}}
}

exports.register = async(ctx) => {
  const {nickName, avatarUrl, gender, city, province, country, iv, encryptedData, isUni} = ctx.request.body
  const {id, key} = await _token.istoken(ctx)
  if (iv && encryptedData && !isUni) {
    const pc = new WXBizDataCrypt(appid, key)
    const data = pc.decryptData(encryptedData , iv)
    const {openId, unionId} = data
    await User.update({_id: id},{$set: {openid: openId, unionid: unionId}})
  }
  const info = new Userinfo({
    id, nickName, avatarUrl, 
    gender, city, province,
    country
  })
  await info.save()
  ctx.body = {code: 200}
}

exports.youngonPerson = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 20
  const currentPage = page
  const skipnum = (currentPage - 1) * pageSize
  const data = await Youngonuser
                              .find({})
                              .skip(skipnum)
                              .limit(pageSize)
                              .populate('userinfo')
  ctx.body = {code: 200, data}
}

exports.createIndexData = async(ctx) => {
  const {state} = ctx.query
  let user = null
  let id = null
  if (state) {
    user = await _token.istoken(ctx)
    id = user.id
  }
  let trueChange = 'youngon'
  if (Number(state) === 0 || Number(state) === 1 ) {
    const info = await Youngonuser.find({id})
    if (info.length > 0) trueChange = true
  } else if (Number(state) === 2) {
    const info = await Youngonuser.find({id})
    if (info.length === 0) trueChange = false
  }
  const swiper = await Swiper.findOne({})
  const youngonTrends = await Trends.find({}).limit(3)
  youngonTrends.reverse()
  ctx.body = {code: 200, data: {swiper}, youngonTrends, trueChange}
}

exports.search = async(ctx) => {
  const {user} = ctx.query
  const Rex = new RegExp(`${user}`)
  const data = await Youngonuser.find({username: Rex})
  ctx.body = {code: 200, data}
}
