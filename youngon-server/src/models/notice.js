const moogose = require('mongoose');
const Schema = moogose.Schema;

const NoticeSchema = new Schema({
    title: {type: String, index: true},
    picture: String,
    author: String,
    timer: {type: String, default: Date.now()}
})

const Notice = moogose.model('notice', NoticeSchema)

module.exports = Notice