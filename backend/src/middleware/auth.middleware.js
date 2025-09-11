const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const fileModel = require('../models/file.model')
const ApiResponse = require('../utilities/ApiResponse')
const ApiError = require('../utilities/ApiError')

async function authUser(req,res,next){
    // get token 
    // validate token
    // verify token by secrt key
    // find that verfied token(id) in db
    // get that user
    try {
        const token  = req.cookies.token;
        
        if(!token){
            throw new ApiError(401,"unauthorized token")
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
        const user = await userModel.findById(decoded.id)
        req.user = user
        
        next()

    } catch (error) {
        console.log("Invalid token",error.message);
        
        throw new ApiError(401,"toekn not provided")
    }
}

async function checkOwner(req,res,next){
    try {
        const file = await fileModel.findById( req.params._id)
        if(!file){
            throw new ApiError(403,"File not found")
        }
    
        if(String(file.uploadedBy) !== String(req.user._id)){
            throw new ApiError(400,"Only owner can have access to add collaborators")
        }
    
        req.fileData = file;
    
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = { authUser,checkOwner }