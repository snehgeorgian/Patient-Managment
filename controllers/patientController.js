const e = require('express');
const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Patient = mongoose.model('patientmaster');
const upload = require("../middlewares/upload");
const moment =require('moment');


// patient page call
router.get('/', requireAuth, (req, res) => {
    const UserName = req.cookies['UserName'];
    res.render("patient/addupdate", {
        viewTitle: "Create Patient",
        username: UserName,
    });
});
// patient page post data
router.post('/', requireAuth, upload.single("file"), (req, res) => {
    if (req.body._id == '') {
        var patemail = req.body.patemail;
        var patmobile = req.body.patmobile;
        Patient.findOne({ patemail })
            .then((response) => {
                if (response != null) {
                    CheckEmailError(req.body)
                    const UserName = req.cookies['UserName'];
                    res.render("patient/addupdate", {
                        viewTitle: "Create Patient",
                        patient: req.body,
                        username: UserName,
                    });
                }
                else {
                    Patient.findOne({ patmobile })
                        .then((response) => {
                            if (response != null) {
                                CheckmobileError(req.body)
                                const UserName = req.cookies['UserName'];
                                res.render("patient/addupdate", {
                                    viewTitle: "Create Patient",
                                    patient: req.body,
                                    username: UserName,
                                });
                            }
                            else {
                                insertRecord(req, res);
                            }
                        })
                }
            })
        //insertRecord(req, res);
    }
    else {
        updateRecord(req, res);
    }

});

function insertRecord(req, res) {
    if (req.file == undefined) {
        return res.send(`You must select a file.`);
    }
    const userId = req.cookies['UserId'];
    var patient = new Patient();
    patient.patname = req.body.patname;
    patient.patage = req.body.patage;
    patient.patgender = req.body.patgender;
    patient.patappointmentdate = req.body.patappointmentdate;
    patient.patreason = req.body.patreason;
    patient.patprvhistory = req.body.patprvhistory;
    patient.patdoctorname = req.body.patdoctorname;
    patient.pathospitalloc = req.body.pathospitalloc;
    patient.patmrn = req.body.patmrn;
    patient.patemail = req.body.patemail;
    patient.patmobile = req.body.patmobile;
    patient.pataddress = req.body.pataddress;
    patient.patimage = req.file.filename,
        patient.patcreateddate = new Date();
    patient.patcreatedBy = userId,
        patient.save((err, doc) => {
            if (!err)
                res.redirect('patient/list');
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    const UserName = req.cookies['UserName'];
                    res.render("patient/addupdate", {
                        viewTitle: "Create Patient",
                        patient: req.body,
                        username: UserName,
                        PatientTitle:"Create Patient"
                    });
                }
                else
                    console.log('Error during record insertion : ' + err);
            }
        });
}


// patient update data
function updateRecord(req, res) {
    if (req.file != undefined) {
        let data = {
            patname : req.body.patname,
            patage : req.body.patage,
            patgender : req.body.patgender,
            patappointmentdate : req.body.patappointmentdate,
            patreason : req.body.patreason,
            patprvhistory : req.body.patprvhistory,
            patdoctorname : req.body.patdoctorname,
            pathospitalloc : req.body.pathospitalloc,
            patmrn : req.body.patmrn,
            patemail : req.body.patemail,
            patmobile : req.body.patmobile,
            pataddress : req.body.pataddress,
            patimage : req.file.filename,
        }
        Patient.updateOne({ _id: req.body._id }, data, { new: true }, (err, doc) => {
            if (!err) { res.redirect('patient/list'); }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    const UserName = req.cookies['UserName'];
                    res.render("patient/addupdate", {
                        viewTitle: 'Update Patient',
                        patient: req.body,
                        username: UserName,
                    });
                }
                else
                    console.log('Error during record edit : ' + err);
            }
        });
    }
    else {
        Patient.updateOne({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
            if (!err) { res.redirect('patient/list'); }
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    const UserName = req.cookies['UserName'];
                    res.render("patient/addupdate", {
                        viewTitle: 'Update Patient',
                        patient: req.body,
                        username: UserName,
                    });
                }
                else
                    console.log('Error during record edit : ' + err);
            }
        });
    }
}


