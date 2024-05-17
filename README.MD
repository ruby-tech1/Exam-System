## createExam
	get exam details(name, questions, createdBy, users(userId), duration, startBy, stopBy)
	Update users - examStatus
	save exam

## getExamsUser
	get all exam for Db with userId present in the  exam users array show only the exam 	name, duration, number of questions

## getExamUser
	get specific exam using (examId) with userId present in the users array with all the 	details for user

## getExamsAdmin
	get all exam with createdBy matching userId with the needed details

## getExamAdmin
	get specific exam using examId with createdBy match userId with all details

## startExam
	Get exam with using examId and checking if userId is present in the exam users array
	check if exam is still valid(check if the stopBy date has not been exceded)
	Generate a token valid for duration in the exam object
	Send json data with the token

## endExam
	Verify the token received in the req.body
	Set token as expired
	Mark and Score answer
	Update the exam.users array and user.examStatus, user.answerExam array

## ExpireExam
	get exam using examId and createdBy matching userId
	update stopBy to present date.