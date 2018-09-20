const moogose = require('mongoose');
const Schema = moogose.Schema;

const LeaveSchema = new Schema({
  timer: Number,        // 发布时间
  content: String,
  carefully: {type: Boolean, default: false},
  user: { type: Schema.Types.ObjectId, ref: 'userInfo'}
})

const Leave = moogose.model('leave', LeaveSchema)

module.exports = Leave