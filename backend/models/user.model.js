const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minLength:8
    },
    project:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema,'User');