const express = require("express");
const cors = require("cors");
const app = express();
const dbConfig = require("./app/db.config.js")
const db = require("./app/models")
const flash = require("express-flash");
const { initiateRole } = require('./app/database_setup/database.setup.js');


var corsOptions = {
    credentials: true, origin: '*'
};


app.use(flash());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var connectWithRetry = async function () {
    try {
        console.log("TRY TO CONNECT DB")
        await db.mongoose
            .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        console.log("Successfully connected to MongoDB");
        initiateRole()
    } catch (err) {
        console.error("Connection error", err);
        setTimeout(connectWithRetry, 2000);
    }
}
connectWithRetry()

//add routes
require("./app/routes/authentification.routes")(app)
require("./app/routes/user.routes")(app)
require("./app/routes/crypto.routes")(app)

app.get("/", (req, res) => {
    res.json({ message: "Welcome to ravens api" });
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


