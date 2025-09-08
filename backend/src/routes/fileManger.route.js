const express = require('express');
const {authUser} = require('../middleware/auth.middleware')
const router = express.Router()
const {upload} = require('../middleware/upload.middleware');
const fileManagerController = require('../controllers/fileManger.Controller')


// creating router for authentication
router.post('/upload',authUser,upload.single('file'),fileManagerController.uploadFile)
router.delete('/my-files/:id',authUser,fileManagerController.deleteFile) 
router.get('/my-files/:id',authUser)
router.get('/my-files',authUser,fileManagerController.getMyFile)
router.get('/my-files/download/:id',authUser,fileManagerController.downloadFile)
router.get('/filtered',authUser,fileManagerController.getFilterFiles)
router.get('/openFile/:id',authUser,fileManagerController.openFile)
router.patch('/:id/rename',authUser,fileManagerController.renameFile)

module.exports = router;