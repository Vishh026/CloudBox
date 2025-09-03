const multer = require('multer')

//  ---------- Multer Config ----------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp/images')
  },
  fileName: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

module.exports = {upload}

