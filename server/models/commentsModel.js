const mongoose=require('mongoose')

var commentSchema=new mongoose.Schema({
    articleID:{
        required:true,
        type:String
    },
    comment:{
        type:String,
        required:true
    },
    datePosted:{
        type:Date,
        required:true
    },
    authorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

var replySchema=new mongoose.Schema({
    Reply:{
        type:String,
        required:true
    },
    commentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    datePosted:{
        type:Date,
        required:true
    },
    authorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

// Create models
const Comment = mongoose.model('Comment', commentSchema)
const Reply = mongoose.model('Reply', replySchema)

// Export models
module.exports = {
    Comment: Comment,
    Reply: Reply
}