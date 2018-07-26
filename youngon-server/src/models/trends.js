const moogose = require('mongoose');
const Schema = moogose.Schema;

const TrendSchema = new Schema({
    title: String,
    picture: String,
    author: String,
    timer: {type: String, default: Date.now()}
})

const Trends = moogose.model('trends', TrendSchema)

module.exports = Trends