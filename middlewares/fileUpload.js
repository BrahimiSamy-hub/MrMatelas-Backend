const multer = require('multer')
const path = require('path')

// Set up storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

// Initialize multer with the storage engine
const upload = multer({ storage: storage })

module.exports = upload
