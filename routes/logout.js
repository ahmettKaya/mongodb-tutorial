const express = require('express')
const path = require('path')
const logoutController = require('../controllers/logoutController')
const router = express.Router()
router.get('/', logoutController.handleLogout)
module.exports = router