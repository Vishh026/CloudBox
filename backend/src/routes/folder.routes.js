const express = require('express');
const router = express.Router()
const folderController = require('../controllers/Folder.Controller');
const { authUser } = require('../middleware/auth.middleware');

router.post('/create',authUser,folderController.createFolder) 

router.get('/:folderId',authUser,folderController.getFolderContent)




module.exports = router;