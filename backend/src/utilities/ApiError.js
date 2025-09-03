class ApiError extends Error{
    constructor(statuscode,message ="Something went wrong",error= [],stack=""){
        super(message)
        this.statuscode = statuscode,
        this.message = message,
        this.data = null,
        this.error = error,
        this.success = false

        if(stack){
            // If a stack trace is provided → use that.
            this.stack = stack
        }else{
            // Otherwise → generate a fresh stack trace starting from where the error is instantiated.
            Error.captureStackTrace(this,this.constructor)
        }
    }
    
}
module.exports = ApiError