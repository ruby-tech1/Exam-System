const mongoose = require("mongoose");
const answerSchema = require("./answer");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Name"],
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Please provide Email"],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid Email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide Paswword"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    gender: {
      type: String,
      required: [true, "Please provide Gender"],
      enum: ["male", "female"],
    },
    // examStatus: {
    //   type: [examStatusSchema],
    //   default: [],
    // },
    // answeredExams: {
    //   type: [answeredExamsSchema],
    //   default: [],
    // },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("exams", {
  ref: "UserAttempt",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
