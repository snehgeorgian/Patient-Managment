const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

// home page
router.get('/', (req, res) => {
    res.render("home/home", {
        viewTitle: "home page",
        layout:false
    });
});


module.exports = router;