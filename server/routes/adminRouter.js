const express=require('express')
const multer=require("multer")
const Article=require("../models/articleModel.js")
const router=express.Router()

router.get('/editor',(req,res)=>{
    res.render('admin/editor.ejs')
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

module.exports=router