const moogose = require('mongoose');
const Schema = moogose.Schema;

const AdminInfoSchema = new Schema({
    id: { type: String, index: true },
    userName: {type: String, index: true},
    sex: String,
    email: String,
    grade: Number
})

const AdminInfo = moogose.model('adminInfo', AdminInfoSchema)

module.exports = AdminInfo