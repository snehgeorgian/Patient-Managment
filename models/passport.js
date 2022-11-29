const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('usermaster');

dotenv.config();

module.exports = function(passport){ 
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async(accessToken, refreshToken, profile, done)=> {
       console.log(profile);
      }
    ));
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}