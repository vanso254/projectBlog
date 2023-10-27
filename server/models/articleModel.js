const mongoose=require("mongoose")

var articleSchema=new mongoose.Schema({
   title:{
    type:String,
    required:true
   },
   author:{
      type:String,
      required:true
   },
   description:{
    type:String,
    required:true
   },
   tag:{
    type:String,
    required:true
   },
   imageName:{
    type:String,
    required:true
   },
   markdown:{
    type:String,
    required:true
   },
   datePosted:{
    type:Date,
    required:true,
    default:Date.now
   }

})

module.exports=mongoose.model('Article',articleSchema)