const cron = require("node-cron");
const { expireExamJob } = require("./jobs/expireExam");

const timeSchedule = `0-5 0 * * * *`;

const start = () => {
  cron.schedule(timeSchedule, expireExamJob);
  console.log("Cron Job Scheduled");
};

// start();

module.exports = start;
