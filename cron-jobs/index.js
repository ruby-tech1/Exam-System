const cron = require("node-cron");
const { expireExamJob } = require("./expireExam");

const timeSchedule = `0-5 0 * * * *`;

const scheduleTask = () => {
  cron.schedule(timeSchedule, expireExamJob);
};

module.exports = scheduleTask;
