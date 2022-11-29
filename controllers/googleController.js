const express = require('express')
const passport = require('passport')
const router = express.Router()
const crypto = require('crypto');

router.get('/', passport.authenticate('google', { scope: ['profile'] }))

const authTokens = {};
//GET to patient list
router.get('/google/callback' , passport.authenticate('google'),
(req,res)=>{
 // console.log("res",res.req)
  const authToken = generateAuthToken();
   authTokens[authToken] = "googleauth"+res.req.user.googleId;
   res.cookie('UserToken', authToken);
   res.cookie('UserName', res.req.user.displayName);
   if(res.req.user._id != null || res.req.user._id != undefined){
    res.cookie('UserId', res.req.user._id);
   }
   else{
    res.cookie('UserId', "637898fa36071c1af0489db8");
   }
   res.redirect('/patient/list');
})

// logout
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})

// generate auth token
const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

module.exports = router