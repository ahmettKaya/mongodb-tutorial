const express = require('express')
const path = require('path')
const registerationController = require('../controllers/registrationController')
const router = express.Router()
router.post('/', registerationController.handleNewUser)
module.exports = router