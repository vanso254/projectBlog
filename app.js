const express=require('express')
const path=require('path')
const crypto = require('crypto')
const mongoose=require('mongoose')
const passport=require('passport')
const flash=require('connect-flash')
const session=require('express-session')
const blogRouter=require('./server/routes/router.js')
const adminRouter=require('./server/routes/adminRouter.js')
const app=express()

//connecting the database
mongoose.connect('mongodb://127.0.0.1:27017/freeLanceBlog_DB',{
    useNewUrlParser: true, useUnifiedTopology: true
})


//This line enables the use of a form to pass data to the database
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),// Replace with a strong, randomly generated secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Ensure that the cookie is only accessible via HTTP (not JavaScript)
        secure: true, // Only send the cookie over HTTPS
        maxAge: 3600000, // Set an appropriate max age for your session (in milliseconds)
        sameSite: 'strict', // Prevent cross-site request forgery (CSRF) attacks
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Adding a public folder
app.set(express.static(path.join(__dirname, 'public')))
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')))
app.use('/uploads', express.static(path.resolve(__dirname, 'public/uploads')))

//Adding the Froala path for css and js
app.use('/froalacss',express.static(__dirname+'/node_modules/froala-editor/css/froala_editor.css'))
app.use('/froalajs',express.static(__dirname+'/node_modules/froala-editor/js/froala_editor.min.js'))

//Setting up the router
app.use('/', blogRouter)
app.use('/admin',adminRouter)

//checking if the session Exists
app.get('/check-session', (req, res) => {
    if (req.session) {
      // Session exists
      res.send('Session exists');
    } else {
      // Session does not exist
      res.send('Session does not exist');
    }
  });

app.listen(4000)