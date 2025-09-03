const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
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
        console.log("token",token);
    
        if(!token){
            throw new ApiError(401,"unauthorized token")
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
    
        console.log("decoded",decoded);
    
        const user = await userModel.findById(decoded.id)
        req.user = user
        console.log(user);
        
        
        next()
    } catch (error) {
        console.log("Invalid token",error.message);
        
        throw new ApiError(401,"toekn not provided")
    }
}

module.exports = { authUser }