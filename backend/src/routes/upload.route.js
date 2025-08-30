const express = require('express');
const { fileUploadController } = require('../controllers/fileUploadController');
const {authUser} = require('../middleware/auth.middleware')
const router = express.Router()
const upload = require('../middleware/upload.middleware')

// creating router for authentication
router.post('/upload',authUser,upload.single('filename'),fileUploadController)

module.exports = router;