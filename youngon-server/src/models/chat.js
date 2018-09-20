const moogose = require('mongoose');
const Schema = moogose.Schema;

const ChatSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'userInfo'},              // youngonUser
    timer: Number,
    message: String
})

const Chat = moogose.model('chat', ChatSchema)

module.exports = Chat