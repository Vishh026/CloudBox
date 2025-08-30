const express = require('express');
const authController= require('../controllers/auth.controller');  
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware')

// creating router for authentication
router.post('/register',authController.registerController )
router.post('/login',authController.loginController )

module.exports = router;