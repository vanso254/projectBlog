const express=require('express')
const session = require('express-session')
const path=require('path')
const mongoose=require('mongoose')
const passport=require('passport')
const blogRouter=require('./server/routes/router.js')
const adminRouter=require('./server/routes/adminRouter.js')
const app=express()

const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex'); // Generate a strong random secret


app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Ensure cookies are only transmitted over HTTPS
      httpOnly: true, // Prevent client-side JavaScript access
      maxAge: 20*3600000, // Session expires after 20 hour (adjust as needed)
      sameSite: 'strict', // Helps protect against Cross-Site Request Forgery (CSRF) attacks
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

//connecting the database
mongoose.connect('mongodb://127.0.0.1:27017/freeLanceBlog_DB',{
    useNewUrlParser: true, useUnifiedTopology: true
})

//This line enables the use of a form to pass data to the database
app.use(express.urlencoded({extended:false}))

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

app.listen(4000)