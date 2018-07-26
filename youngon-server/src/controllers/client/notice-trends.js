const {Trends, Notice, Content} = require('../../models')
const time = require('../../utils/time')


exports.trendsList = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 3
  const currentPage = page
  const skipnum = (currentPage - 1) * pageSize
  const data = await Trends
                            .find({})
                            .skip(skipnum)
                            .limit(pageSize)
  await data.forEach(async(item) => {
    item.timer = await time.timer(item.timer)
  })
  ctx.body = {code: 200, data}
}

exports.getContent = async(ctx) => {
  const {id} = ctx.query
  const data = await Content.find({id})
  ctx.body = {code: 200, data}
}

exports.noticeList = async(ctx) => {
  const {page} = ctx.query
  const pageSize = 20
  const currentPage = page
  const skipnum = (currentPage - 1) * pageSize
  const data = await Notice
                            .find({})
                            .skip(skipnum)
                            .limit(pageSize)
  await data.forEach(async(item) => {
    item.timer = await time.timer(item.timer)
  })
  data.reverse()
  ctx.body = {code: 200, data}
}

exports.search = async(ctx) => {
  const {title} = ctx.query
  const Rex = new RegExp(`${title}`)
  const data = await Notice.find({title: Rex})
  ctx.body = {code: 200, data}
}