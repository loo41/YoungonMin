const {Admin, AdminInfo} = require('../../models')
const _token = require('../../utils/token')

/**
 * 
 * @method register success
 * @method login    success
 * @method login    success
 * 所以方法检测完成  通过Post检测
 * 将占时不在进行测试
 * 
 */

exports.login = async (ctx) => {
  const {userName, password} = ctx.request.body              
  const admin = await Admin.find({userName, password})
  if (admin.length === 0) {
    ctx.body = {code: 203, mes: '用户不存在'}
    return
  }
  const token = await _token.creatToken({userName, id: admin[0]._id})
  ctx.body = {code: 200, data: {token}}
}

exports.info = async (ctx) => {
  const admin = await _token.istoken(ctx)
  const { id, userName } = admin
  const info = await AdminInfo.findOne({id, userName})
  ctx.body = {code: 200, data: {data: info}}
}

exports.register = async (ctx) => {
  const {userName, password, sex, email, grade} = ctx.request.body
  const isUser = await Admin.find({userName})
  if (isUser.length > 0) {
    ctx.body = {code: 201, msg: '用户已经存在'}
    return
  }
  const admin = new Admin({userName, password})
  const id = admin._id
  const adminInfo = new AdminInfo({id, userName, sex, email, grade})
  await Promise.all[await admin.save(), await adminInfo.save()]
  ctx.body = {code: 200}
}

exports.adminList = async (ctx) => {
  const data = await AdminInfo.find({})
  ctx.body = {code: 200, data}
}

exports.delectAdmin = async (ctx) => {
  const {_id} = ctx.query
  const admin = await AdminInfo.findOneAndRemove({_id})
  await Admin.remove({_id: admin.id})
  ctx.body = {code: 200}
}

exports.changeUser = async(ctx) => {
  const {_id, username, sex, email, grade} = ctx.request.body
  await AdminInfo.update({_id},{$set: {userName: username, sex, email, grade}})
  ctx.body = {code: 200}
}