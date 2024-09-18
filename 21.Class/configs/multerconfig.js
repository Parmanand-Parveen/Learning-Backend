const multer = require("multer")
const crypto = require("crypto")
const { extname } = require("path")
const path = require("path")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex') +path.extname(file.originalname)
    cb(null,uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

module.exports = upload