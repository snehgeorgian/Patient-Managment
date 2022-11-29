const mongoose = require('mongoose');
// employeeSchema
var userSchema = new mongoose.Schema({
    usrname: {
        type: String,
        required: 'Please enter full name.'
    },
    usremail: {
        type: String,
        required: 'Please enter email.'
    },
    usrmobile: {
        type: String,
        required: 'Please enter mobile.'
    },
    usraddress: {
        type: String,
        required: 'Please enter address.'
    },
    usrtype: {
        type: String,
    },
    usrdateofbirth: {
        type: Date,
        required: 'Please enter date of birth.'
    },
    usrpassword:{
        type: String,
        required: 'Please enter password.'
    },
    usrisactive:{
      type:Boolean
    },
    googleId : {
        type : String,
        required: true 
    } , 
    displayName : {
     type : String,
     required: true
 } ,
});

// email validation
userSchema.path('usremail').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Please enter valid e-mail addtess.');

userSchema.path('usrmobile').validate((val) => {
    mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return mobileRegex.test(val);
}, 'Please enter valid mobile no');

mongoose.model('usermaster', userSchema);