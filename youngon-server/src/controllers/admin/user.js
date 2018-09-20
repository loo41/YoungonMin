const {Userinfo, Youngonuser, Record, Presence, Apply, Joke} = require('../../models')
const dayJs = require('dayjs')
const {delTime, getTime} = require('../../utils/time')

exports.list = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 20
  const currentPage = page;
  const skipnum = (currentPage - 1) * pageSize
  const data = await Youngonuser
                              .find({})
                              .skip(skipnum)
                              .limit(pageSize)
  const count = await Youngonuser.count()
  ctx.body = {code: 200, data, count}
}

exports.listAll = async(ctx) => {
  const data = await Youngonuser.find({})
  ctx.body = {code: 200, data}
}

exports.isYoungon = async(ctx) => {
  const {id} = ctx.query
  const user = await Youngonuser.find({id})
  if (user.length === 0) {
    ctx.body = {code: 200}
  } else {
    ctx.body = {code: 202, msg: '成员已经存在'}
  }
}

exports.add = async(ctx) => {
  const {_id, id, 
    username, email, phone, 
    motto, grade, post, state, 
    vip, department, 
    fistWorkTimeDate, fistWorkTimeTime,
    secondWorkTimeDate, secondWorkTimeTime} = ctx.request.body
  const youngonUser = new Youngonuser({id, username, email,
     phone, motto, grade, post, state, vip, 
     department, userinfo: _id, fistWorkTimeDate,
     fistWorkTimeTime, secondWorkTimeDate, secondWorkTimeTime})
  await youngonUser.save()
  ctx.body = {code: 200}
}

exports.delect = async(ctx) => {
  const {_id} = ctx.query
  await Promise.all([
    Record.remove({user: _id}),
    Presence.remove({id: _id}),
    Apply.remove({user: _id}),
    Joke.remove({id: _id})
  ])
  await Youngonuser.remove({_id})
  ctx.body = {code: 200}
}

exports.update = async(ctx) => {
  const {_id, username, email, 
    phone, headerImg, motto, 
    grade, post, state, vip, department,
    fistWorkTimeDate, fistWorkTimeTime,
    secondWorkTimeDate, secondWorkTimeTime
  } = ctx.request.body
  await Youngonuser.update({_id}, {$set: {username, email, phone, 
    headerImg, vip, motto, grade, post, 
    state, department,
    fistWorkTimeDate, fistWorkTimeTime, 
    secondWorkTimeDate, secondWorkTimeTime}})
  ctx.body = {code: 200}
}

exports.delectUser = async(ctx) => {
  const {_id} = ctx.query
  await Userinfo.remove({_id})
  ctx.body = {code: 200}
}

exports.userList = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 20
  const currentPage = page;
  const skipnum = (currentPage - 1) * pageSize
  const data = await Userinfo
                              .find({})
                              .skip(skipnum)
                              .limit(pageSize)
  const count = await Userinfo.count()
  ctx.body = {code: 200, data, count}
}

exports.handleCheckIn = async (ctx) => {
  const {_id} = ctx.query
  let userRecord = await Record.find({user: _id})
  let flagArray = [
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0], 
    [0, 0, 0, 0]]
  userRecord = JSON.parse(JSON.stringify(userRecord))
  userRecord.forEach(async(item, i) => {
    if (dayJs().startOf('week').isBefore(dayJs(Number(item.startTime)))) {
      let startDate = dayJs(Number(item.startTime))
      let endDate = dayJs(Number(item.endTime))
      let day = startDate.day()
      if (day <= 5) {
        let trueTime = await delTime(item.startTime, item.endTime)
        trueTime.forEach((item) => {
          flagArray[day - 1][item] = 1
        })
      }
      userRecord[i].startTime = await getTime(startDate)
      userRecord[i].endTime = await getTime(endDate)
    }
  })
  let leave = await Apply.find({user: _id})
  ctx.body = {code: 200, userRecord, flagArray, leave}
}


exports.jokeList = async(ctx) => {
  let list = await Joke.find({})
  list = JSON.parse(JSON.stringify(list))
  list.forEach(async(item, i) => {
    list[i].timer = await getTime(dayJs(item.timer))
  })
  ctx.body = {code: 200, list}
}

exports.delJoke = async(ctx) => {
  const {_id} = await ctx.query
  await Joke.remove({_id})
  ctx.body = {code: 200}
}