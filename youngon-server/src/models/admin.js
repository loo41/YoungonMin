const moogose = require('mongoose');
const Schema = moogose.Schema;

const AdminSchema = new Schema({
    id: { type: String, index: true },
    userName: String,
    password: String
})

const Admin = moogose.model('admin', AdminSchema)

module.exports = Admin