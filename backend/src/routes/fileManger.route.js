const express = require('express');
const {authUser} = require('../middleware/auth.middleware')
const router = express.Router()
const {upload} = require('../middleware/upload.middleware');
const fileManagerController = require('../controllers/fileManger.Controller')


// creating router for authentication
router.post('/upload',authUser,upload.single('file'),fileManagerController.uploadController)
router.delete('/:id',authUser,fileManagerController.deleteFileController) 
router.get('/my-files',authUser,fileManagerController.getMyFile)
router.get('/download/:id',authUser,fileManagerController.downloadFile)
router.get('/filtered',authUser,fileManagerController.getFilterFiles)


module.exports = router;