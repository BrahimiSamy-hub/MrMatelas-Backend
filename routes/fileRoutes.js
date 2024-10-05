const express = require('express')
const router = express.Router()
const fileUploadController = require('../controllers/fileUploadController')
const userJwt = require('../middlewares/userJwt')
// Define routes

router.post('/', fileUploadController.uploadImage)

module.exports = router
