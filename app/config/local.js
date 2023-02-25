const passport = require("passport")
const User = require("../models/user.model")
const Role = require("../models/role.model")
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            let user = await User.findOne({ email: email })
            if (user) {
                return done(null, user)
            } else {
                const newUser = {
                    email: email,
                    password: password
                }
                let roles = await Role.findOne({ name: "user" })
                newUser["roles"] = roles._id
                newUser["source"] = "local"
                user = await User.create(newUser)
                return done(null, user)
            }
        } catch (err) {
            console.log(err)
        }
    }
))