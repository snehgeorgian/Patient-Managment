const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = mongoose.model('usermaster');


 dotenv.config();


// google login win passport
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: 'https://sneh-patientmanagement.onrender.com/auth/google/callback',
       //callbackURL: 'http://localhost:3000/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
       // console.log("profile",profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          usrname: profile.name.givenName + " "+ profile.name.familyName,
          usremail : profile.name.givenName+"@gmail.com",
          usrmobile : "9988663322",
          usraddress :"-",
          usrdateofbirth : new Date(),
          usrpassword :"-",
          usrtype :"User",
          usrisactive :true,
        };
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};