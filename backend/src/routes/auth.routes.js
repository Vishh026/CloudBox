const express = require('express');
const authController= require('../controllers/auth.controller');  
const router = express.Router();
const {upload }= require('../middleware/upload.middleware')

// creating router for authentication
router.post('/register',authController.registerController )
router.post('/login',authController.loginController )

module.exports = router;