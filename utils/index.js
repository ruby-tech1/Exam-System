const {
  updateUserExamStatus,
  updateExamStatus,
  updateExamAns,
  updateUserAnsweredExams,
} = require("../utils/updateExamStatus");
const scoring = require("../utils/scoring");
const { createToken, isTokenValid, attachCookieToResponse } = require("./jwt");

module.exports = {
  updateUserExamStatus,
  updateExamStatus,
  updateExamAns,
  updateUserAnsweredExams,
  scoring,
  createToken,
  isTokenValid,
  attachCookieToResponse,
};
