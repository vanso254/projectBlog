const express=require("express")
const router=express.Router()
const Article=require("../models/articleModel.js")

router.get('/',async (req,res)=>{
    // latest article
    try {
        const latestArticle = await Article
            .findOne()
            .sort({ datePosted: -1 }); // Sort by datePosted in descending order to get the latest article

        if (latestArticle) {
            res.render('blog/index.ejs', { article: latestArticle });
        } else {
            res.render('blog/index.ejs', { article: null }); // Handle the case where no articles are found
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})



module.exports=router
