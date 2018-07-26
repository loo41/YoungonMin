const {Swiper} = require('../../models')
const _delect = require('../../utils/delect')
const path = require('path')
let BASEPATH = path.join(process.cwd(), 'views/images')
console.log(BASEPATH)

exports.update = async (ctx) => {
  const {indicatorDots, indicatorColor, indicatorActiveColor,
          autoplay, current, interval, duration, circular, 
          vertical, previousMargin, nextMargin, displayMultipleItems, 
          notice, imgUrls, _id} = ctx.request.body
  await Swiper.update({_id}, {$set: {indicatorDots, indicatorColor, indicatorActiveColor,
    autoplay, current, interval, duration, circular, 
    vertical, previousMargin, nextMargin, displayMultipleItems, 
    notice, imgUrls
  }})
  ctx.body = {code: 200}
}

exports.delect = async(ctx) => {
  const {list} = ctx.request.body
  console.log(list)
  if (list.length === 0) return
  list.forEach(async (item) => {
    if (!item) return
    itemName = item.split('.')
    item = itemName[itemName.length - 1]
    item = `${BASEPATH}/${item}`
    await _delect.delectImg(item)
  })
  ctx.body = {code: 200}
}

exports.info = async(ctx) => {
  const data = await Swiper.find({})
  ctx.body = {code: 200, data}
}

exports.init = async(ctx) => {
  const isInit = await Swiper.find({})
  if (isInit.length > 0) {
    ctx.body = {code: 201, msg: '已经完成初始化'}
    return
  }
  const swiper = Swiper({})
  await swiper.save()
  ctx.body = {code: 200}
}

exports.upload = async(ctx) => {
  ctx.body = {code: 200, url: ctx.req.file.filename}
}