const fileModel = require('../models/file.model')
const imagekit = require('../services/imagekit')

const fileUploadController = async(req,res) => {
    console.log("files",req.file)
    
}
module.exports = { fileUploadController }