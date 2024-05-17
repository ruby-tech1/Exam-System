const mongoose = require('mongoose');
const answerSchema = require('./answer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const examStatusSchema = new mongoose.Schema({
    examID: {
        type: mongoose.Types.ObjectId,
        ref: 'Exam',
        required: ['true', 'Please provide Exam Id']
    },
    status: {
        type: String,
        enum: ['Not Taken', 'Pending', 'Taken'],
        default: "Not Taken"
    }
})


const answeredExamsSchema = new mongoose.Schema({
    examID: {
        type: mongoose.Types.ObjectId,
        ref: 'Exam',
        required: ['true', 'Please provide Exam Id']
    },
    answer: {
        type: [answerSchema],
        required: [true, 'Please provide answers'],
    },
    score: {
        type: Number,
        default: 0,
    },
    numberOfQuestions: {
        type: Number,
        required: [true, 'Please provide nubmer of questions']
    }
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide Name'],
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Please provide Email'],
        match:  [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        , 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide Paswword'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user'
    },
    gender: {
        type: String,
        required: [true, 'Please provide Gender'], 
        enum: ['male', 'female'],
    },
    examStatus: {
        type: [examStatusSchema],
        default: [],
    },
    answeredExams: {
        type: [answeredExamsSchema],
        default: [],
    }
}, 
{timestamps: true});

UserSchema.pre('save', async function() {
    if(!this.isModified('password')){
        return
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createToken = function (){
    return jwt.sign(
        {userId: this._id, role: this.role},
        process.env.JWT_SECRET,
        {expiresIn: '30d'}
    )
}

UserSchema.methods.comparePassword = async function (password){
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

module.exports = mongoose.model('User', UserSchema);