const express = require('express');
const authController= require('../controllers/auth.controller');  
const router = express.Router();

// creating router for authentication
router.post('/auth/register',authController.registerController )
router.post('/auth/login',authController.loginController )

module.exports = router;