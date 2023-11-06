const passport = require("passport")
const LocalStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')
const User=require('../models/userModel')

// Use the LocalStrategy for Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        console.log('Attempting authentication with email:', email);
        const user = await User.findOne({ email });

        if (!user) {
          console.log('User not found');
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          console.log('Password does not match');
          return done(null, false, { message: 'Invalid email or password' });
        }

        console.log('Authentication successful');
        return done(null, user);
      } catch (err) {
        console.error('Error during authentication:', err);
        return done(err);
      }
    }
  )
)


// Serialize the user to store in the session
// Serialize the user to store in the session
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
})

// Deserialize the user from the session
passport.deserializeUser((id, done) => {
  try {
    User.findById(id, (err, user) => {
      if (err) {
        console.error('Error in deserializeUser:', err);
        return done(err);
      }
      done(null, user);
    });
  } catch (err) {
    console.error('Error in deserializeUser:', err);
    done(err);
  }
})

// Export the Passport configuration
module.exports=passport
