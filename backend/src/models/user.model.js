const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema(
    {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/,
        index: true
    },
    email: {
        type:String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        required:true
    },
    storageused:{
        type: Number,
        default: 0
    },
    storageLimit:{
        type: Number,
        default: 1073741824 // 1GB in bytes
    },
    files:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'File',
        default: []
    }
},{
    timestamps :true
})

const user = mongoose.model('User', userSchema);

module.exports = user;