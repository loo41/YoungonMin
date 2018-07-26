const moogose = require('mongoose');
const Schema = moogose.Schema;

const UserSchema = new Schema({
    openid: { type: String, index: true },
    unionid: { type: String, index: true,  default: 'false'}
})

const User = moogose.model('user', UserSchema)

module.exports = User