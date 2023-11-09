const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    try {
      // Fetch the user from the database based on the provided email using Mongoose
      const user = await User.findOne({ email: email });

      if (!user) {
        // User not found
        console.log('User not found');
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Compare the provided password with the stored hash
      if (await bcrypt.compare(password, user.password)) {
        // Password matches, authentication is successful
        console.log('Authentication successful');
        return done(null, user);
      } else {
        // Password is incorrect
        console.log('Password incorrect');
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (err) {
      // Handle any errors that occur during the authentication process
      console.error('Error during authentication:', err)
      return done(err)
    }
  }

  // Initialize the Passport LocalStrategy with Mongoose
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))

  passport.serializeUser((user, done) => {
    try {
      console.log('Serializing user:', user)
      // Assuming user.id is a valid identifier for your user
      done(null, user.id);
    } catch (error) {
      console.error('Error during serialization:', error)
      done(error, null);
    }
  })
  
      
  passport.deserializeUser((id, done) => {
    try {
      console.log('Deserialization process started for user ID:', id)
  
      User.findById(id, (err, user) => {
        if (err) {
          console.error('Error in deserializeUser:', err);
          console.log('Deserialization failed for user ID:', id)
          return done(err, null); // Pass the error and null user
        }
  
        if (user) {
          console.log('Deserialization successful for user ID:', id)
          console.log('Deserialized user:', user);
        } else {
          console.log('User not found during deserialization for user ID:', id)
        }
  
        done(null, user); // Pass the user object
      })
    } catch (error) {
      console.error('Unexpected error during deserialization:', error);
      done(error, null);
    }
  })
  
}

module.exports = initialize
