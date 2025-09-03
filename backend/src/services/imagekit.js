const ImageKit = require("imagekit");
const fs = require('fs');
const ApiError = require("../utilities/ApiError");

const imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_KEY,
    privateKey : process.env.PRIVATE_KEY ,
    urlEndpoint : process.env.URLENDPOINT
});


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
    return await imagekit.deleteFile(file_id)  
    
}

module.exports  = { uploadOnImagekit ,deletefromImagekit}

