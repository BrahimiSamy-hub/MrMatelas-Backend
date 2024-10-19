const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')
const userJwt = require('../middlewares/userJwt')

router.post('/', userJwt, productController.createProduct)
router.get('/', productController.getAllProducts)
router.get('/names', productController.getProductsName)
router.put('/:id', userJwt, userJwt, productController.updateProduct)
router.get('/random', productController.getRandomProducts)
router.get('/:id', productController.getOneProduct)

module.exports = router
