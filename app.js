const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const blogRouter=require('./server/routes/router.js')
const app=express()

//connecting the database
mongoose.connect('mongodb://127.0.0.1:27017/freeLanceBlog_DB',{
    useNewUrlParser: true, useUnifiedTopology: true
})

//This line enables the use of a form to pass data to the database
app.use(express.urlencoded({extended:false}))

//Adding a public folder
app.set(express.static(path.join(__dirname, 'public')))
app.use('/src', express.static(path.resolve(__dirname, 'public')))

//Setting up the router
app.use('/', blogRouter)

app.listen(4000)