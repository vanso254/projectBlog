const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const blogRouter=require('./server/routes/router.js')
const adminRouter=require('./server/routes/adminRouter.js')
const app=express()

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