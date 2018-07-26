const moogose = require('mongoose');
const Schema = moogose.Schema;

const ContentSchema = new Schema({
    id: { type: String, index: true },
    content: String,
    value: String,
})

const Content = moogose.model('content', ContentSchema)

module.exports = Content