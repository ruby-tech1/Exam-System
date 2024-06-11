const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Please provide the question"],
  },
  image: {
    type: String,
    validate: {
      validator: (url) => {
        try {
          if (!url) return true;
          urlLink = new URL(url);
        } catch (error) {
          return false;
        }
        return (
          urlLink.protocol.includes("http") &&
          urlLink.host === "res.cloudinary.com"
        );
      },
      message: "Please provide a valid cloudinary link",
    },
    default: "",
  },
  options: {
    type: [String],
    required: [true, "Please provide the options for the question"],
  },
  answer: {
    type: String,
    required: [true, "Please provide the answer to the question"],
  },
  explaination: {
    type: String,
    required: [true, "Please provide the explaination to the question"],
  },
});

module.exports = QuestionSchema;
