const UserStudent = require("../model/user-student");
const UserAdmin = require("../model/user-teacher");
const { attachCookieToResponse } = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const register = async (req, res) => {
  const { name, email, password, gender, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new CustommError.BadRequestError("Please provide credentials");
  }

  const queryObject = {
    name,
    email,
    password,
    gender,
  };

  const User = role === "admin" ? UserAdmin : UserStudent;
  const user = await User.create(queryObject);
  const tokenUser = { userId: user._id, name: user.name, role: user.role };

  attachCookieToResponse({ res, tokenUser });
  res.status(StatusCodes.CREATED).json({
    name: user.name,
    email: user.email,
    gender: user.gender,
    role: user.role,
  });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new CustomError.BadRequestError("Please provide crediatials");
  }

  const User = role === "admin" ? UserAdmin : UserStudent;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  attachCookieToResponse({ res, tokenUser });

  res.status(StatusCodes.OK).json({
    user: tokenUser,
  });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "logout" });
};

module.exports = {
  register,
  login,
  logout,
};
