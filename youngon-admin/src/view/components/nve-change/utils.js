const dealWith = (that, data) => {
  for (let i in data) {
    if (!data[i]) {
      that.$Message.info('数据错误')
      return false
    }
  }
  switch (data.OuterChain.type) {
    case 0:
      let flag = {url: '', type: 0, appId: '', path: '', extraData: []}
      data.OuterChain = flag
      break
    case 1:
      if (!data.OuterChain.url) {
        that.$Message.info('没有链接地址')
        return false
      }
      let flag1 = {url: data.OuterChain.url, type: 1, appId: '', path: '', extraData: []}
      data.OuterChain = flag1
      break
    case 2:
      const {type, appId, path, extraData} = data.OuterChain
      extraData.forEach((item, index) => {
        if (!item.name) data.OuterChain.extraData.splice(index, 1)
      })
      if (!type || !appId || !path) {
        that.$Message.info('数据错误')
        return false
      }
      break
  }
  return data
}

function clone (obj) {
  let result = {}
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = clone(obj[key])
    } else {
      result[key] = obj[key]
    }
  }
  return result
}

export {
  dealWith,
  clone
}
