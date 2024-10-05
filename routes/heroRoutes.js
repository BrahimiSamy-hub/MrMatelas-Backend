const express = require('express')
const router = express.Router()
const heroController = require('../controllers/heroController')
const userJwt = require('../middlewares/userJwt')

// Define routes

router.post('/', userJwt, heroController.createHero)
router.put('/:id', userJwt, heroController.updateHero)
router.get('/', heroController.getHeroes)

module.exports = router
