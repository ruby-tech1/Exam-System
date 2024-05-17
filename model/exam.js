const mongoose = require('mongoose');
const questionSchema = require('./question');
const answerSchema = require('./answer');
const {BadRequestError,} = require('../errors/index')

const userAuthSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide User Id'],
        ref: 'User',
    },
    score: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Not Taken', 'Pending', 'Taken'],
        default: "Not Taken"
    },
    ans: {
        type: [answerSchema],
        default: []
    },
    startTime: {
        type: Date,
        default: '',
    },
    stopTime: {
        type: Date,
        default: '',
    }
})

const examSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide Name'],
        minlength: 5,
        maxlength: 50,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide a user ID'],
        ref: 'Admin'
    },
    users: {
        type: [userAuthSchema],
        required: [true, 'Please provide User for this test'],
    },
    duration: {
        type: Number,
        required: [true, 'Please provide a time duration']
    },
    startBy: {
        type: Date,
        default: Date.now,
    },
    stopBy: {
        type: Date,
        required: [true, 'Please when the test will start'],
        timezoneOffset: '+01:00'
    },
    numberOfQuestions: {
       type: Number,
       required: [true, 'Please provide nubmer of questions']
    },
    questions: {
        type: [questionSchema],
        required: [true, 'Please provide questions'],
    },
    examDescription: {
        type: String,
        required: [true, 'Plese provide exam description'],
    },
    // status: {
    //     type: String,
    //     enum: ['undeployed', 'deployed', 'expired'],
    //     default: 'undeployed'
    // },
}, 
{timestamps: true});

examSchema.pre('save', async function(next){
    const tempDate = new Date(this.stopBy);
    const currentDate = new Date()
    if (tempDate < currentDate){
        throw new BadRequestError('Stops By Date is before present Date');
    }
    await tempDate.setHours(tempDate.getHours() - 1);
    this.stopBy = tempDate
    next();
})

examSchema.methods.calcTime = function(examDuration){
    let time = examDuration / 60
    if(time % 60 === 0){
        time /= 60
        return [time]
    }
    let min = time % 60
    time = (time - min) / 60
    return [time, min]
}

examSchema.methods.isExamValidStart = function(time1, time2, status){
    const time = new Date();
    if(time2 < time){
        return [false, 'Exam already expired'];
    }
    if(time1 > time){
        return [false, 'Exam not started'];
    }
    if(status === 'Taken'){
        return [false, 'Already Taken Exam']
    }
    if(status !== 'Not Taken'){
        return [false, 'Exam Already Started'];
    }
    return [true];
}

examSchema.methods.isExamValidEnd = function(time1, status){
    const time = new Date();
    if(time1 < time){
        return [false, 'Exam duration exceeded']
    }
    if(status === 'Taken'){
        return [false, 'Already Taken Exam']
    }
    if(status === 'Not Taken'){
        return [false, 'Exam not Started']
    }
    return [true];
}

module.exports = mongoose.model('Exam', examSchema);