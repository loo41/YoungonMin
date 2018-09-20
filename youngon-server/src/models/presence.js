const moogose = require('mongoose');
const Schema = moogose.Schema;

const PresenceSchema = new Schema({
  startTime: Number,
  type: Number,
  user: {type: Schema.Types.ObjectId, ref: 'youngonUser'},            // youngonUser
})

const Presence = moogose.model('presence', PresenceSchema)

module.exports = Presence