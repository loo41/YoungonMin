const {Record, Presence, Apply, Joke, Youngonuser} = require('../models')

exports.clearSign = async() => {
  let prensence = await Presence.find({})
  let endTime = '0'
  prensence.forEach(async (item) => {
    const {id, startTime} = item
    const record = new Record({
      startTime, user: id, type: 2, endTime
    })
    await Promise.all([record.save(), Youngonuser.update({_id: id}, {$inc: {forgetSignCount: 1}})])
  })
  await Presence.remove({})
  console.log('完成清除工作')
}