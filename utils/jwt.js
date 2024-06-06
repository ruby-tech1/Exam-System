const jwt = require("jsonwebtoken");

const createToken = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachCookieToResponse = ({ res, tokenUser }) => {
  const token = createToken({ payload: tokenUser });

  const time = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + time),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

module.exports = {
  createToken,
  isTokenValid,
  attachCookieToResponse,
};
