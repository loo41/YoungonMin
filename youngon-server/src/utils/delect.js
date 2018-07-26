const fs = require('fs')

exports.delectImg = async(path) => {
  let files = []
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path)
    files.forEach(function(file, index){
      var curPath = path + "/" + file
      if(fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    });
    fs.rmdirSync(path)
  }
}