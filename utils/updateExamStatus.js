const updateExamAttemptStart = async ({
  Attempt,
  userId,
  examId,
  status,
  Date1,
  Date2,
}) => {
  const attempt = await Attempt.findOne({ userId, examId });
  attempt.status = status;
  attempt.startTime = Date1;
  attempt.stopTime = Date2;
  (attempt.startTime = Date1), (attempt.stopTime = Date2), await attempt.save();
};

const updateExamAttemptStop = async ({
  Attempt,
  userId,
  examId,
  status,
  ans,
  numberOfQuestion,
}) => {
  await Attempt.findOneAndUpdate(
    { userId, examId },
    {
      $set: {
        status,
        ans: ans[1],
        score: ans[0],
        numberOfQuestion,
      },
    },
    { runValidators: true }
  );
};

module.exports = {
  updateExamAttemptStart,
  updateExamAttemptStop,
};
