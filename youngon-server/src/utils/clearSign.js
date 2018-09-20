const {Record, Presence, Youngonuser} = require('../models')
const dayJs = require('dayjs')

exports.clearSign = async() => {
  let prensence = await Presence.find({})
  let endTime = '0.00'
  prensence.forEach(async (item) => {
    const {user, startTime} = item
    const record = new Record({
      startTime, user, type: 2, signType: item.type, endTime
    })
    await Promise.all([record.save(), Youngonuser.update({_id: user}, {$inc: {forgetSignCount: 1}})])
  })
  await Presence.remove({})
  console.log('完成清除工作')
}

exports.clearSignWeekRecord = async(ctx) => {
  const userRecord = await Record.find({user: _id})
  userRecord.forEach(async(item) => {
    if (dayJs().startOf('week').isAfter(dayJs(Number(item.startTime)))) {
      await Record.remove({_id: item._id})
    }
  })
  console.log('本周记录清除完成')
}