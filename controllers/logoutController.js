const express = require('express');
var router = express.Router();

// lougot page call
router.get('/', (req, res) => {
    res.clearCookie("AuthToken");
    res.clearCookie("UserToken");
    res.redirect('/login');
});

module.exports = router;