const User = require("../models/user.model")
let jwt = require("jsonwebtoken")
const config = require("../config/auth.config")

exports.allAccess = (req, res) => {
    console.log("PAAASE")
    res.status(200).send("Access for all")
}

exports.userBoard = (req, res) => {
    res.status(200).send("Acces for user")
}

exports.getUser = async (req, res) => {
    console.log("PASSE", req.params.id)
    await User.findOne({ _id: req.params.id })
        .exec((err, user) => {
            if (err) {
                res.status(400).send({ message: "User not found" })
            } else {
                let token = jwt.sign({ id: req.params.id }, config.secret, {
                    expiresIn: 43200
                })
                console.log("TOKEN,", token)
                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    cryptosFav: user.cryptosFav,
                    token: token,
                    source: user.source
                })
            }
        })
}

exports.updateUser = async (req, res) => {
    let userDoc = (await User.findOne({ _id: req.params.id }))
    Object.assign(userDoc, req.body)
    userDoc.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        } else {
            res.status(200).send({ user })
        }
    })
}

exports.updateUserCryptosFav = async (req, res) => {
    let userDoc = (await User.findOne({ _id: req.params.id }))
    let userCryptosFav = userDoc.cryptosFav
    let cryptoId = req.body.cryptoId
    console.log("CRYPTOID", cryptoId)
    if (userCryptosFav.includes(cryptoId)) {
        userCryptosFav = userCryptosFav.filter(id => id !== cryptoId)
    } else {
        userCryptosFav.push(cryptoId)
    }
    userDoc.cryptosFav = userCryptosFav
    userDoc.save((err, favs) => {
        if (err) {
            console.log("error => ", err)
            res.status(500).send({ message: "errof update favorites" })
        } else {
            console.log("SUCCES", userDoc.cryptosFav)
            res.status(200).send(userDoc.cryptosFav)
        }
    })
}