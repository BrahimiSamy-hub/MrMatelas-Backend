const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const userJwt = require('../middlewares/userJwt')
const upload = require('../middlewares/fileUpload')

// Define routes
router.post('/', upload.single('image'), categoryController.createCategory)
router.get('/', categoryController.getCategories)
router.put(
  '/:id',
  userJwt,
  upload.single('image'),
  categoryController.updateCategory
)
router.delete('/:id', userJwt, categoryController.deleteCategory)

module.exports = router