// patient list
router.get('/list', requireAuth, (req, res) => {
    let patcreatedBy = req.cookies['UserId'];
    Patient.find({ patcreatedBy }).sort({ _id: -1 })
        .populate({
            path: 'usermaster',
            select: 'usrname'
        }).then(data => {
           
            const UserName = req.cookies['UserName'];
            res.render("patient/list", {
                patlist: data,
                username: UserName,
            });
        }).catch(err => {
            throw err;
        })

});

router.get('/lists', (req, res) => {
    Patient.find().sort({ _id: -1 })
        .populate({
            path: 'usermaster',
            select: 'usrname'
        }).then(data => {
        
            res.render("patient/lists", {
                patlist: data,
                layout: false,
                moment:moment
            });
        }).catch(err => {
            throw err;
        })
});



// check email
function CheckEmailError(body) {
    body['patemailError'] = "email allready used";
}

// check mobile
function CheckmobileError(body) {
    body['patmobileError'] = "mobile allready used";
}

// check  validation
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'patname':
                body['patnameError'] = err.errors[field].message;
                break;
            case 'patemail':
                body['patemailError'] = err.errors[field].message;
                break;
            case 'patmobile':
                body['patmobileError'] = err.errors[field].message;
                break;
            case 'pataddress':
                body['pataddressError'] = err.errors[field].message;
                break;
            case 'patage':
                body['patageError'] = err.errors[field].message;
                break;
            case 'patdob':
                body['patdobError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

// patient details no authorize
router.get('/details/:id', (req, res) => {
    Patient.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("patient/details", {
                viewTitle: "Details patient",
                patient: doc,
                layout: false
            });
        }
    });
});

// patient details  with authorize
router.get('/detail/:id', requireAuth, (req, res) => {
    Patient.findById(req.params.id, (err, doc) => {
        if (!err) {
            const UserName = req.cookies['UserName'];
            res.render("patient/detail", {
                viewTitle: "Details patient",
                patient: doc,
                username: UserName,
            });
        }
    });
});


// patient edit data
router.get('/:id', requireAuth, (req, res) => {
    Patient.findById(req.params.id, (err, doc) => {
        if (!err) {
            const UserName = req.cookies['UserName'];
            if(doc.patgender == "Male"){
                if(doc.pathospitalloc == "Barrie"){
                    res.render("patient/addupdate", {
                        viewTitle: "Update Patient",
                        patient: doc,
                        username: UserName,
                        m:true,
                        f:false,
                        x:true,
                        y:false
                    });
                }
                else{
                    res.render("patient/addupdate", {
                        viewTitle: "Update Patient",
                        patient: doc,
                        username: UserName,
                        m:true,
                        f:false,
                        x:false,
                        y:true
                    });
                }
            }
            else{
                if(doc.pathospitalloc == "Barrie"){
                    res.render("patient/addupdate", {
                        viewTitle: "Update Patient",
                        patient: doc,
                        username: UserName,
                        m:false,
                        f:true,
                        x:true,
                        y:false
                    });
                }
                else{
                    res.render("patient/addupdate", {
                        viewTitle: "Update Patient",
                        patient: doc,
                        username: UserName,
                        m:false,
                        f:true,
                        x:false,
                        y:true
                    });
                }
            }
          
        }
    });
});

// patient delete

router.get('/delete/:id', requireAuth, (req, res) => {
    Patient.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/patient/list');
        }
        else {
            console.log('Error in patient remove :' + err);
        }
    });
});

// cheeck authorization
function requireAuth(req, res, next) {
    const authToken = req.cookies['UserToken'];
    if (authToken != undefined) {
        next();
    } else {
        res.redirect('/login');
    }
};
module.exports = router;