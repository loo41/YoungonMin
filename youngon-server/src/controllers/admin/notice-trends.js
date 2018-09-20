const {Trends, Notice, Content} = require('../../models')
const _token = require('../../utils/token')

exports.upTends = async (ctx) => {
  const {title, picture, value, content} = ctx.request.body
  const admin = await _token.istoken(ctx)
  const {userName} = admin
  let timer = Date.now()
  const trends = new Trends({title, author: userName, picture, timer})
  const id = trends._id
  const con = new Content({id, value, content})
  await Promise.all[await trends.save(), await con.save()]
  ctx.body = {code: 200}
}

exports.upNotice = async (ctx) => {
  const {title, picture, value, content} = ctx.request.body
  const admin = await _token.istoken(ctx)
  const {userName } = admin
  let timer = Date.now()
  const trends = new Notice({timer, title, author: userName, picture})
  const id = trends._id
  const con= new Content({id, value, content})
  await Promise.all[await trends.save(), await con.save()]
  ctx.body = {code: 200}
}

exports.update = async(ctx) => {
  const {_id, title, picture, author, type} = ctx.request.body
  console.log(ctx.request.body)
  if (Number(type) === 1) {
    await Trends.update({_id}, {$set: {title, picture, author}})
  } else if (Number(type) === 2) {
    await Notice.update({_id}, {$set: {title, picture, author}})
  }
  ctx.body = {code: 200}
 }

exports.delect = async (ctx) => {
  const {_id, type} = ctx.query
  if (Number(type) === 1) {
    await Trends.remove({_id})
  } else if (Number(type) === 2) {
    await Notice.remove({_id})
  }
  ctx.body = {code: 200}
}


exports.list = async(ctx) => {
  const {page, type} = ctx.query
  const pageSize = 20
  const currentPage = page;
  const skipnum = (currentPage - 1) * pageSize
  let data = {}
  if (Number(type) === 1) {
    data = await Trends
                        .find({})
                        .skip(skipnum)
                        .limit(pageSize)
  } else if(Number(type) === 2) {
    data = await Notice
                        .find({})
                        .skip(skipnum)
                        .limit(pageSize)
  }
  ctx.body = {code: 200, data}
}


exports.upload = async(ctx) => {
  ctx.body = {code: 200, url: ctx.req.file.filename}
}