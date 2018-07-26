const moogose = require('mongoose');
const Schema = moogose.Schema;

const ApplySchema = new Schema({
    user: { type: String, index: true },                       // youngonUser
    startTime: String, 
    startClass: Number,                                        // 0第一大节 || 1第二大节
    endTime: String, 
    endClass: Number, 
    value: String                                              // 原因
})

const Apply = moogose.model('apply', ApplySchema)

module.exports = Apply