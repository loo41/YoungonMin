const multer = require('koa-multer')
const _delect = require('./delect')
const path = require('path')
 
const storage = multer.diskStorage({  
  destination: function (req, file, cb) {  
    cb(null, '/usr/share/wx_youngon/static')
  },   
  filename: async function (req, file, cb) {
    const {type} = req.body
    let fileFormat = (file.originalname).split(".")  
    if (type) {
      if (type === 'backgroundSlider') {
        await _delect.delectImg('.backgroundSlider-youngon.jpg') 
        cb(null, `backgroundSlider-youngon.jpg`)
        return
      }
      else if (type === 'backgroundIndex') {
        await _delect.delectImg('.backgroundIndex-youngon.jpg')
        cb(null, `backgroundIndex-youngon.jpg`)
        return
      }
    }
    cb(null, Date.now() + 'youngon' +"." + fileFormat[fileFormat.length - 1])
  }  
})  
const upload = multer({ storage: storage })


module.exports = {
  upload
}