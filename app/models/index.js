const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}
db.user = require("./user.model")
db.role = require("./role.model")
db.ROLES = ["user"]
db.mongoose = mongoose

module.exports = db