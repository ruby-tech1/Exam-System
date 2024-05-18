const Exam = require('../model/exam');
const userStudent = require('../model/user-student');

const {updateUserExamStatus, updateExamStatus, updateExamAns, updateUserAnsweredExams} = require('../utils/updateExamStatus');
const scoring = require('../utils/scoring')

const {StatusCodes} = require('http-status-codes');
const {NotFoundError, BadRequestError,} = require('../errors/index')

const getExamsUser = async (req, res) => {

    const {search, sort} = req.query

    const queryObject = {
        "users.userId": req.user.userId,
    }

    if(search){
        queryObject.name = {$regex: search, $options: 'i'}
    }

    let result = Exam.find(queryObject)

    result = result.select("_id name duration stopBy")

    if(sort === 'latest'){
        result = result.sort("-createdAt")
    }

    if(sort === 'oldest'){
        result = result.sort("createdAt")
    }

    if(sort === 'a-z'){
        result = result.sort("name")
    }

    if(sort === 'z-a'){
        result = result.sort("-name")
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const exams = await result

    if(exams.length === 0){
        throw new NotFoundError('No Exam Found')
    }

    res.status(StatusCodes.OK).json({nHits: exams.length, exams})
}

const getExamUser = async(req, res) => {
    const exam = await Exam.findOne({
        "_id": req.params.id,
        "users.userId": req.user.userId
    }).select("_id name duration stopBy examDescription")

    if(!exam){
        throw new NotFoundError(`No exam with id ${req.params.id} was found`);
    }

    res.status(StatusCodes.OK).json({exam})
}

const createExam = async(req, res) => {
    req.body.createdBy = req.user.userId;
    const {users, questions} = req.body;
    req.body.numberOfQuestions = questions.length;

    const exam = await Exam.create(req.body);

    for (const a of users){
        await userStudent.findOneAndUpdate(
            {_id: a.userId},
            { "$push": {"examStatus": {examID: exam._id}} },
            {runValidators: true}
        )
    }

    res.status(StatusCodes.CREATED).json({exam});
}

const startExam = async(req, res) => {
    const exam = await Exam.findOne({
        "_id": req.body.examId,
        "users.userId": req.user.userId
    }).select("-users");
    
    if(!exam){
        throw new BadRequestError(`Invalid Exam Details`);
    }

    const exam1 = await Exam.findOne(
        {
            "_id": req.body.examId,
            "users.userId": req.user.userId
        },
        {"users": {
            "$elemMatch": {"userId": req.user.userId}
        }}
    )

    const examValid = await exam.isExamValidStart(exam.startBy, exam.stopBy, exam1.users[0].status);
    if(!examValid[0]){
        throw new BadRequestError(examValid[1]);
    }

    const Date1 = new Date();
    const Date2 = new Date();
    const time = await exam.calcTime(exam.duration);
    if(time.length === 1){
        Date2.setHours(Date2.getHours() + time[0 ]);
    }else{
        Date2.setHours(Date2.getHours() + time[0], Date2.getMinutes() + time[1]);
    }

    await updateExamStatus(req.user.userId, req.body.examId, 'Pending', Date1, Date2)

    await updateUserExamStatus(req.user.userId, req.body.examId, 'Pending')

    res.status(StatusCodes.OK).json({exam});
}

const endExam = async(req, res) => {
    const exam = await Exam.findOne({
        "_id": req.body.examId,
        "users.userId": req.user.userId
    });

    if(!exam){
        throw new BadRequestError(`Invalid Exam Details`);
    }

    const exam1 = await Exam.findOne(
        {"_id": req.body.examId,
            "users.userId": req.user.userId
        },
        {"users": {
            "$elemMatch": {"userId": req.user.userId}
        }}
    )

    const examValid = await exam.isExamValidEnd(exam1.users[0].stopTime, exam1.users[0].status)
    if(!examValid[0]){
        throw new BadRequestError(examValid[1]);
    }

    await updateUserExamStatus(req.user.userId, req.body.examId, 'Taken');
    
    const ansArray = await scoring(req.body.ans, exam.questions);

    await updateExamAns(req.user.userId, req.body.examId, 'Taken', ansArray);

    const update = await updateUserAnsweredExams(req.user.userId, req.body.examId, ansArray, exam.numberOfQuestions);

    res.status(StatusCodes.OK).json({user: update});
}

const getExamsAdmin = async(req, res) => {
    const {search, sort} = req.query

    const queryObject = {
        "createdBy": req.user.userId
    }

    if(search){
        queryObject.name = {$regex: search, $options: 'i'}
    }

    let result = Exam.find(queryObject)

    result = result.select("-questions -users")

    if(sort === 'latest'){
        result = result.sort("-createdAt")
    }

    if(sort === 'oldest'){
        result = result.sort("createdAt")
    }

    if(sort === 'a-z'){
        result = result.sort("name")
    }

    if(sort === 'z-a'){
        result = result.sort("-name")
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const exams = await result

    if(exams.length === 0){
        throw new NotFoundError('No Exam Found')
    }

    res.status(StatusCodes.OK).json({nHits: exams.length, exams})
}

const getExamAdmin = async(req, res) => {
    const exam = await Exam.findOne({
        "_id": req.params.id,
        "createdBy": req.user.userId
    })

    if(!exam){
        throw new NotFoundError(`No exam with id ${req.params.id} was found`);
    }

    res.status(StatusCodes.OK).json({exam})
}

const updateExam = async (req, res) => {
    res.send('Exam Update Route')
}

module.exports = {
    getExamsUser,
    getExamUser,
    createExam,
    startExam,
    endExam,
    getExamsAdmin,
    getExamAdmin,
    updateExam,
} 