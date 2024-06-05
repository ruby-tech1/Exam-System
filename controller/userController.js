const UserStudent = require("../model/user-student");
const UserAdmin = require("../model/user-teacher");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const getAllUsers = async (req, res) => {
  const users = await UserStudent.find().select("name email gender");
  res.status(StatusCodes.OK).json({ users });
};

const showUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Provide Credentials");
  }

  const User = req.user.role === "admin" ? UserAdmin : UserStudent;
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Provide Credentials");
  }
  user.password = newPassword;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password Changed!" });
};

module.exports = {
  getAllUsers,
  showUser,
  updateUser,
  updateUserPassword,
};
