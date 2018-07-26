const moogose = require('mongoose');
const Schema = moogose.Schema;

const RecordSchema = new Schema({                                        // user
  startTime: {type: String, default: Date.now()},
  endTime: {type: String},
  type: {type: Number, default: 1},                                     // 1正常签退 || 2不正常签退                           
  user: {type: Schema.Types.ObjectId, ref: 'youngonUser'},               // youngonUser
})

const Record = moogose.model('record', RecordSchema)

module.exports = Record