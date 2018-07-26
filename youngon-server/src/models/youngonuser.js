const moogose = require('mongoose');
const Schema = moogose.Schema;

const YoungonUserSchema = new Schema({
  id: {type: String, index: true},                                        // user
  username: String,
  email: String,
  phone: String,
  vip: {type: Number, default: 1, index: true},                           // 是VIP会收到邮件
  headerImg: {type: String, default: ''},                                 // 头像
  motto: String,                                                          // 座右铭
  grade: Number,                                                          // 1代码大一 2大二 3大三
  post: {type: Number, index: true},                                      // 1代表站长 2代表部长 3代表正式站员 4代表实习站员 // 5 副站
  state: Number,                                                          // 1代表在站 2代表不在站
  department: Number,                                                     // 1开发 2企划 3运营 4信息
  SignCount: {type: Number, default: 0, index: true},                     // 签到次数
  forgetSignCount: {type: Number, default: 0, index: true},               // 忘记签退次数
  Ranking: {type: Boolean, default: true},                                // 是否记入统计
  carrierKey: {type: Boolean, default: false, index: true},               // 钥匙携带者
  userinfo: { type: Schema.Types.ObjectId, ref: 'userInfo'},              // userinfo
})

const YoungonUser = moogose.model('youngonUser', YoungonUserSchema)

module.exports = YoungonUser