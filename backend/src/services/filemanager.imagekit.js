const fs = require('fs');
const ApiError = require("../utilities/ApiError");
const imagekit = require('../services/imagekit')
function uploadOnImagekit(file){
    return new Promise((resolve,reject)=> {
        if (!fs.existsSync(file.path)) {
            return reject(new Error("File not found at path: " + file.path));
        }

        imagekit.upload({
            file: fs.createReadStream(file.path),
            fileName: file.originalname,
            folder:'CloudBox'
        },(error,result) => {
            if(error) reject(error)
                else resolve(result)
        })
    })
}


async function deletefromImagekit(file_id){
     try {
        return await imagekit.deleteFile(file_id);
    } catch (err) {
        throw new ApiError(500, "Failed to delete file from ImageKit", [err.message]);
    }
   
}

module.exports  = { uploadOnImagekit ,deletefromImagekit }