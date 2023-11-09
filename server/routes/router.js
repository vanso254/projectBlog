const express=require("express")
const router=express.Router()
const passport=require('passport')
const Article=require("../models/articleModel.js")
const User = require('../models/userModel.js')
const initializePassport= require('../services/passport-config')

// Initialize Passport with Mongoose for user lookup
initializePassport(
  passport,
  async (email) => {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      // Handle errors appropriately
      return null;
    }
  },
  async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      console.log('There is A problem Finding a User',err)
      return null;
    }
  }
)

router.get('/page',checkAuthenticated,async (req,res)=>{
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
router.get('/page/:slug',checkAuthenticated, async(req,res)=>{
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

//Registration Route
router.get('/register', (req, res) => {
    res.render('forms/user/register.ejs',{ messages: req.flash('regError') })
})


router.post('/register', async (req, res) => {
    const newUser = new User({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const user = await newUser.save();
        console.log(user);
        res.redirect('/login');
    } catch (err) {
        console.error(err)
        let regError=err
        req.flash('regError', regError)
        res.redirect("/register")
    }
})


//Setting up the Login Route
router.get('/login',checkNotAuthenticated,(req, res) => {
    res.render('forms/user/login.ejs',{ messages: req.flash('loginErr') })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/page',
    failureRedirect: '/login',
    failureFlash: true
  }), checkNotAuthenticated)
  
  function checkAuthenticated(req, res, next) {
    console.log('Check Authenticated Middleware - Start');
    
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        console.log('User is authenticated. Proceeding to the next middleware/route.');
        // If the user is authenticated, continue with the call to next
        return next();
    }
    
    console.log('User is not authenticated. Redirecting to the login page.');
    // If the user is not authenticated, redirect to the login page
    res.redirect('/login');
    
    console.log('Check Authenticated Middleware - End');
}


// Function to prevent the user from going back to the login page after logging in
function checkNotAuthenticated(req, res, next) {
    console.log('Check Not Authenticated Middleware - Start');
    
    // Check if the user is authenticated
    if (req.isAuthenticated()) {
        console.log('User is authenticated. Redirecting to /page.');
        // If the user is authenticated, redirect to the /page route
        return res.redirect('/page');
    }
    
    console.log('User is not authenticated. Proceeding to the next middleware/route.');
    // If the user is not authenticated, continue with the call to next
    next();

    console.log('Check Not Authenticated Middleware - End');
}



module.exports=router
