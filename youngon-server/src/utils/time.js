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