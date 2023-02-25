const db = require("../models")
const Role = db.role

/*
this function create automaticaly 1 roles when we connect to db
*/
exports.initiateRole = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err)
                }
                console.log("added 'user' to roles collection")
            })
        }
    })
}