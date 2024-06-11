const {
  updateExamAttemptStart,
  updateExamAttemptStop,
} = require("../utils/updateExamStatus");
const scoring = require("../utils/scoring");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");
const { createToken, isTokenValid, attachCookieToResponse } = require("./jwt");

module.exports = {
  updateExamAttemptStart,
  updateExamAttemptStop,
  scoring,
  createToken,
  isTokenValid,
  attachCookieToResponse,
  createTokenUser,
  checkPermissions,
};
