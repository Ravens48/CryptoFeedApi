const mongoose = require('mongoose')

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: String,
        email:
        {
            type: String,
            required: [true, "email required"],
        },
        password: String,
        roles:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },
        cryptosFav: [{
            type: String
        }],
        source: String
    })
)

module.exports = User