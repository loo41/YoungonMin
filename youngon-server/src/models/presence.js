const moogose = require('mongoose');
const Schema = moogose.Schema;

const PresenceSchema = new Schema({
  id: {type: String, index: true},                                    // 对应到成员
  startTime: {type: String, default: Date.now()},
  type: Number,
  user: {type: Schema.Types.ObjectId, ref: 'youngonUser'},            // youngonUser
})

const Presence = moogose.model('presence', PresenceSchema)

module.exports = Presence