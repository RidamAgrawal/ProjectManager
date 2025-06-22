const mongoose = require('mongoose');
/*
    Status:
    Open - 0
    In-Progress - 1
    Done - 2
*/

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
        trim:true,
    },
    description: {
        type: String,
        trim:true
    },
    status: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    task: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task',
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate:{
        type:{year:Number,month:Number,day:Number},
        required:true,
    },
    endDate:{
        type:{year:Number,month:Number,day:Number},
        required:true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema,'Project');