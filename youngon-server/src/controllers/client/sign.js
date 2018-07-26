let sginWIFI = ['TJCU']
let signTude = [{latitude: 39, longitude: 117}]
const {Record, Presence, Apply, Joke, Youngonuser} = require('../../models')
const path = require('path')
const fs = require('fs')
const _token = require('../../utils/token')
const _time = require('../../utils/time')
const {sendMails} = require('../../utils/mail')
const ejs = require('ejs');


exports.info = async (ctx) => {
  let jokeLength = await Joke.count()
  const user = await _token.istoken(ctx)
  const {youngonId} = user
  const [joke , presence, Honor, forgetSign, carrierKey] = await Promise.all([
    Joke.find({}).skip(Math.floor(Math.random() * jokeLength)).limit(1),
    Presence.find({}).populate({path: 'user', select: 'headerImg username'}),
    Youngonuser.find({}).sort({SignCount: 1}).limit(5),
    Youngonuser.find({}).sort({forgetSignCount: 1}).limit(5),
    Youngonuser.find({carrierKey: true})
  ])
  if (jokeLength !== 0) joke[0].timer = await _time.timer(joke[0].timer)
  const presences = await Presence.find({id: youngonId})
  let signState = false
  if (presences.length !== 0) signState = true
  ctx.body = {code: 200, data: {joke, presence, Honor, forgetSign, carrierKey, signState}}
}

exports.sign = async (ctx) => {
  const {locationinfo, type} = ctx.request.body
  let flag = {
    latitude: parseInt(locationinfo.latitude),
    longitude: parseInt(locationinfo.longitude)
  }
  if (sginWIFI.indexOf(locationinfo.SSID) === -1
  && JSON.stringify(signTude).indexOf(JSON.stringify(flag)) === -1) {
    ctx.body = {code: 404, msg: '位置信息不正确'}
    return
  }
  const user = await _token.istoken(ctx)
  const {youngonId} = user
  const presence = new Presence({id: youngonId, user: youngonId, type})
  await presence.save()
  ctx.body = {code: 200}
}

exports.signOut = async (ctx) => {
  const {signOutType} = ctx.request.body
  const user = await _token.istoken(ctx)
  const {youngonId} = user
  const presence = await Presence.findOneAndRemove({id: youngonId})
  const {startTime} = presence
  const endTime = Date.now()
  const record = new Record({
    startTime, endTime, user: youngonId
  })
  if (Number(signOutType) === 1) {
    await Youngonuser.update({_id: youngonId}, {carrierKey: true, $inc: {SignCount: 1}})
  } else {
    await Youngonuser.update({_id: youngonId}, {carrierKey: false, $inc: {SignCount: 1}})
  }
  await record.save()
  ctx.body = {code: 200}
}

exports.apply = async (ctx) => {
  const {startTime, startClass, endTime, endClass, value} = ctx.request.body.application
  const user = await _token.istoken(ctx)
  const {youngonId, username} = user
  const apply =  new Apply({
    startTime, startClass, endTime, endClass, value, id: youngonId
  })
  await apply.save()
  ctx.body = {code: 200}
  let [yousers, youser, vipuser] = await Promise.all([
    Youngonuser.find({post: {$lt: 3}}),
    Youngonuser.find({post: 5}),
    Youngonuser.find({vip: {$gt: 2}})
  ])
  let allUser = yousers.concat(youser).concat(vipuser)
  let flag = []
  let allUsers = new Set(allUser)
  allUsers.forEach((item) => {
    flag.push(item.email)
  })
  const html = await ejs.renderFile(path.join(`${__dirname}`, '/html/app.html'), {
    info: ctx.request.body.application,
    username: username
  })
  sendMails(flag.join(), html)
}


exports.addJoke = async(ctx) => {
  const {shareValue} = ctx.request.body
  const user = await _token.istoken(ctx)
  const {youngonId ,username} = user
  const joke = new Joke({
    id: youngonId, username, content: shareValue
  })
  await joke.save()
  ctx.body = {code: 200}
}