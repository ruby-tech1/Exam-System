const CustomError = require("../errors/index");

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

const scoreTest = ({ userAnswers, examQuestions }) => {
  let score = 0;
  const tempAns = userAnswers.reduce((total, ques) => {
    const tempQuestion = examQuestions.find((temp) => {
      return temp._id.toString() === ques.questionId;
    });

    if (!tempQuestion) {
      throw new CustomError.BadRequestError("Inavlid Question");
    }
    const push = {
      questionId: ques.questionId,
      ans: ques.ans,
    };

    if (ques.ans !== tempQuestion.answer) {
      push.status = false;
      push.cAns = tempQuestion.answer;
      total.push(push);
      return total;
    }

    push.status = true;
    push.cAns = "";
    score++;

    total.push(push);
    return total;
  }, []);
  return [score, tempAns];
};

module.exports = scoreTest;
