require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const GoogleUser = require('../models/Users'); // Import the GoogleUser model


passport.use(new OAuth2Strategy({
  authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
  tokenURL: 'https://accounts.google.com/o/oauth2/token',
  clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
  callbackURL: 'http://localhost:4000/auth/google/callback', // Your callback URL
  scope: 'profile email'
}, function(accessToken, refreshToken, profile, cb) {
  // Call the findOrCreate method on the GoogleUser model
  GoogleUser.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})
