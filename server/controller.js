const bcrypt = require("bcrypt");

function registerUser(req, res) {
    //access username and password off the body
    //set up db folder and sql files
    //check to make sure username is not taken
    //hash password
    //insert user into the database
    //put the user on session

    const {username, password} = req.body;
    const db = req.app.get("db");
    db.checkForUsername(username).then(response => {
        let numUsers = +response[0].count;
        if(numUsers === 0) {
            bcrypt.hash(password, 12).then(hash => {
                db.registerUser(username, hash).then(() => {
                    req.session.username = username;
                    res.sendStatus(200);
                }).catch(() => res.status(500).json("Unable to register User"))
            }).catch(e => res.status(500).json({
                systemError: e,
                serverError: "Hashing Unsuccessful"
            }))
        } else {
            res.status(500).json("Username is already taken");
        }
    }).catch(e => res.status(500).json("Unable to parse database"));
}

async function loginUser(req, res) {
    //grab the db and write a sql file to check if username and password is correct
    //send back a response
    const {username, password} = req.body;
    const db = req.app.get("db");


    // db.getPasswordViaUsername(username).then(hash => {
    //     bcrypt.compare(password, hash).then(areEqual => {
    //         if(areEqual) {
    //             req.session.username = username;
    //             res.status(200).json("Login Successful");
    //         } else {
    //             res.status(403).json("Unable to login. Username/Password incorrect");
    //         }
    //     })
    // })


    let hash = await db.getPasswordViaUsername(username);
    hash = hash[0].password;
    const areEqual = await bcrypt.compare(password, hash);
    if(areEqual) {
        req.session.username = username;
        res.status(200).json("Login Successful");
    } else {
        res.status(403).json("Unable to login. Username/Password incorrect");
    }
}



module.exports = {
    registerUser,
    loginUser
}