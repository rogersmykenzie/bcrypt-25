require("dotenv").config();
const express = require("express");
const massive = require("massive");
const session = require("express-session");
//controller
const {registerUser, loginUser} = require("./controller")

const app = express();

massive(process.env.CONNECTION_STRING).then(dbInstance => {
    app.set("db", dbInstance);
    console.log("Connected to Database :)");
})

app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    secret: process.env.SESSION_SECRET
}))

app.post("/auth/register", registerUser)
app.post("/auth/login", loginUser)

app.listen(process.env.SERVER_PORT, () => console.log(`Listening on Port ${process.env.SERVER_PORT}`));