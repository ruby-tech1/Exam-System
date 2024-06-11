const mongoose = require("mongoose");
const questionSchema = require("./question");
const answerSchema = require("./answer");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide Name"],
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide a user ID"],
      ref: "Admin",
    },
    // users: {
    //   type: [userAuthSchema],
    //   required: [true, "Please provide users for this test"],
    //   validate: {
    //     validator: (arr) => (arr.length === 0 ? false : true),
    //     message: "Please provide users for this test",
    //   },
    // },
    duration: {
      type: Number,
      required: [true, "Please provide a time duration"],
    },
    startBy: {
      type: Date,
      required: [true, "Please provide a start Date"],
      // default: Date.now,
      validate: {
        validator: (date) => {
          return date > new Date(Date.now()) ? true : false;
        },
        message: "Please provide a valid start Date",
      },
    },
    stopBy: {
      type: Date,
      required: [true, "Please when the test will start"],
      validate: {
        validator: (date) => {
          return date > new Date(Date.now() + 1000 * 60 * 10) ? true : false;
        },
        message: "Please provide a valid stop Date",
      },
    },
    numberOfQuestions: {
      type: Number,
      required: [true, "Please provide number of questions"],
    },
    questions: {
      type: [questionSchema],
      required: [true, "Please provide questions"],
      validate: {
        validator: (arr) => (arr.length === 0 ? false : true),
        message: "Please provide questions for this test",
      },
    },
    examDescription: {
      type: String,
      required: [true, "Plese provide exam description"],
    },
    status: {
      type: String,
      enum: ["undeployed", "deployed", "expired"],
      default: "undeployed",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

examSchema.virtual("users", {
  ref: "UserAttempt",
  localField: "_id",
  foreignField: "examId",
  select: "-password",
  justOne: false,
});

examSchema.pre("save", function () {
  if (!this.isModified("stopBy")) return;
  const tempDate = new Date(this.stopBy);
  tempDate.setHours(tempDate.getHours() - 1);
  this.stopBy = tempDate;
});

examSchema.methods.isExamValidStart = function (time1, time2, status) {
  const time = new Date();
  if (time2 < time) {
    return [false, "Exam already expired"];
  }
  if (time1 > time) {
    return [false, "Exam not started"];
  }
  if (status === "Taken") {
    return [false, "Already Taken Exam"];
  }
  if (status !== "Not Taken") {
    return [false, "Exam Already Started"];
  }
  return [true];
};

examSchema.methods.isExamValidEnd = function (time1, status) {
  const time = new Date();
  if (time1 < time) {
    return [false, "Exam duration exceeded"];
  }
  if (status === "Taken") {
    return [false, "Already Taken Exam"];
  }
  if (status === "Not Taken") {
    return [false, "Exam not Started"];
  }
  return [true];
};

module.exports = mongoose.model("Exam", examSchema);
