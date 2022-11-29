const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
// patientSchema
var patientSchema = new mongoose.Schema({
    patname: {
        type: String,
        required: 'Please enter full name.'
    },
    patage: {
        type:Number,
        required: 'Please enter age.'
    },
    patgender:{
        type:String,
    },
    patappointmentdate: {
        type: Date,
        required: 'Please enter appointment date.'
    },
    patreason:{
        type:String
    },
    patprvhistory:{
        type:String
    },
    patdoctorname:{
        type:String
    },
    pathospitalloc:{
        type:String
    },
    patmrn:{
        type:String
    },
    patemail: {
        type: String,
        required: 'Please enter email.'
    },
    patmobile: {
        type: String,
        required: 'Please enter mobile.'
    },
    pataddress: {
        type: String,
        required: 'Please enter address.'
    },
    patimage: {
        type: String,
        required: 'Please select image.'
    },
    patcreateddate: {
        type: Date,
    },
    patcreatedBy: {
        type: ObjectId,
    },
});

// email validation
patientSchema.path('patemail').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Please enter valid e-mail addtess.');

patientSchema.path('patmobile').validate((val) => {
    mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return mobileRegex.test(val);
}, 'Please enter valid mobile no');

patientSchema.path('patage').validate((val) => {
    ageRegex = /^\S[0-9]{0,3}$/;
    return ageRegex.test(val);
}, 'Please enter valid age');

mongoose.model('patientmaster', patientSchema);