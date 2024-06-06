const Exam = require("../model/exam");
const userStudent = require("../model/user-student");

const utils = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const getExamsUser = async (req, res) => {
  const { search, sort } = req.query;

  const queryObject = {
    "users.userId": req.user.userId,
    status: "deployed",
  };

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Exam.find(queryObject);

  result = result.select("_id name duration stopBy");

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("name");
  }

  if (sort === "z-a") {
    result = result.sort("-name");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const exams = await result;

  if (exams.length === 0) {
    throw new CustomError.NotFoundError("No Exam Found");
  }

  res.status(StatusCodes.OK).json({ nHits: exams.length, exams });
};

const getExamUser = async (req, res) => {
  const exam = await Exam.findOne({
    _id: req.params.id,
    "users.userId": req.user.userId,
    status: "deployed",
  }).select("_id name duration stopBy examDescription");

  if (!exam) {
    throw new CustomError.NotFoundError(
      `No exam with id ${req.params.id} was found`
    );
  }

  res.status(StatusCodes.OK).json({ exam });
};

const createExam = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const { users, questions } = req.body;
  req.body.numberOfQuestions = questions.length;

  const exam = await Exam.create(req.body);

  for (const a of users) {
    await userStudent.findOneAndUpdate(
      { _id: a.userId },
      { $push: { examStatus: { examID: exam._id } } },
      { runValidators: true }
    );
  }

  res.status(StatusCodes.CREATED).json({ exam });
};

const startExam = async (req, res) => {
  const exam = await Exam.findOne({
    _id: req.params.id,
    "users.userId": req.user.userId,
    status: "deployed",
  }).select("-users");

  if (!exam) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const exam1 = await Exam.findOne(
    {
      _id: req.params.id,
      "users.userId": req.user.userId,
    },
    {
      users: {
        $elemMatch: { userId: req.user.userId },
      },
    }
  );

  const examValid = await exam.isExamValidStart(
    exam.startBy,
    exam.stopBy,
    exam1.users[0].status
  );
  if (!examValid[0]) {
    throw new CustomError.BadRequestError(examValid[1]);
  }

  const Date1 = new Date();
  const Date2 = new Date(Date.now() + exam.duration * 1000);

  await utils.updateExamStatus({
    Exam,
    userId: req.user.userId,
    examId: req.params.id,
    status: "Pending",
    Date1,
    Date2,
  });

  await utils.updateUserExamStatus({
    userStudent,
    userId: req.user.userId,
    examId: req.params.id,
    status: "Pending",
  });

  res.status(StatusCodes.OK).json({ exam });
};

const endExam = async (req, res) => {
  const exam = await Exam.findOne({
    _id: req.body.examId,
    "users.userId": req.user.userId,
  });

  if (!exam) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const exam1 = await Exam.findOne(
    { _id: req.body.examId, "users.userId": req.user.userId },
    {
      users: {
        $elemMatch: { userId: req.user.userId },
      },
    }
  );

  const examValid = await exam.isExamValidEnd(
    exam1.users[0].stopTime,
    exam1.users[0].status
  );
  if (!examValid[0]) {
    throw new CustomError.BadRequestError(examValid[1]);
  }

  await utils.updateUserExamStatus({
    userStudent,
    userId: req.user.userId,
    examId: req.body.examId,
    status: "Taken",
  });

  const ansArray = utils.scoring({
    userAnswers: req.body.ans,
    examQuestions: exam.questions,
  });

  await utils.updateExamAns({
    Exam,
    userId: req.user.userId,
    examId: req.body.examId,
    status: "Taken",
    ans: ansArray,
  });

  const update = await utils.updateUserAnsweredExams({
    userStudent,
    userId: req.user.userId,
    examId: req.body.examId,
    ans: ansArray,
    numOfQuestion: exam.numberOfQuestions,
  });

  res.status(StatusCodes.OK).json({ user: update });
};

const getExamsAdmin = async (req, res) => {
  const { search, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Exam.find(queryObject);

  result = result.select("-questions -users");

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    result = result.sort("name");
  }

  if (sort === "z-a") {
    result = result.sort("-name");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const exams = await result;

  if (exams.length === 0) {
    throw new CustomError.NotFoundError("No Exam Found");
  }

  res.status(StatusCodes.OK).json({ nHits: exams.length, exams });
};

const getExamAdmin = async (req, res) => {
  const exam = await Exam.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!exam) {
    throw new CustomError.NotFoundError(
      `No exam with id ${req.params.id} was found`
    );
  }

  res.status(StatusCodes.OK).json({ exam });
};

const deleteExam = async (req, res) => {
  const {
    user: { userId },
    params: { id: examId },
  } = req;
  const exam = await Exam.findOneAndDelete({ _id: examId, createdBy: userId });
  if (!exam) {
    throw new CustomError.NotFoundError(`No Exam with id ${examId} exist`);
  }

  res.status(StatusCodes.OK).json({ msg: "Deleted Exam" });
};

const deployExam = async (req, res) => {
  const exam = await Exam.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.user.userId,
    },
    { status: "deployed" },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!exam) {
    throw new CustomError.NotFoundError(
      `No exam with id ${req.params.id} exist`
    );
  }

  res.status(StatusCodes.OK).json({ msg: "Deployed!" });
};

const updateExam = async (req, res) => {
  res.send("Exam Update Route");
};

module.exports = {
  getExamsUser,
  getExamUser,
  createExam,
  startExam,
  endExam,
  getExamsAdmin,
  getExamAdmin,
  updateExam,
  deleteExam,
  deployExam,
};
