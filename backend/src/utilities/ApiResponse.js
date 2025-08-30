class ApiResponse{
    constructor(statuscode,data,message="Success"){
        this.statuscode = statuscode,
        this.message = message,
        this.data = data,
        this.sucess= statuscode < 400
    }
}
module.exports = ApiResponse