const {Userinfo, Youngonuser, Record, Presence, Apply, Joke} = require('../../models')

exports.list = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 20
  const currentPage = page;
  const skipnum = (currentPage - 1) * pageSize
  const data = await Youngonuser
                              .find({})
                              .skip(skipnum)
                              .limit(pageSize)
  ctx.body = {code: 200, data}
}

exports.isYoungon = async(ctx) => {
  const {id} = ctx.query
  console.log(id)
  const user = await Youngonuser.find({id})
  if (user.length === 0) {
    ctx.body = {code: 200}
  } else {
    ctx.body = {code: 202, msg: '成员已经存在'}
  }
}

exports.add = async(ctx) => {
  const {_id, id, username, email, phone, motto, grade, post, state, vip, department} = ctx.request.body
  const youngonUser = new Youngonuser({id, username, email, phone, motto, grade, post, state, vip, department, userinfo: _id})
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
  const {_id, username, email, phone, headerImg, motto, grade, post, state, vip, department} = ctx.request.body
  await Youngonuser.update({_id}, {$set: {username, email, phone, headerImg, vip, motto, grade, post, state, department}})
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
  ctx.body = {code: 200, data}
}