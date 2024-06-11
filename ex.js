arr1 = {
  examId: "0123456789",
  examName: "Exam1",
  ans: [
    {
      questionId: "13323232323",
      ans: "apple",
      status: false,
      cAns: "Ball",
    },
    {
      questionId: "13323232330",
      ans: "bapple",
      status: true,
      cAns: "",
    },
  ],
};
let i = 0;

const temp = arr1.ans.reduce((cumm, item) => {
  i++;
  return cumm;
}, {});

console.log(i);

// const moment = require('moment');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// const a = new moment('2024-05-09T15:50:53.827+00:00').format('YYYY-MM-DDTHH:mm')
// const b = new Date('2024-05-09T18:32')
// // b.setHours(b.getHours() + 1)

// // console.log(a);
// // console.log(b.toISOString());

// const date1 = new Date('2024-05-09T18:52:00.000Z');
// const date2 = new Date('2024-05-09T15:51');
// const date3 = new Date()

// console.log(date1, date3);

// if(date1 < date3){
//     console.log(true);
// }else{
//     console.log(false);
// }

// let time = (12600 / 60)

// if(time % 60 === 0){
//     time = time / 60;
//     console.log(`The time in hours is ${time} hour`)
// }else{
//     let min = time % 60
//     time = (time - min) / 60
//     console.log(`the time is ${time} hours and ${min} mintues`)
// }

// const tim = (t) => {
//     let time = t / 60
//     if(time % 60 === 0){
//         time /= 60
//         return [time]
//     }
//     let min = time % 60
//     time = (time - min) / 60
//     return [time, min]
// }

// console.log(tim(7200));

// const Datee1 = new Date();
// const Datee2 = new Date();

// const timee = [1, 30];
// if(timee.length === 1){
//     Datee2.setHours(Datee2.getHours() + timee[0]);
// }else{
//     Datee2.setHours(Datee2.getHours() + timee[0], Datee2.getMinutes() + timee[1]);
// }

// console.log(Datee1, Datee2)

// const token = jwt.sign(
//     {userId: '663d0616219c700401b16a1f', name: 'Ruby'},
//     process.env.JWT_SECRET,
//     {expiresIn: '30d'}
// )

// console.log(token);

// arr = {
//     examId: '0123456789',
//     examName: 'Exam1',
//     ans: [
//         {
//             questionId: '13323232323',
//             ans: 'apple',
//             status: false,
//             cAns: 'Ball'
//         },
//         {
//             questionId: '13323232330',
//             ans: 'bapple',
//             status: true,
//             cAns: ''
//         },
//     ]
// }

// arr1 = {
//     examId: '0123456789',
//     examName: 'Exam1',
//     ans: [
//         {
//             questionId: '13323232323',
//             ans: 'apple',
//             status: false,
//             cAns: 'Ball'
//         },
//         {
//             questionId: '13323232330',
//             ans: 'bapple',
//             status: true,
//             cAns: ''
//         },
//     ]
// }
// const num = Object.keys(arr.ans).length
// let j = 0

// for(i=1; i <= num; i++){
//     if(arr.ans[i][0] === arr1.ans[i][0]){
//         j++;
//     }else{
//         for(const ele of arr1.ans[i]){
//             arr.ans[i].push(ele)
//         }
//     }
// }

// for(i=1; i <= num; i++){
//     console.log(arr.ans[i]);
// }

// // arr2 = ['a', 'apple']
// // arr3 = ['a', 'aapple']

// // if(arr2[0] === arr3[0]){
// //     console.log('sucess');
// // }

// console.log(j);

// const arr5 = [
//     {examID: '12334', status: 'pending'},
//     {examID: '12334', status: 'pending'},
// ]

// console.log(arr5);

//Start exam
// const exam = await Exam.findOne({
//   _id: req.params.id,
//   "users.userId": req.user.userId,
//   status: "deployed",
// }).select("-users");

// if (!exam) {
//   throw new CustomError.BadRequestError(`Invalid Exam Details`);
// }
// const exam1 = await Exam.findOne(
//   {
//     _id: req.params.id,
//     "users.userId": req.user.userId,
//   },
//   {
//     users: {
//       $elemMatch: { userId: req.user.userId },
//     },
//   }
// );
// await utils.updateExamStatus({
//   Attempt,
//   userId: req.user.userId,
//   examId: req.params.id,
//   status: "Pending",
//   Date1,
//   Date2,
// });
// await utils.updateUserExamStatus({
//   userStudent,
//   userId: req.user.userId,
//   examId: req.params.id,
//   status: "Pending",
// });

// End Exam
// const exam = await Exam.findOne({
//   _id: req.body.examId,
//   "users.userId": req.user.userId,
// });

// if (!exam) {
//   throw new CustomError.BadRequestError(`Invalid Exam Details`);
// }

// const exam1 = await Exam.findOne(
//   { _id: req.body.examId, "users.userId": req.user.userId },
//   {
//     users: {
//       $elemMatch: { userId: req.user.userId },
//     },
//   }
// );
// await utils.updateUserExamStatus({
//   userStudent,
//   userId: req.user.userId,
//   examId: req.body.examId,
//   status: "Taken",
// });
// await utils.updateExamAns({
//   Exam,
//   userId: req.user.userId,
//   examId: req.body.examId,
//   status: "Taken",
//   ans: ansArray,
// });

// const update = await utils.updateUserAnsweredExams({
//   userStudent,
//   userId: req.user.userId,
//   examId: req.body.examId,
//   ans: ansArray,
//   numOfQuestion: exam.numberOfQuestions,
// });

// const updateUserExamStatus = async ({
//   userStudent,
//   userId,
//   examId,
//   status,
// }) => {
//   await userStudent.findOneAndUpdate(
//     { _id: userId },
//     { $set: { "examStatus.$[e1].status": status } },
//     { arrayFilters: [{ "e1.examID": examId }] },
//     { runValidators: true }
//   );
// };

// const updateExamStatus = async ({
//   Exam,
//   userId,
//   examId,
//   status,
//   Date1,
//   Date2,
// }) => {
//   await Exam.findOneAndUpdate(
//     {
//       _id: examId,
//       "users.userId": userId,
//     },
//     {
//       $set: {
//         "users.$[e1].startTime": Date1,
//         "users.$[e1].stopTime": Date2,
//         "users.$[e1].status": status,
//       },
//     },
//     { arrayFilters: [{ "e1.userId": userId }] },
//     { runValidators: true }
//   );
// };

// const updateExamAns = async ({ Exam, userId, examId, status, ans }) => {
//   await Exam.findOneAndUpdate(
//     {
//       _id: examId,
//       "users.userId": userId,
//     },
//     {
//       $set: {
//         "users.$[e1].status": status,
//         "users.$[e1].score": ans[0],
//         "users.$[e1].ans": ans[1],
//       },
//     },
//     { arrayFilters: [{ "e1.userId": userId }] },
//     { runValidators: true }
//   );
// };

// const updateUserAnsweredExams = async ({
//   userStudent,
//   userId,
//   examId,
//   ans,
//   numOfQuestion,
// }) => {
//   const update = await userStudent
//     .findOneAndUpdate(
//       { _id: userId },
//       {
//         $push: {
//           answeredExams: {
//             examID: examId,
//             answer: ans[1],
//             score: ans[0],
//             numberOfQuestions: numOfQuestion,
//           },
//         },
//       },
//       { new: true, runValidators: true }
//     )
//     .select("name email gender answeredExams");
//   return update;
// };
