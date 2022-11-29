const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('usermaster');
const crypto = require('crypto');

//user page
router.get('/', requireAuth, (req, res) => {
    const UserName = req.cookies['UserName'];
    res.render("user/addupdate", {
        viewTitle: "Insert User",
        username: UserName,
        users:true
    });
});

// user page post data
router.post('/', requireAuth, (req, res) => {
    if (req.body._id == '') {
        var usremail = req.body.usremail;
        var usrmobile = req.body.usrmobile;
        User.findOne({ usremail })
            .then((response) => {
                if (response != null) {
                    CheckEmailError(req.body)
                    const UserName = req.cookies['UserName'];
                    res.render("register/register", {
                        viewTitle: "Create Usre",
                        user: req.body,
                        username: UserName,
                        layout: false
                    });
                }
                else {
                    User.findOne({ usrmobile })
                        .then((response) => {
                            if (response != null) {
                                CheckmobileError(req.body)
                                const UserName = req.cookies['UserName'];
                                res.render("register/register", {
                                    viewTitle: "Create Usre",
                                    user: req.body,
                                    username: UserName,
                                    layout: false
                                });
                            }
                            else {
                                insertRecord(req, res);
                            }
                        })
                }
            })
    }
    else {
        updateRecord(req, res);
    }
});

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
    employee.googleId = "-";
    employee.displayName = "-";
    employee.usrtype = "User";
    employee.usrisactive = true;
    await employee.save((err, doc) => {
        if (!err)
            res.redirect('/user/list');
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                const UserName = req.cookies['UserName'];
                res.render("user/addupdate", {
                    viewTitle: "Create Usre",
                    user: req.body,
                    username: UserName
                });
            }
            else
                console.log('Error during record insertion : ' + err);
        }
    });
}

// update user data
function updateRecord(req, res) {
    User.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('user/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                const UserName = req.cookies['UserName'];
                res.render("user/addupdate", {
                    viewTitle: 'Update User',
                    user: req.body,
                    username: UserName
                });
            }
            else
                console.log('Error during record edit : ' + err);
        }
    });
}

// user list
router.get('/list', requireAuth, (req, res) => {
    let usrtype = 'User';
    User.find({ usrtype }, (err, docs) => {
        if (!err) {
            const UserName = req.cookies['UserName'];
            res.render("user/list", {
                emplist: docs,
                username: UserName
            });
        }
        else {
            console.log('Error in retrieving user list :' + err);
        }
    });

});

// check email
function CheckEmailError(body) {
    body['emailError'] = "email allready used";
}

// check mobile
function CheckmobileError(body) {
    body['mobileError'] = "mobile allready used";
}

// form validation
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

// user details
router.get('/:id', requireAuth, (req, res) => {
    User.findById(req.params.id, (err, doc) => {
        if (!err) {
            const UserName = req.cookies['UserName'];
            res.render("user/addupdate", {
                viewTitle: "Update User",
                user: doc,
                username: UserName
            });
        }
    });
});

/// user delete
router.get('/delete/:id', requireAuth, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/user/list');
        }
        else {
            console.log('Error in user remove :' + err);
        }
    });
});


// ganret hasepassword
function getHashedPassword(password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

// user authorization
function requireAuth(req, res, next) {
    const authToken = req.cookies['AuthToken'];
    if (authToken != undefined) {
        next();
    } else {
        res.redirect('/login');
    }
};
module.exports = router;