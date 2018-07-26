const {client} = require('../../utils/redis')
const config = require('config')
const $ = require('axios')


exports.list = async(ctx) => {
  const {type, offset, count} = ctx.request.body
  let accessToken = await getToken()
  if (!accessToken || accessToken === 'undefined') {
    const info = await $.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.get('gz-appid')}&secret=${config.get('gz-secret')}`)
    const {access_token} = info.data
    client.set('accessToken', access_token, 'EX', 7000)
    accessToken = access_token
  }
  if (!type) {
    let listData = []
    let image = await $.post(`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`, {type: `image`, offset: 0, count: 20})
    let video = await $.post(`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`, {type: `video`, offset: 0, count: 20})
    let news = await $.post(`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`, {type: `news`, offset: 0, count: 20})
    listData[0] = image.data
    listData[1] = video.data
    listData[2] = news.data
    ctx.body = {code: 200, data: listData}
    return
  }
  let flag = await $.post(`https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${accessToken}`, {type, offset, count})
  flag = flag.data
  ctx.body = {code: 200, data: flag}
}

const getToken = () => {
  return new Promise((resolve, reject) => {
    client.get('accessToken', async function(err, accessToken) {
      if (err) {
        reject(err)
      } else {
        resolve(accessToken)
      }
    })
  })
}
