const db = require("../models")
const ROLES = db.ROLES
const User = db.user

checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (user) {
            res.status(400).send({ message: "Email already in use !" })
            return
        }
        next()
    })
}

isRoleExist = (req, res, next) => {
    if (req.body.roles) {
        req.body.roles.forEach(element => {
            if (!ROLES.includes(element)) {
                res.status(400).send({
                    message: `Role ${element} does not exists!`
                })
                return
            }
        });
    }
    next()
}

const checkSignUp = {
    checkDuplicateEmail,
    isRoleExist
}

module.exports = checkSignUp