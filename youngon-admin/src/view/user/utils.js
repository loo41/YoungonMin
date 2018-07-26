const validation = function (that, data) {
  console.log(JSON.stringify(data))
  delete data.headerImg
  if (!Object.values(data).every((n) => n !== '')) {
    that.$Message.error('不能为空')
    return false
  }
  data.headerImg = ''
  const {username, email} = data
  const re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  if (username.length < 2) {
    that.$Message.error('用户名错误')
    return false
  } else if (!re.test(email)) {
    that.$Message.error('邮箱错误')
    return false
  }
  console.log('pps')
  return true
}

export {
  validation
}
