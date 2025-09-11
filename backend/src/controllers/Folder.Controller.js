const folderModel = require("../models/folder.model")
const fileModel = require("../models/file.model")
const ApiError = require('../utilities/ApiError')
const ApiResponse = require('../utilities/ApiResponse')

const createFolder = async(req,res) => {
    // get name,parentfolderid => req.body
    // check duplicate name folder via name,parentfolderid,uploadedby
    // validation
    // create folder - name,upladedby,parentfolderid

   try {
     const { name,parentFolderId } = req.body

     if(!name || name.trime() === "") throw new ApiError(400,"Foldername is required")
 
     if(parentFolderId){
        const parentFolder = await folderModel.findById(parentFolderId)
        if(!parentFolder){
            throw new ApiError(404,"parent folder not found")
        }
     }
     const exisitingFolder = await folderModel.findOne({
        name,
        uploadedBy: req.user._id,
        parentFolderId: parentFolderId || null
     })
 
     if(!exisitingFolder){
         throw new ApiError(400,"Folder already exists")
     }
     const folder = await folderModel.create({
         name,
         uploadedBy: req.user._id,
         parentFolderId: parentFolderId || null
     })
 
     return res.status(201).json(
         new ApiResponse(201,folder, "Folder created")
     )
   } catch (error) {
     next(new ApiError(error.statusCode || 500, error.message || "Failed to create folder"));
   }

}


const getFolderContent = async(req,res,next) => {
    try {
        const { folderId } = req.params;

        const folders  =await folderModel.find({
            parentFolderId: folderId || null,
            uploadedBy: req.user._id
        }).sort({name: 1})

        console.log("flders",folders)

        const files = await fileModel.find({
            folderId: folderId || null,
            uploadedBy: req.user._id,
            isTrashed: false
        }).sort({ fileName : 1})
        console.log("files",files);

        res.json(
            new ApiResponse(200,{
                folders,files
            },"Folder fetch successfully")
        )
    } catch (error) {
    next(new ApiError(500, "Failed to fetch folder content"));
    }
}

const uploadFolder = async(req,res) => {
    // get user => req.user
    // get folderid
    // file 
}

module.exports = { createFolder,getFolderContent }