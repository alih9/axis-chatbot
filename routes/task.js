const Joi=require('@hapi/joi');
const { validate } = require('@hapi/joi/lib/types/symbol');

const express=require('express');
const app=express();
const Router=express.Router()
app.use(express.json());
app.use(express.urlencoded({extended: true}));

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' ,
limits:{
    fileSize:10000
},
fileFilter(req,file,cb){
  if(!file.originalname.endsWith('.pdf')){
      return cb(new Error('Please upload a PDF'))
  }
  cb(undefined,true)

}


},



)
 
// var app = express()
 
Router.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
 
Router.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})
 
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
Router.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})




module.exports=Router;