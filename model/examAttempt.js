const mongoose = require("mongoose");
const answerSchema = require("./answer");

const UserAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide User Id"],
    ref: "User",
  },
  examId: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please provide Exam Id"],
    ref: "Exam",
  },
  score: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["Not Taken", "Pending", "Taken"],
    default: "Not Taken",
  },
  numberOfQuestions: {
    type: Number,
    required: [true, "Please provide number of questions"],
  },
  ans: {
    type: [answerSchema],
    default: [],
  },
  startTime: {
    type: Date,
    default: "",
  },
  stopTime: {
    type: Date,
    default: "",
  },
});

module.exports = mongoose.model("UserAttempt", UserAttemptSchema);
