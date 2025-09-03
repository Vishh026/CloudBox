const express = require('express');
const  {uploadController } = require('../controllers/fileUploadController');
const {authUser} = require('../middleware/auth.middleware')
const router = express.Router()
const {upload} = require('../middleware/upload.middleware');
const { deleteFileController } = require('../controllers/fileDeleteController');

// creating router for authentication
router.post('/upload',authUser,upload.single('file'),uploadController)
router.delete('/:id',authUser,deleteFileController) 

module.exports = router;