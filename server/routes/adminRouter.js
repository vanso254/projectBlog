const express=require('express')
const multer=require("multer")
const passport=require('passport')
const LocalStrategy = require("passport-local").Strategy;
const Article=require("../models/articleModel.js")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../database/mysql2')
const router=express.Router()


passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async function (email, password, cb) {
      try {     

        // Retrieve the user from the database based on the provided email
        const [rows] = await db.execute('SELECT * FROM User WHERE Email = ?', [email]);

        if (rows.length === 0) {
          return cb(null, false);
        }

        const user = rows[0];

        // Compare the provided password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (passwordMatch) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
)
passport.serializeUser(function (user, cb) {
  cb(null, (user.UserID)); // Convert to string
});



passport.deserializeUser(async function (id, cb) {
  try {   

    // Retrieve the user from the database based on the converted id
    const [rows] = await db.execute('SELECT * FROM User WHERE UserID = ?', [id]);

    if (rows.length === 0) {
      return cb(new Error('User not found'));
    }

    const user = rows[0];
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
});


router.get('/',checkAuthenticated,(req,res)=>{
  res.redirect('/admin/dashboard')
})

router.get('/dashboard',(req,res)=>{
  res.render('admin/dashboard/home/_index.ejs')
})

router.get('/markdown',(req,res)=>{
  res.render('admin/dashboard/markdown/_markdown.ejs')
})

router.get('/editor',(req,res)=>{
    res.render('admin/dashboard/editor/_editor.ejs')
})

router.get('/login',checkNotAuthenticated,(req,res)=>{
  res.render('admin/forms/login.ejs')
})
router.post("/login",passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/admin",
}),
(err, req, res, next) => {
  if (err) next(err);
}
)

router.get('/register',(req,res)=>{
  res.render('admin/forms/register.ejs')
})
router.post('/register',async (req,res)=>{
  try{
const {password,email}=req.body
const hashedPassword=await bcrypt.hash(password, saltRounds)
const fullName=req.body.firstName+" "+req.body.secondName


if (!fullName || !email || !password) {
  return res.status(400).json({ error: 'FullName, Email and Password are required fields.' });
}
const user = await db.execute(
  'INSERT INTO User (FullName, Email, Password) VALUES (?, ?, ?)',
  [fullName, email, hashedPassword]
);

console.log(user)
res.redirect('/admin/login')
  }catch(error){

    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });

  }
})

// Set storage engine using multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      const newImgName = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, 'IMG-' + newImgName)
    }
  })
  


  // Init upload
const upload = multer({ storage: storage });

//Adding a new article
router.post('/newArticle', upload.single('file'), async (req, res) => {
  try {
     // Check if a file was uploaded
     if (!req.file) {
      throw new Error('No file uploaded')
    }
    const newImgName = req.file.filename
    const article = new Article({
      title: req.body.title,
      imageName: newImgName,
      imageCaption:req.body.imageCaption,
      author: req.body.author,
      tag: req.body.tag,
      description: req.body.description,
      markdown: req.body.markdown
    })
    
    await article.save()
    // Send a success response
    // res.status(200).json({ message: 'Article created successfully' })

    res.redirect('/')
    console.log(article)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating article' })
  }
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated')
    return next()
  }

  console.log('User is not authenticated, redirecting to /login')
  res.redirect('/admin/login')
}
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('User is authenticated, redirecting to /')
    return res.redirect('/pages')
  }
  console.log('User is not authenticated')
  next()
}

module.exports=router