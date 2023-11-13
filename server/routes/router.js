const express = require("express");
const router = express.Router();
const Article = require("../models/articleModel.js");
const User = require("../models/userModel");
const { Comment, Reply } = require('../models/commentsModel');
const passport = require("passport");
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Specify that the email is the username field
    function (email, password, cb) {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return cb(null, false);
          }

          const isValid = validPassword(password, user.hash, user.salt);

          if (isValid) {
            return cb(null, user);
          } else {
            return cb(null, false);
          }
        })
        .catch((err) => {
          cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id)
    .then(user => {
      cb(null, user)
    })
    .catch(err => {
      cb(err)
    })
})


router.get("/pages",checkAuthenticated, async (req, res) => {
  // latest article
  try {
    const latestArticle = await Article.findOne().sort({ datePosted: -1 }); // Sort by datePosted in descending order to get the latest article

    if (latestArticle) {
      res.render("blog/index.ejs", { article: latestArticle });
    } else {
      res.render("blog/index.ejs", { article: null }); // Handle the case where no articles are found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Since slugify Is Installed  I want to get a single Page
router.get('/pages/:slug', checkAuthenticated, async (req, res) => {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({ slug: slug });

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Comments for the article
        const comments = await Comment.find({ articleID: article._id }).sort({ datePosted: 1 });

        // Replies for the comments
        const commentIds = comments.map(comment => comment._id);
        const replies = await Reply.find({ commentID: { $in: commentIds } }).sort({ datePosted: 1 });

        res.render('blog/singlePost/single-Post.ejs', { article, comments, replies });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




//Get the Login Form
router.get("/login",checkNotAuthenticated, (req, res) => {
  res.render("forms/user/login.ejs");
})

router.post("/login",checkNotAuthenticated,passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/pages",
  }),
  (err, req, res, next) => {
    if (err) next(err);
  }
);
//The Rigister Route

//Get the Register form
router.get("/register", (req, res) => {
  res.render("forms/user/register.ejs");
});

router.post("/register",checkNotAuthenticated, (req, res, next) => {
  const saltHash = genPassword(req.body.password)

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user)
  });

  res.redirect("/pages/:slug")
})

//Middlewares to protect routes
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated')
    return next()
  }

  console.log('User is not authenticated, redirecting to /login')
  res.redirect('/login')
}


function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated, redirecting to /')
    return res.redirect('/pages')
  }
  console.log('User is not authenticated')
  next()
}


//helper Functions
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

module.exports = router
