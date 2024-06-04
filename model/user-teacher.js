const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide Name"],
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
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("Admin", adminSchema);
