const updateUserExamStatus = async ({
  userStudent,
  userId,
  examId,
  status,
}) => {
  await userStudent.findOneAndUpdate(
    { _id: userId },
    { $set: { "examStatus.$[e1].status": status } },
    { arrayFilters: [{ "e1.examID": examId }] },
    { runValidators: true }
  );
};

const updateExamStatus = async ({
  Exam,
  userId,
  examId,
  status,
  Date1,
  Date2,
}) => {
  await Exam.findOneAndUpdate(
    {
      _id: examId,
      "users.userId": userId,
    },
    {
      $set: {
        "users.$[e1].startTime": Date1,
        "users.$[e1].stopTime": Date2,
        "users.$[e1].status": status,
      },
    },
    { arrayFilters: [{ "e1.userId": userId }] },
    { runValidators: true }
  );
};

const updateExamAns = async ({ Exam, userId, examId, status, ans }) => {
  await Exam.findOneAndUpdate(
    {
      _id: examId,
      "users.userId": userId,
    },
    {
      $set: {
        "users.$[e1].status": status,
        "users.$[e1].score": ans[0],
        "users.$[e1].ans": ans[1],
      },
    },
    { arrayFilters: [{ "e1.userId": userId }] },
    { runValidators: true }
  );
};

const updateUserAnsweredExams = async ({
  userStudent,
  userId,
  examId,
  ans,
  numOfQuestion,
}) => {
  const update = await userStudent
    .findOneAndUpdate(
      { _id: userId },
      {
        $push: {
          answeredExams: {
            examID: examId,
            answer: ans[1],
            score: ans[0],
            numberOfQuestions: numOfQuestion,
          },
        },
      },
      { new: true, runValidators: true }
    )
    .select("name email gender answeredExams");
  return update;
};

module.exports = {
  updateUserExamStatus,
  updateExamStatus,
  updateExamAns,
  updateUserAnsweredExams,
};
