const mongoose=require("mongoose")

var googleUsers=new mongoose.Schema({
    googleId: String,
    email:String,
    userName:String
})

module.exports=mongoose.model('GoogleUser',googleUsers)