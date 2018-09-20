const dayJs = require('dayjs')
let timeSlot = [[[8, 0], [9, 35]], [[10, 5], [11, 45]], [[13, 30], [15, 35]], [[16, 5], [17, 5]]]


exports.timer = (time) => {
  if (typeof time !== 'number') Number(time)
  let nowTimer = Date.now()
  let flag = Math.floor((nowTimer - time) / 1000)
  if (flag < 10) {
    return '刚刚'
  } else if (flag < 70) {
    return '一分钟前'
  } else if (flag < 1800) {
    return '半小时前'
  } else if (flag < 3600) {
    return '一小时前'
  } else if (flag < 7200) {
    return '二小时前'
  } else if (flag < 43200) {
    return '半天前'
  }else if (flag < 86400) {
    return '一天前'
  } else if (flag < 2592000) {
    return '一个月前'
  } else {
    return '很久了'
  }
}


exports.delTime = (startTime, endTime) => {
  let dateObject = dayJs(Number(startTime))
  let trueFlagArray = []
  timeSlot.forEach((item, i) => {
    if(dayJs(new Date(Number(dateObject.year()), Number(dateObject.month()), Number(dateObject.date()), item[0][0], item[0][1])).isAfter(dateObject)
      && dayJs(new Date(Number(dateObject.year()), Number(dateObject.month()), Number(dateObject.date()), item[1][0], item[1][1])).isBefore(dayJs(Number(endTime)))){
        trueFlagArray.push(i)
    }
  })
  return trueFlagArray
}

exports.getTime = (date) => {
  return `${date.year()}年${(date.month() + 1)}月${date.date()}日${date.day()}周${date.hour()}时${date.minute()}分`
}