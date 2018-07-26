const _token = require('../../utils/token')
const {Youngonuser} = require('../../models')

exports.info = async(ctx) => {
  const user = await _token.istoken(ctx)
  const {id} = user
  const info = await Youngonuser.findOne({id})
  if (JSON.stringify(info) === '{}') {
    ctx.body = {code: 404}
    return
  }
  ctx.body = {code: 200, data: info}
}

exports.update = async(ctx) => {
  const { _id, username,
    email, phone, vip,
    headerImg, motto, grade,                
    post, state, department,  
  } = ctx.request.body
  await Youngonuser.update({_id}, {$set: {username, email, 
    phone, vip, headerImg, motto, grade, post, state, department}})
  ctx.body = {code: 200}
}

exports.getUserInfo = async(ctx) => {
  const {id} = ctx.query
  console.log(id)
  const data = await Youngonuser.findOne({_id: id})
  ctx.body = {code: 200, data}
}