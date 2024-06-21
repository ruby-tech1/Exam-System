const Exam = require("../model/exam");
const Attempt = require("../model/examAttempt");

const expireExamJob = async () => {
  console.log("cron");
  await Exam.updateMany(
    {
      status: "deployed",
      stopBy: { $lt: new Date(Date.now()) },
    },
    {
      status: "expired",
    },
    { runValidators: true }
  );
  await Attempt.updateMany(
    {
      status: "Pending",
      stopTime: { $lt: new Date(Date.now()) },
    },
    {
      status: "Taken",
    },
    { runValidators: true }
  );
  console.log("Updated Exams");
};

module.exports = { expireExamJob };
