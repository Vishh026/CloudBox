const express = require('express');
const {authUser, checkOwner} = require('../middleware/auth.middleware')
const router = express.Router()
const {upload} = require('../middleware/upload.middleware');
const fileManagerController = require('../controllers/file.controller')


// creating router for authentication
router.post('/upload',authUser,upload.single('file'),fileManagerController.uploadFile)
router.delete('/my-files/:id',authUser,fileManagerController.deleteFile) 
router.get('/my-files/:id',authUser)
router.get('/my-files',authUser,fileManagerController.getMyFile)
router.get('/my-files/download/:id',authUser,fileManagerController.downloadFile)
router.get('/filtered',authUser,fileManagerController.getFilterFiles)
router.get('/openFile/:id',authUser,fileManagerController.openFile)
router.patch('/:id/rename',authUser,fileManagerController.renameFile)

router.patch('/:id/toggle-public',authUser,fileManagerController.togglePublic)
router.get('/share/:shareToken',fileManagerController.getPublicFile)
router.post('/:id/add-collaborators',authUser,checkOwner,fileManagerController.addcollaborators)




module.exports = router;