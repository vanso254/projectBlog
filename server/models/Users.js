const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  userName: String,
  email: String
});

userSchema.statics.findOrCreate = async function (profile) {
    try {
      const userObj = {
        googleId: profile.id,
        userName: profile.displayName,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
      };
  
      let user = await this.findOne({ googleId: profile.id });
  
      if (user) {
        return user;
      } else {
        user = await this.create(userObj);
        return user;
      }
    } catch (err) {
      console.error(err);
      return null; // Handle errors appropriately in your code
    }
  };
  


const GoogleUser = mongoose.model('GoogleUser', userSchema);

module.exports = GoogleUser;
