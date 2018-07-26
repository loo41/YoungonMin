const moogose = require('mongoose');
const Schema = moogose.Schema;

const UserInfoSchema = new Schema({
  id: { type: String, index: true },              // user
  nickName: String,
  avatarUrl: String,
  gender: String,
  city: String,
  province: String,
  country: String
})

const UserInfo = moogose.model('userInfo', UserInfoSchema)

module.exports = UserInfo