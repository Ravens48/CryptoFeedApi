const config = require("../config/auth.config")
const db = require("../models")
const User = db.user
const Role = db.role

let jwt = require("jsonwebtoken")
let bcrypt = require("bcryptjs")

exports.signUp = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        source: "local"
    })

    //save user in database 
    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        //check if a roles is pass as param
        Role.findOne({ name: "user" }, (err, role) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            user.roles = role._id
            user.save(err => {
                if (err) {
                    return res.status(500).send({ message: err })

                }
                let token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 43200
                })
                var roles = user.roles.name
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    cryptosFav: user.cryptosFav,
                    roles: roles,
                    token: token,
                    source: user.source
                })
            })
        })
    })
}


exports.signIn = (req, res) => {
    console.log(req.params)
    console.log("email => ", req.body.email)
    User.findOne({
        email: req.body.email
    })
        .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err })
                return
            }
            if (!user) {
                return res.status({ message: "User not found" })
            }
            if (user.source != "google") {
                let isPasswordValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                )
                if (!isPasswordValid) {
                    return res.status(401).send({
                        token: null,
                        message: "Password not match"
                    })
                }
            }
            let token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 43200
            })
            var roles = user.roles.name
            res.status(200).send({
                id: user._id,
                username: user.username,
                email: user.email,
                cryptosFav: user.cryptosFav,
                roles: roles,
                token: token,
                source: user.source
            })
        })
}

exports.getUser = (req, res) => {
    try {
        const decoded = jwt.verify(req.cookies[process.env.COOKIE_NAME], config.secret)
        if (decoded) {
            User.findOne({
                _id: decoded.id
            })
                .populate("roles", "-__v")
                .exec((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err })
                        return
                    } else {
                        let token = jwt.sign({ id: user._id }, config.secret, {
                            expiresIn: 43200
                        })
                        var roles = []
                        user.roles.forEach(role => {
                            roles.push(role.name)
                        })
                        res.status(200).send({
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            roles: roles,
                            token: token,
                            source: user.source
                        })
                    }
                })
        }
    } catch (err) {
        res.status(404).send({ message: "no user found" })

    }
}
