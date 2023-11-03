const express=require("express")
const passport = require('passport')
const router=express.Router()
const Article=require("../models/articleModel.js")
require("../services/googleAuth2.js")

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}


router.get('/',isLoggedIn, async (req,res)=>{
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

//Since slugify Is Installed  I want to get a single Page
router.get('/:slug', async(req,res)=>{
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({ slug: slug });
    
        if (!article) {
          return res.status(404).json({ message: 'Article not found' });
        }
    
        res.render('blog/singlePost/single-Post.ejs',{article:article})
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

//The google Oauth Routes
router.get('/auth/google',passport.authenticate('oauth2'))

router.get( '/auth/google/callback',
  passport.authenticate( 'oauth2', {
    successRedirect: '/', //The protected route
    failureRedirect: '/auth/google/failure'
  })
)

router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..')
})

router.get('/logout', (req, res) => {
  req.logout()
  req.session.destroy()

})


module.exports=router
