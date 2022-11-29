const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Login = mongoose.model('usermaster');
const crypto = require('crypto');
var app = express();

// login page get
router.get('/', (req, res) => {
    res.render("user/login", {
        viewTitle: "login User",
        layout: false
    });
});

// login page post data
router.post('/', (req, res) => {
    Logindata(req, res);
});

const authTokens = {};

function Logindata(req, res) {
    const { usremail, usrpassword } = req.body;
    Login.findOne({ usremail })
        .then((response) => {
            if (response != null) {
                const usrpasswords = getHashedPassword(usrpassword);
                if (response.usrpassword == usrpasswords) {
                    if (response.usrtype == "Admin") {
                        const authToken = generateAuthToken();
                        authTokens[authToken] = usremail+response.usrtype;
                        res.cookie('AuthToken', authToken);
                        res.cookie('UserName', response.usrname);
                        res.redirect('/user/list');
                    }
                    else {
                        const authToken = generateAuthToken();
                        authTokens[authToken] = usremail+response.usrtype;
                        res.cookie('UserToken', authToken);
                        res.cookie('UserName', response.usrname);
                        res.cookie('UserId', response._id);
                        res.redirect('/patient/list');
                    }
                }
                else {
                    res.render('user/login', {
                        message: 'Invalid username or password',
                        messageClass: 'alert-danger',
                        layout: false
                    });
                }
            }
            else {
                res.render('user/login', {
                    message: 'Invalid username or password',
                    messageClass: 'alert-danger',
                    layout: false
                });
            }
        });
}

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['UserToken'];
    // Inject the user to the request
    req.user = authTokens[authToken];
    next();
});


// generate hashed password
function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// generate auth token
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}
module.exports = router;