const controller = require("../controllers/user.controller")

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })
    app.get("/api/user/:id", controller.getUser)
    app.put("/api/user/:id", controller.updateUser)
    app.put("/api/user/crypto/:id", controller.updateUserCryptosFav)
}