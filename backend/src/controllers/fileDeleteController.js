const fileModel = require("../models/file.model");
const ApiError = require("../utilities/ApiError");
const ApiResponse = require("../utilities/ApiResponse");


const deleteFileController = async(req,res) => {
    // get the user id from user and 
    // file id from params
    // find fileid in db -> valiadation
    // check ownership => file.userid === userid
    // check if fileid in imagekit => delete
    // delet from db => findbyIdanddelte


    const fileId = req.params.id;
    const userId = req.user.id;

    console.log("file id ",fileId);
    console.log("user id: ",userId);

    const file = await fileModel.findById(fileId)
    if(!file){
        throw new ApiError(401,"File not found")
    }

    if(file.userId !== userId){
        throw new ApiError(403,"not authorized to delte this file")
    }

    if(file.imageKitFileId){
        try {
            await deleteFileController(file.imageKitFileId)
        } catch (error) {
            console.log("Imagekit delete error",error.message);
            throw new ApiError(403,"Invalid access");
            
            
        }
    }

    await fileModel.findByIdAndDelete(fileId)

    res.status(200).json(
        new ApiResponse(201,{deletedFileId: fileId},"file deleted")
    )

    
    
}

module.exports  = {deleteFileController}