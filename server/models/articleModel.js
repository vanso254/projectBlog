const mongoose=require("mongoose")
const slugify = require('slugify')
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDOMPurify(new JSDOM().window)

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
   imageCaption:{
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
   },
   slug:{
      type:String,
      required:true,
      unique:true
  }
})

articleSchema.pre('validate',function(next){

   //Adding the Slug
   if (this.title){
       this.slug=slugify(this.title,{lower:true,
       strict:true})
   }
   //Adding the dompurify
   if (this.title) {
      this.title = dompurify.sanitize(this.title);
  }
  if (this.description) {
      this.description = dompurify.sanitize(this.description);
  }
  if (this.markdown) {
      this.markdown = dompurify.sanitize(this.markdown);
  }
   next()
})

module.exports=mongoose.model('Article',articleSchema)