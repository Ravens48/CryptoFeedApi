const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")

checkToken = (req, res, next) => {
    let token = req.headers["x-access-token"]

    if (!token) {
        return res.status(403).send({ message: "No token found" })
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "access unauthorized!" })
        }
        req.userId = decoded.id
        next()
    })
}

const checkJwt = {
    checkToken,
}

module.exports = checkJwt