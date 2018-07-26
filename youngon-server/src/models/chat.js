const moogose = require('mongoose');
const Schema = moogose.Schema;

const ChatSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'userInfo'},              // youngonUser
    timer: {type: String, default: Date.now()}, 
    message: String
})

const Chat = moogose.model('chat', ChatSchema)

module.exports = Chat