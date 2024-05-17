const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide the question'],
    },
    options: {
        type: [String],
        required: [true, 'Please provide the options for the question'],
    },
    answer: {
        type: String,
        required: [true, 'Please provide the answer to the question'],
    },
    explaination: {
        type: String,
        required: [true, 'Please provide the explaination to the question'],
    }
})

module.exports = QuestionSchema;