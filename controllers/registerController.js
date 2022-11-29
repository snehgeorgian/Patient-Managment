const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('usermaster');
const crypto = require('crypto');

// register page get 
router.get('/', (req, res) => {
    res.render("register/register", {
        viewTitle: "Insert User",
        layout: false
    });

});

//// register page post data
router.post('/', (req, res) => {
    var usremail = req.body.usremail;
    var usrmobile = req.body.usrmobile;
    User.findOne({ usremail })
        .then((response) => {
            if (response != null) {
                CheckEmailError(req.body)
                res.render("register/register", {
                    viewTitle: "Create Usre",
                    user: req.body,
                    layout: false
                });
            }
            else {
                User.findOne({ usrmobile })
                    .then((response) => {
                        if (response != null) {
                            CheckmobileError(req.body)
                            res.render("register/register", {
                                viewTitle: "Create Usre",
                                user: req.body,
                                layout: false
                            });
                        }
                        else {
                            insertRecord(req, res);
                        }
                    })
            }
        })
});

// create registration
async function insertRecord(req, res) {
    var employee = new User();
    var usremail = req.body.usremail;
    const usrpassword = getHashedPassword(req.body.usrpassword);
    employee.usrname = req.body.usrname;
    employee.usremail = req.body.usremail;
    employee.usrmobile = req.body.usrmobile;
    employee.usraddress = req.body.usraddress;
    employee.usrdateofbirth = req.body.usrdateofbirth;
    employee.usrpassword = usrpassword;
    employee.usrtype = "User";
    employee.googleId = "-";
    employee.displayName = "-";
    employee.usrisactive = true;
    await employee.save((err, doc) => {
        if (!err)
            res.redirect('/login');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("register/register", {
                    viewTitle: "Create Usre",
                    user: req.body,
                    layout:false
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}


// email check
function CheckEmailError(body) {
    body['emailError'] = "email allready used";
}

// mobile check
function CheckmobileError(body) {
    body['mobileError'] = "mobile allready used";
}

//form  validation 
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'usrname':
                body['usrnameError'] = err.errors[field].message;
                break;
            case 'usremail':
                body['emailError'] = err.errors[field].message;
                break;
            case 'usraddress':
                body['usraddressError'] = err.errors[field].message;
                break;
            case 'usrdateofbirth':
                body['usrdateofbirthError'] = err.errors[field].message;
                break;
            case 'usrpassword':
                body['usrpasswordError'] = err.errors[field].message;
                break;
            case 'usrmobile':
                body['mobileError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

// ganrate hashed password
function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


module.exports = router;