const express=require("express")
const multer=require("multer")
const path=require('path')
const router=express.Router()
const Article=require("../models/articleModel.js")

router.get('/',(req,res)=>{
    res.render('index.ejs')
})

router.get('/form',(req,res)=>{
    res.render('form.ejs')
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

router.post('/newArticle', upload.single('file'), async (req, res) => {
  try {
    const newImgName = req.file.filename
    const article = new Article({
      title: req.body.title,
      imageName: newImgName,
      author: req.body.author,
      tag: req.body.tag,
      description: req.body.description,
      markdown: req.body.markdown
    })
    
    await article.save()
    res.redirect('/')
  } catch (error) {
    console.log(error)
    res.send('Error uploading file')
  }
})

module.exports=router
