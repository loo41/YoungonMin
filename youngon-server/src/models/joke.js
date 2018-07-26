const moogose = require('mongoose');
const Schema = moogose.Schema;

const JokeSchema = new Schema({
    id: {type: String, index: true},                   // 发布者
    username: String,                                  // 发布者姓名
    content: String,                                   // 内容
    timer: {type: String, default: Date.now()},         // 发布时间
    user: {type: Schema.Types.ObjectId, ref: 'youngonUser'}
})

const Joke = moogose.model('joke', JokeSchema)

module.exports = Joke