const { timeStamp } = require('console');
const mongoose = require('mongoose');
const status = require('statuses');

const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the Id for the question'],
        ref: 'question',
    },
    ans: {
        type: String,
        required: [true, 'Please provide Answer'],
    },
    status: {
        type: Boolean,
        default: false,
    },
    cAns: {
        type: String,
        default: '',
    }
},
{timeStamp: true});

module.exports = AnswerSchema;