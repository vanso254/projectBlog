require('dotenv').config();
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const GoogleUser = require('../models/Users'); // Import the GoogleUser model

GoogleUser.findOrCreate = async function (profile) {
  try {
    const user = await GoogleUser.findOne({ googleId: profile.id });
    if (user) {
      // User already exists, return the existing user
      return user;
    } else {
      // Create a new user
      const newUser = new GoogleUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        userName: profile.displayName,
        // You can set other fields here...
      });

      const savedUser = await newUser.save();
      return savedUser;
    }
  } catch (err) {
    return err; // Return the error
  }
}

passport.use(new OAuth2Strategy({
  authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
  tokenURL: 'https://accounts.google.com/o/oauth2/token',
  clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
  callbackURL: 'http://localhost:3000/auth/google/callback', // Your callback URL
  scope: 'profile email'
},
async function(accessToken, refreshToken, profile) {
  try {
    const user = await GoogleUser.findOrCreate(profile);
    return user;
  } catch (err) {
    return err; // Handle the error appropriately
  }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})
