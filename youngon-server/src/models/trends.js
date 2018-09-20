const moogose = require('mongoose');
const Schema = moogose.Schema;

const TrendSchema = new Schema({
    title: String,
    picture: String,
    author: String,
    timer: Number,
})

const Trends = moogose.model('trends', TrendSchema)

module.exports = Trends