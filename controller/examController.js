const Exam = require("../model/exam");
const Attempt = require("../model/examAttempt");
const {
  updateExamAttemptStart,
  updateExamAttemptStop,
  scoring,
} = require("../utils/index");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const getAllExams = async (req, res) => {
  const { search, sort } = req.query;
  const queryObject = {};
  let select = "";

  if (req.user.role === "user") {
    queryObject.status = "deployed";
    select = "_id name duration stopBy";
  }
  if (req.user.role === "admin") {
    queryObject.createdBy = req.user.userId;
  }

  if (search) {
    queryObject.name = { $regex: search, $options: "i" };
  }

  let result = Exam.find(queryObject);

  result = result.select(select);

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

  res.status(StatusCodes.OK).json({ nHits: exams.length, exams });
};

const getSingleExam = async (req, res) => {
  const attempt = await Attempt.findOne({ userId: req.user.userId });
  const queryObject = {
    _id: req.params.id,
  };
  let result = Exam.findOne(queryObject);

  if (req.user.role === "admin") {
    queryObject.createdBy = req.user.userId;
  }
  if (req.user.role === "user") {
    if (!attempt) {
      throw new CustomError.UnauthorizedError(
        `Unauthorized to access this exam`
      );
    }
    queryObject.status = "deployed";
    result.select("_id name duration stopBy examDescription");
  }

  const exam = await result;
  if (!exam) {
    throw new CustomError.NotFoundError(
      `No exam with id ${req.params.id} was found`
    );
  }
  res.status(StatusCodes.OK).json({ exam });
};

const createExam = async (req, res) => {
  const { name, users, duration, startBy, stopBy, questions, examDescription } =
    req.body;
  const numberOfQuestions = questions.length;
  const createdBy = req.user.userId;

  let exam = await Exam.create({
    name,
    users,
    duration,
    startBy,
    stopBy,
    questions,
    examDescription,
    numberOfQuestions,
    createdBy,
  });

  const { _id: examId } = exam;

  for (const a of users) {
    await Attempt.create({
      userId: a.userId,
      examId: exam._id,
      numberOfQuestions,
    });
  }

  exam = await Exam.findOne({ _id: examId }).populate("users");

  // for (const a of users) {
  //   await userStudent.findOneAndUpdate(
  //     { _id: a.userId },
  //     { $push: { examStatus: { examID: exam._id } } },
  //     { runValidators: true }
  //   );
  // }

  res.status(StatusCodes.CREATED).json({ exam });
};

const startExam = async (req, res) => {
  const exam = await Exam.findOne({
    _id: req.params.id,
    status: "deployed",
  });
  if (!exam) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const userAttempt = await Attempt.findOne({
    examId: req.params.id,
    userId: req.user.userId,
  });
  if (!userAttempt) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const examValid = await exam.isExamValidStart(
    exam.startBy,
    exam.stopBy,
    userAttempt.status
  );
  if (!examValid[0]) {
    throw new CustomError.BadRequestError(examValid[1]);
  }

  const Date1 = new Date();
  const Date2 = new Date(Date.now() + exam.duration * 1000);

  await updateExamAttemptStart({
    Attempt,
    userId: req.user.userId,
    examId: req.params.id,
    status: "Pending",
    Date1,
    Date2,
  });

  res.status(StatusCodes.OK).json({ exam });
};

const endExam = async (req, res) => {
  const {
    user: { userId },
    body: { examId },
  } = req;
  const exam = await Exam.findOne({
    _id: examId,
    status: "deployed",
  });
  if (!exam) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const userAttempt = await Attempt.findOne({
    examId,
    userId,
  });
  if (!userAttempt) {
    throw new CustomError.BadRequestError(`Invalid Exam Details`);
  }

  const examValid = await exam.isExamValidEnd(
    userAttempt.stopTime,
    userAttempt.status
  );
  if (!examValid[0]) {
    throw new CustomError.BadRequestError(examValid[1]);
  }

  const ans = scoring({
    userAnswers: req.body.ans,
    examQuestions: exam.questions,
  });

  await updateExamAttemptStop({
    Attempt,
    userId,
    examId,
    status: "Taken",
    ans,
    numberOfQuestion: exam.numberOfQuestions,
  });

  const update = await Attempt.findOne({ userId, examId }).populate({
    path: "userId",
    select: "name email gender",
  });

  res.status(StatusCodes.OK).json({ user: update });
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
  const exam = await Exam.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!exam) {
    throw new CustomError.NotFoundError(
      `No exam with id ${req.params.id} exist`
    );
  }
  if (exam.status === "deployed") {
    throw new CustomError.BadRequestError("Already Deployed");
  }

  exam.status = "deployed";
  await exam.save();

  res.status(StatusCodes.OK).json({ msg: "Deployed!" });
};

const updateExam = async (req, res) => {
  res.send("Exam Update Route");
};

module.exports = {
  getAllExams,
  getSingleExam,
  createExam,
  updateExam,
  deleteExam,
  startExam,
  endExam,
  deployExam,
};
