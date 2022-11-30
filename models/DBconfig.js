const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://snehpatel:Sneh2275@comp2068.n8kwegr.mongodb.net/patient_DB', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Connection created.')
    }
    else {
        console.log('Connection failed: : ' + err)
    }
});

require('./user.model');
require('./patient.model');