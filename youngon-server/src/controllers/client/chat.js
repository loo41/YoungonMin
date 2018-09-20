const {Chat, Leave} = require('../../models')
const _token = require('../../utils/token')
const dayJs = require('dayjs')

exports.more = async(ctx) => {
  const {length} = ctx.query
  if (!length) {
	ctx.body = {code: 200, data: []}
   }
  const pageSize = 20
  const data = await Chat
                        .find({})
			                  .sort('-_id')
                        .skip(length)
                        .limit(pageSize)
                        .populate({path: 'user', select: 'avatarUrl'})
  ctx.body = {code: 200, data}
}


exports.addLeave = async (ctx) => {
  const {leaveValue, token} = ctx.request.body
  const user = await _token.istoken(ctx, token)
  let timer = Date.now()
  let leave = new Leave({
    content: leaveValue, timer,
    user: user.infoID
  })
  await leave.save()
  ctx.body = {code: 200}
}

exports.leaveAdminList = async(ctx) => {
  let list = await Leave.find({}).sort({_id: -1}).populate({path: 'user', select: 'nickName'})
  let listCopy = JSON.parse(JSON.stringify(list))
  listCopy.forEach((item, i) => {
    let date = dayJs(Number(item.timer))
    let time = `${date.year()}年${(date.month() + 1)}月${date.date()}日${date.day()}周${date.hour()}时${date.minute()}分`
    listCopy[i].timer = time
    listCopy[i].userName = item.user.nickName
  })
  let count = await Leave.count()
  ctx.body = {code: 200, list: listCopy, count}
}

exports.leaveList = async(ctx) => {
  let list = await Leave.find({carefully: true}).sort({_id: -1}).populate({path: 'user', select: 'nickName'})
  list = JSON.parse(JSON.stringify(list))
  list.forEach((item, i) => {
    let date = dayJs(Number(item.timer))
    let time = `${date.year()}年${(date.month() + 1)}月${date.date()}日${date.day()}周${date.hour()}时${date.minute()}分`
    list[i].timer = time
  })
  ctx.body = {code: 200, list}
}

exports.delectLeave = async(ctx) => {
  const {_id} = ctx.query
  console.log(_id)
  await Leave.remove({_id})
  ctx.body = {code: 200}
}

exports.changeCareful = async (ctx) => {
  const {_id} = ctx.query
  await Leave.update({_id}, {$set: {carefully: true}})
  ctx.body = {code: 200}
}