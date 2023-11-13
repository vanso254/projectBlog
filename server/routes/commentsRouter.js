const express = require("express");
const router = express.Router();
const { Comment, Reply } = require("../models/commentsModel");

router.post("/comment", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { articleID, comment } = req.body;
      const userID = req.user.id;

      const newComment = new Comment({
        articleID,
        comment,
        datePosted: Date.now(),
        authorID: userID,
      });

      const savedComment = await newComment.save();
      console.log(savedComment);
      const articleSlug=req.body.articleSlug
      res.redirect(`/pages/${articleSlug}`)
    } else {
      // If not authenticated, redirect to the login page or handle as needed
      return res.redirect("/login");
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/reply',async(req,res)=>{
    try {
        if (req.isAuthenticated()) {
          const { commentID, reply } = req.body;
          const userID = req.user.id;
    
          const newReply = new Reply({
            commentID,
            reply,
            datePosted: Date.now(),
            authorID: userID,
          });
    
          const savedReply = await newReply.save();
          console.log(savedReply);
          const articleSlug=req.body.articleSlug
          res.redirect(`/pages/${articleSlug}`)
        } else {
          // If not authenticated, redirect to the login page or handle as needed
          return res.redirect("/login");
        }
      } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      } 
})

module.exports = router;
